import { z } from "zod";
import { type PrismaClient } from "@workspace/db";
import {
  type SubscriptionPlan,
  type Subscription,
  uuidSchema,
} from "@workspace/schema";
import { handlePrismaError } from "../middleware/error-handler";

const assignPlanSchema = z.object({
  tenantId: uuidSchema,
  planId: uuidSchema,
  billingCycle: z.enum(["monthly", "yearly"]),
});

/**
 * Service for managing subscriptions and plans
 */
export class SubscriptionService {
  constructor(private db: PrismaClient) {}

  /**
   * List all available plans
   */
  async listPlans(): Promise<SubscriptionPlan[] | undefined> {
    try {
      const items = await this.db.subscriptionPlan.findMany({
        orderBy: { monthlyPriceBDT: "asc" },
      });
      return items as unknown as SubscriptionPlan[];
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get subscription details for a tenant
   */
  async getTenantSubscription(
    tenantId: string,
  ): Promise<(Subscription & { plan: SubscriptionPlan }) | null | undefined> {
    try {
      const validatedTenantId = uuidSchema.parse(tenantId);
      const item = await this.db.subscription.findUnique({
        where: { tenantId: validatedTenantId },
        include: { plan: true },
      });
      return item as any;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Assign or upgrade a plan for a tenant
   */
  async assignPlan(input: Subscription): Promise<Subscription | undefined> {
    try {
      const params = assignPlanSchema.parse(input);

      const plan = await this.db.subscriptionPlan.findUnique({
        where: { id: params.planId },
      });

      if (!plan) throw new Error("Plan not found");

      const item = await this.db.subscription.upsert({
        where: { tenantId: params.tenantId },
        create: {
          tenantId: params.tenantId,
          planId: params.planId,
          status: "ACTIVE",
          billingCycle: params.billingCycle,
          pricePerMonth: plan.monthlyPriceBDT,
          pricePerYear: plan.yearlyPriceBDT,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        update: {
          planId: params.planId,
          status: "ACTIVE",
          billingCycle: params.billingCycle,
        },
      });
      return item as unknown as Subscription;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get usage vs limits for a tenant
   */
  async getUsageStats(tenantId: string): Promise<any | undefined> {
    try {
      const validatedTenantId = uuidSchema.parse(tenantId);
      const tenant = await this.db.tenant.findUnique({
        where: { id: validatedTenantId },
        include: { subscription: { include: { plan: true } } },
      });

      if (!tenant) throw new Error("Tenant not found");

      const plan = tenant.subscription?.plan;

      return {
        students: {
          current: tenant.studentCount,
          limit: tenant.customStudentLimit ?? plan?.defaultStudentLimit ?? 0,
        },
        teachers: {
          current: tenant.teacherCount,
          limit: tenant.customTeacherLimit ?? plan?.defaultTeacherLimit ?? 0,
        },
        exams: {
          current: tenant.examCount,
          limit: tenant.customExamLimit ?? plan?.defaultExamLimit ?? 0,
        },
        storage: {
          current: tenant.storageUsedMB,
          limit: tenant.customStorageLimit ?? plan?.defaultStorageLimit ?? 0,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get all active plans for selection
   */
  async forSelection(): Promise<
    | {
        id: string;
        displayName: string;
        monthlyPriceBDT: number;
        yearlyPriceBDT: number;
        defaultStudentLimit: number;
        defaultTeacherLimit: number;
        defaultExamLimit: number;
        defaultStorageLimit: number;
      }[]
    | undefined
  > {
    try {
      return await this.db.subscriptionPlan.findMany({
        where: { isActive: true },
        select: {
          id: true,
          displayName: true,
          monthlyPriceBDT: true,
          yearlyPriceBDT: true,
          defaultStudentLimit: true,
          defaultTeacherLimit: true,
          defaultExamLimit: true,
          defaultStorageLimit: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
