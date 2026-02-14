import { type PrismaClient } from "@workspace/db";
import { type Tenant } from "@workspace/schema";
import { handlePrismaError } from "../middleware/error-handler";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  createPaginatedResponse,
  PaginatedResponse,
} from "../shared/pagination";

/**
 * Service for managing Tenants (Platform Level)
 */
export class TenantService {
  constructor(private db: PrismaClient) { }

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
  }): Promise<
    PaginatedResponse<Tenant & { _count: { members: number } }> | undefined
  > {
    try {
      const where = buildWhere(input, ["name", "slug", "email"]);
      const orderBy = buildOrderBy(input);
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
  async getById(id: string): Promise<any | null | undefined> {
    try {
      const tenant = await this.db.tenant.findUnique({
        where: { id },
        include: {
          subscription: {
            include: { plan: true },
          },
          owner: true,
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
  async create(data: any): Promise<Tenant | undefined> {
    try {
      const tenant = await this.db.tenant.create({
        data: {
          ...data,
          databaseStatus: "PENDING",
        },
      });
      return tenant as unknown as Tenant;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Update tenant
   */
  async update(id: string, data: any): Promise<Tenant | undefined> {
    try {
      const tenant = await this.db.tenant.update({
        where: { id },
        data,
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
        where: { id },
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
      const tenant = await this.db.tenant.findUnique({
        where: { id },
        select: { isActive: true },
      });

      if (!tenant) return null;

      const updated = await this.db.tenant.update({
        where: { id },
        data: { isActive: !tenant.isActive },
      });
      return updated as unknown as Tenant;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
