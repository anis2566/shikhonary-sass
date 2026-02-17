import { z } from "zod";
import { type PrismaClient } from "@workspace/db";
import { provisionTenantDb } from "@workspace/db/scripts/provision-tenant-db";
import {
  tenantFormSchema,
  updateTenantSchema,
  uuidSchema,
  type Tenant,
  type TenantFormValues,
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
      // Validate sortBy to prevent invalid column errors
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

      // Build where clause manually to ensure only valid fields
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
      const tenant = await this.db.tenant.findUnique({
        where: { id: uuidSchema.parse(id) },
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
   * Create a new tenant
   */
  async create(input: unknown): Promise<Tenant | undefined> {
    try {
      const data = tenantFormSchema.parse(input);

      // Separate relation fields and tenant fields
      const { planId, ...tenantData } = data;

      // Start a transaction to ensure atomic tenant and subscription creation
      const tenant = await this.db.$transaction(async (tx) => {
        // Create the tenant
        const createdTenant = await tx.tenant.create({
          data: {
            ...tenantData,
            databaseStatus: "PENDING",
            metadata: tenantData.metadata || {},
          },
        });

        // If planId is provided, create the subscription
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
              },
            });
          }
        }

        return createdTenant;
      });

      // Provision the database after the tenant record is created
      if (tenant) {
        try {
          await provisionTenantDb(tenant.id);
        } catch (provisionError) {
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
   * Update tenant
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
   * Delete tenant
   */
  async delete(id: string): Promise<Tenant | undefined> {
    try {
      const tenant = await this.db.tenant.delete({
        where: { id: uuidSchema.parse(id) },
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
   * Bulk delete tenants
   */
  async bulkDelete(ids: string[]): Promise<void> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
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
      }
    | undefined
  > {
    try {
      const [total, active, inactive, suspended, byType] = await Promise.all([
        this.db.tenant.count(),
        this.db.tenant.count({ where: { isActive: true } }),
        this.db.tenant.count({ where: { isActive: false } }),
        this.db.tenant.count({ where: { isSuspended: true } }),
        this.db.tenant.groupBy({
          by: ["type"],
          _count: true,
        }),
      ]);

      return {
        total,
        active,
        inactive,
        suspended,
        byType: byType.reduce(
          (acc, item) => ({
            ...acc,
            [item.type]: item._count,
          }),
          {} as Record<string, number>,
        ),
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
