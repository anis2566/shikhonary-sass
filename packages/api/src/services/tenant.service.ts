import { z } from "zod";
import { type PrismaClient } from "@workspace/db";
import { provisionTenantDb } from "@workspace/db/scripts/provision-tenant-db";
import { deleteTenantDb } from "@workspace/db/scripts/delete-tenant-db";
import { backupTenantDb } from "@workspace/db/scripts/backup-tenant-db";
import {
  tenantFormSchema,
  updateTenantSchema,
  uuidSchema,
  type Tenant,
} from "@workspace/schema";
import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  PaginatedResponse,
} from "../shared/pagination";

/**
 * Service for managing Tenants (Platform Level)
 */
export class TenantService {
  constructor(private db: PrismaClient) {}

  /**
   * List tenants with pagination and filters
   */
  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    type?: string;
  }): Promise<
    PaginatedResponse<Tenant & { _count: { members: number } }> | undefined
  > {
    try {
      const validSortColumns = [
        "name",
        "email",
        "createdAt",
        "updatedAt",
        "type",
        "slug",
      ];
      const sortBy =
        input.sortBy && validSortColumns.includes(input.sortBy)
          ? input.sortBy
          : "createdAt";

      const where: any = {};

      if (typeof input.isActive === "boolean") {
        where.isActive = input.isActive;
      }

      if (input.type) {
        where.type = input.type;
      }

      if (input.search) {
        where.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { slug: { contains: input.search, mode: "insensitive" } },
          { email: { contains: input.search, mode: "insensitive" } },
        ];
      }

      const orderBy = buildOrderBy({ sortBy, sortOrder: input.sortOrder });
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.tenant.findMany({
          where,
          orderBy,
          ...pagination,
          include: {
            _count: {
              select: { members: true },
            },
          },
        }),
        this.db.tenant.count({ where }),
      ]);

      return createPaginatedResponse(
        items as any,
        total,
        input.page,
        input.limit,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get tenant by ID
   */
  async getById(id: string) {
    try {
      const validatedId = uuidSchema.parse(id);
      const tenant = await this.db.tenant.findUnique({
        where: { id: validatedId },
        include: {
          subscription: {
            include: { plan: true },
          },
          owner: true,
          invitations: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      return tenant;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Create a new tenant.
   * 1. Validates input with Zod.
   * 2. Creates the tenant record + optional subscription in a transaction.
   * 3. Provisions a dedicated PostgreSQL database for the tenant.
   * 4. Updates databaseStatus to ACTIVE on success.
   */
  async create(input: unknown): Promise<Tenant | undefined> {
    try {
      const data = tenantFormSchema.parse(input);
      const { planId, ...tenantData } = data;

      const tenant = await this.db.$transaction(async (tx) => {
        const createdTenant = await tx.tenant.create({
          data: {
            ...tenantData,
            databaseStatus: "PENDING",
            metadata: tenantData.metadata || {},
          },
        });

        if (planId) {
          const plan = await tx.subscriptionPlan.findUnique({
            where: { id: planId },
          });

          if (plan) {
            const now = new Date();
            const oneMonthLater = new Date(now);
            oneMonthLater.setMonth(now.getMonth() + 1);

            await tx.subscription.create({
              data: {
                tenantId: createdTenant.id,
                planId: plan.id,
                status: "ACTIVE",
                currentPeriodStart: now,
                currentPeriodEnd: oneMonthLater,
                pricePerMonth: plan.monthlyPriceBDT,
                pricePerYear: plan.yearlyPriceBDT,
                billingCycle: "monthly",
                currency: "BDT",
                // Apply per-tenant overrides from the form (fall back to plan defaults)
                customStudentLimit: tenantData.customStudentLimit ?? undefined,
                customTeacherLimit: tenantData.customTeacherLimit ?? undefined,
                customExamLimit: tenantData.customExamLimit ?? undefined,
                customStorageLimit: tenantData.customStorageLimit ?? undefined,
              },
            });
          }
        }

        return createdTenant;
      });

      // Provision the dedicated PostgreSQL database after the record is committed
      if (tenant) {
        try {
          await provisionTenantDb(tenant.id);
        } catch (provisionError) {
          // Log but don't throw — the tenant record exists; DB can be re-provisioned manually
          console.error(
            `Failed to provision database for tenant ${tenant.id}:`,
            provisionError,
          );
        }
      }

      return tenant as unknown as Tenant;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Update tenant details.
   */
  async update(id: string, input: unknown): Promise<Tenant | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateTenantSchema.parse(input);

      const tenant = await this.db.tenant.update({
        where: { id: validatedId },
        data: {
          ...data,
          metadata: data.metadata || undefined,
        },
      });
      return tenant as unknown as Tenant;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Delete a tenant.
   * 1. Drops the tenant's dedicated PostgreSQL database (via deleteTenantDb).
   * 2. Deletes the tenant record from the master database.
   *
   * The DB is dropped first so that if the record deletion fails we can
   * still retry. If the DB drop fails we abort to avoid orphaned records.
   */
  async delete(id: string): Promise<Tenant | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);

      // Check whether the tenant has a provisioned database
      const existing = await this.db.tenant.findUnique({
        where: { id: validatedId },
        select: { connectionString: true, databaseStatus: true },
      });

      // Drop the tenant database if one was provisioned
      if (existing?.connectionString) {
        try {
          await deleteTenantDb(validatedId);
        } catch (dbError) {
          console.error(
            `Failed to drop database for tenant ${validatedId}:`,
            dbError,
          );
          // Re-throw so the caller knows the deletion was incomplete
          throw dbError;
        }
      }

      // Delete the master record
      const tenant = await this.db.tenant.delete({
        where: { id: validatedId },
      });
      return tenant as unknown as Tenant;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Backup a tenant's database using pg_dump.
   * Requires pg_dump to be installed on the server.
   * Returns the file path of the created backup.
   */
  async backup(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const validatedId = uuidSchema.parse(id);

      const tenant = await this.db.tenant.findUnique({
        where: { id: validatedId },
        select: { connectionString: true, name: true },
      });

      if (!tenant?.connectionString) {
        return {
          success: false,
          message: "Tenant has no provisioned database to back up.",
        };
      }

      await backupTenantDb(validatedId);

      return {
        success: true,
        message: `Backup for tenant "${tenant.name}" completed successfully.`,
      };
    } catch (error) {
      handlePrismaError(error);
      // handlePrismaError always throws, but TS needs a return
      return { success: false, message: "Backup failed." };
    }
  }

  /**
   * Re-provision (repair) a tenant's database.
   * Useful when databaseStatus is PENDING or INACTIVE and needs to be restored.
   */
  async reprovision(id: string): Promise<Tenant | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);

      await provisionTenantDb(validatedId);

      const tenant = await this.db.tenant.findUnique({
        where: { id: validatedId },
      });
      return tenant as unknown as Tenant;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Toggle tenant active status
   */
  async toggleStatus(id: string): Promise<Tenant | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const tenant = await this.db.tenant.findUnique({
        where: { id: validatedId },
        select: { isActive: true },
      });

      if (!tenant) return null;

      const updated = await this.db.tenant.update({
        where: { id: validatedId },
        data: { isActive: !tenant.isActive },
      });
      return updated as unknown as Tenant;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Bulk activate tenants
   */
  async bulkActive(ids: string[]): Promise<void> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      await this.db.tenant.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Bulk deactivate tenants
   */
  async bulkDeactive(ids: string[]): Promise<void> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      await this.db.tenant.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive: false },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Bulk delete tenants.
   * Drops each tenant's database before removing the master record.
   * Failures on individual DB drops are logged but do not abort the others.
   */
  async bulkDelete(ids: string[]): Promise<void> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);

      // Fetch which tenants actually have provisioned databases
      const tenants = await this.db.tenant.findMany({
        where: { id: { in: validatedIds }, connectionString: { not: null } },
        select: { id: true },
      });

      // Drop each tenant database (best-effort, log failures)
      await Promise.allSettled(
        tenants.map(async (t) => {
          try {
            await deleteTenantDb(t.id);
          } catch (err) {
            console.error(`Failed to drop DB for tenant ${t.id}:`, err);
          }
        }),
      );

      // Delete all master records regardless of individual DB drop results
      await this.db.tenant.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get tenant statistics
   */
  async getStats(): Promise<
    | {
        total: number;
        active: number;
        inactive: number;
        suspended: number;
        byType: Record<string, number>;
        byDatabaseStatus: Record<string, number>;
      }
    | undefined
  > {
    try {
      const [total, active, inactive, suspended, byType, byDatabaseStatus] =
        await Promise.all([
          this.db.tenant.count(),
          this.db.tenant.count({ where: { isActive: true } }),
          this.db.tenant.count({ where: { isActive: false } }),
          this.db.tenant.count({ where: { isSuspended: true } }),
          this.db.tenant.groupBy({ by: ["type"], _count: true }),
          this.db.tenant.groupBy({ by: ["databaseStatus"], _count: true }),
        ]);

      return {
        total,
        active,
        inactive,
        suspended,
        byType: byType.reduce(
          (acc, item) => ({ ...acc, [item.type]: item._count }),
          {} as Record<string, number>,
        ),
        byDatabaseStatus: byDatabaseStatus.reduce(
          (acc, item) => ({
            ...acc,
            [item.databaseStatus]: item._count,
          }),
          {} as Record<string, number>,
        ),
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
