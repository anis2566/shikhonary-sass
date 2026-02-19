import { z } from "zod";
import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination, buildOrderBy } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";
import {
  type Subscription,
  type PrismaClient,
  type Prisma,
  type Tenant,
  type SubscriptionPlan,
} from "@workspace/db";
import { uuidSchema } from "@workspace/schema";

export interface SubscriptionWithRelations extends Subscription {
  tenant: Tenant;
  plan: SubscriptionPlan;
}

export class SubscriptionService {
  constructor(private db: PrismaClient) {}

  /**
   * List all subscriptions with pagination and search
   */
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    tier?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResponse<SubscriptionWithRelations> | undefined> {
    try {
      const where: Prisma.SubscriptionWhereInput = {};

      if (input.search) {
        where.OR = [
          { tenant: { name: { contains: input.search, mode: "insensitive" } } },
          { plan: { name: { contains: input.search, mode: "insensitive" } } },
        ];
      }

      if (input.status && input.status !== "all") {
        where.status = input.status;
      }

      if (input.tier && input.tier !== "all") {
        where.plan = { name: input.tier };
      }

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination({
        page: input.page ?? 1,
        limit: input.limit ?? 10,
      });

      const [items, total] = await Promise.all([
        this.db.subscription.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { createdAt: "desc" },
          ...pagination,
          include: {
            tenant: true,
            plan: true,
          },
        }),
        this.db.subscription.count({ where }),
      ]);

      return createPaginatedResponse(
        items as SubscriptionWithRelations[],
        total,
        input.page ?? 1,
        input.limit ?? 10,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get subscription statistics
   */
  async getStats() {
    try {
      const [totalCount, activeCount, trialCount, pastDueCount] =
        await Promise.all([
          this.db.subscription.count(),
          this.db.subscription.count({ where: { status: "active" } }),
          this.db.subscription.count({ where: { status: "trial" } }),
          this.db.subscription.count({ where: { status: "past_due" } }),
        ]);

      const activeSubscriptions = await this.db.subscription.findMany({
        where: { status: "active" },
        select: { pricePerMonth: true },
      });

      const mrr = activeSubscriptions.reduce(
        (sum, sub) => sum + sub.pricePerMonth,
        0,
      );

      return {
        total: totalCount,
        active: activeCount,
        trial: trialCount,
        pastDue: pastDueCount,
        mrr,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get a subscription by ID
   */
  async getById(
    id: string,
  ): Promise<SubscriptionWithRelations | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return (await this.db.subscription.findUnique({
        where: { id: validatedId },
        include: {
          tenant: true,
          plan: true,
          history: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      })) as SubscriptionWithRelations | null;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
