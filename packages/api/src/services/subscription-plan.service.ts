import { z } from "zod";
import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";
import {
  type SubscriptionPlan,
  type PrismaClient,
  type Prisma,
} from "@workspace/db";
import {
  subscriptionPlanFormSchema,
  updateSubscriptionPlanSchema,
  uuidSchema,
} from "@workspace/schema";

export interface SubscriptionPlanWithRelations extends SubscriptionPlan {
  _count?: {
    subscriptions: number;
  };
}

export class SubscriptionPlanService {
  constructor(private db: PrismaClient) {}

  /**
   * List all subscription plans with pagination and search
   */
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
  }): Promise<PaginatedResponse<SubscriptionPlanWithRelations> | undefined> {
    try {
      const where: Prisma.SubscriptionPlanWhereInput = {};

      if (input.search) {
        where.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { displayName: { contains: input.search, mode: "insensitive" } },
          { description: { contains: input.search, mode: "insensitive" } },
        ];
      }

      if (input.isActive !== undefined) {
        where.isActive = input.isActive;
      }

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination({
        page: input.page ?? 1,
        limit: input.limit ?? 10,
      });

      const [items, total] = await Promise.all([
        this.db.subscriptionPlan.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { createdAt: "desc" },
          ...pagination,
          include: {
            _count: {
              select: { subscriptions: true },
            },
          },
        }),
        this.db.subscriptionPlan.count({ where }),
      ]);

      return createPaginatedResponse(
        items as SubscriptionPlanWithRelations[],
        total,
        input.page ?? 1,
        input.limit ?? 10,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get a subscription plan by ID
   */
  async getById(
    id: string,
  ): Promise<SubscriptionPlanWithRelations | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return (await this.db.subscriptionPlan.findUnique({
        where: { id: validatedId },
        include: {
          _count: {
            select: { subscriptions: true },
          },
        },
      })) as SubscriptionPlanWithRelations | null;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Create a new subscription plan
   */
  async create(
    input: z.infer<typeof subscriptionPlanFormSchema>,
  ): Promise<SubscriptionPlan | undefined> {
    try {
      const data = subscriptionPlanFormSchema.parse(input);
      return await this.db.subscriptionPlan.create({
        data: {
          ...data,
          features: data.features || {},
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Update an existing subscription plan
   */
  async update(
    id: string,
    input: z.infer<typeof updateSubscriptionPlanSchema>,
  ): Promise<SubscriptionPlan | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateSubscriptionPlanSchema.parse(input);
      return await this.db.subscriptionPlan.update({
        where: { id: validatedId },
        data: {
          ...data,
          features: data.features || undefined,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Delete a subscription plan
   */
  async delete(id: string): Promise<SubscriptionPlan | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);

      // Check if any tenants are using this plan
      const tenantsCount = await this.db.subscription.count({
        where: { planId: validatedId },
      });

      if (tenantsCount > 0) {
        throw new Error(
          `Cannot delete plan. ${tenantsCount} tenant(s) are currently using this plan.`,
        );
      }

      return await this.db.subscriptionPlan.delete({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Activate a subscription plan
   */
  async activate(id: string): Promise<SubscriptionPlan | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await this.db.subscriptionPlan.update({
        where: { id: validatedId },
        data: { isActive: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Deactivate a subscription plan
   */
  async deactivate(id: string): Promise<SubscriptionPlan | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await this.db.subscriptionPlan.update({
        where: { id: validatedId },
        data: { isActive: false },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Set plan popularity status
   */
  async setPopular(
    id: string,
    isPopular: boolean,
  ): Promise<SubscriptionPlan | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await this.db.subscriptionPlan.update({
        where: { id: validatedId },
        data: { isPopular },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get subscription plan statistics
   */
  async getStats() {
    try {
      const [totalCount, activeCount, popularCount] = await Promise.all([
        this.db.subscriptionPlan.count(),
        this.db.subscriptionPlan.count({ where: { isActive: true } }),
        this.db.subscriptionPlan.count({ where: { isPopular: true } }),
      ]);

      const plansWithTenants = await this.db.subscriptionPlan.findMany({
        select: {
          id: true,
          name: true,
          displayName: true,
          _count: {
            select: { subscriptions: true },
          },
        },
      });

      return {
        totalCount,
        activeCount,
        popularCount,
        plansWithTenants,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get plans available for selection (active only)
   */
  async forSelection() {
    try {
      return await this.db.subscriptionPlan.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          displayName: true,
          monthlyPriceBDT: true,
          defaultStudentLimit: true,
          defaultTeacherLimit: true,
          defaultStorageLimit: true,
          defaultExamLimit: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
