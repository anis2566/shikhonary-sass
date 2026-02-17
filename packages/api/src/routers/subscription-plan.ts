import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
} from "../trpc/index";
import { SubscriptionService } from "../services/subscription.service";

export const subscriptionPlanRouter = createTRPCRouter({
  listPlans: publicProcedure.query(async ({ ctx }) => {
    const service = new SubscriptionService(ctx.db);
    return await service.listPlans();
  }),

  getUsage: adminProcedure
    .input(z.object({ tenantId: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new SubscriptionService(ctx.db);
      return await service.getUsageStats(input.tenantId);
    }),

  assignPlan: adminProcedure
    .input(
      z.object({
        tenantId: z.string(),
        planId: z.string(),
        billingCycle: z.enum(["monthly", "yearly"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new SubscriptionService(ctx.db);
      const data = await service.assignPlan(input);
      return {
        success: true,
        message: "Plan assigned successfully",
        data,
      };
    }),

  forSelection: adminProcedure.query(async ({ ctx }) => {
    const service = new SubscriptionService(ctx.db);
    const data = await service.forSelection();
    return {
      success: true,
      data,
    };
  }),
} satisfies TRPCRouterRecord);
