import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
  mutationMiddleware,
} from "../trpc/index";
import { SubscriptionPlanService } from "../services/subscription-plan.service";
import { baseListInputSchema } from "../shared/filters";
import {
  subscriptionPlanFormSchema,
  updateSubscriptionPlanSchema,
} from "@workspace/schema";

const adminMutationProcedure = adminProcedure.use(mutationMiddleware);

export const subscriptionPlanRouter = createTRPCRouter({
  // ============================================================================
  // PUBLIC PROCEDURES
  // ============================================================================

  // List all subscription plans (public - for pricing page)
  list: publicProcedure
    .input(baseListInputSchema)
    .query(async ({ ctx, input }) => {
      const service = new SubscriptionPlanService(ctx.db);
      const data = await service.list(input);
      return {
        success: true,
        data,
      };
    }),

  // Get plan by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new SubscriptionPlanService(ctx.db);
      const data = await service.getById(input.id);
      return {
        success: true,
        data,
      };
    }),

  // ============================================================================
  // ADMIN PROCEDURES
  // ============================================================================

  // Create subscription plan
  createOne: adminMutationProcedure
    .input(subscriptionPlanFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new SubscriptionPlanService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Subscription plan created successfully",
        data,
      };
    }),

  // Update subscription plan
  update: adminMutationProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateSubscriptionPlanSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new SubscriptionPlanService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Subscription plan updated successfully",
        data,
      };
    }),

  // Delete subscription plan
  delete: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new SubscriptionPlanService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Subscription plan deleted successfully",
        data,
      };
    }),

  // Activate plan
  activate: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new SubscriptionPlanService(ctx.db);
      await service.activate(input.id);
      return {
        success: true,
        message: "Subscription plan activated successfully",
      };
    }),

  // Deactivate plan
  deactivate: adminMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new SubscriptionPlanService(ctx.db);
      await service.deactivate(input.id);
      return {
        success: true,
        message: "Subscription plan deactivated successfully",
      };
    }),

  // Set as popular
  setPopular: adminMutationProcedure
    .input(z.object({ id: z.string(), isPopular: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const service = new SubscriptionPlanService(ctx.db);
      await service.setPopular(input.id, input.isPopular);
      return {
        success: true,
        message: input.isPopular
          ? "Plan marked as popular"
          : "Plan unmarked as popular",
      };
    }),

  // Get plan statistics
  getStats: publicProcedure.query(async ({ ctx }) => {
    const service = new SubscriptionPlanService(ctx.db);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),

  // For subscription plan form selection
  forSelection: publicProcedure.query(async ({ ctx }) => {
    const service = new SubscriptionPlanService(ctx.db);
    const data = await service.forSelection();
    return {
      success: true,
      data,
    };
  }),
});
