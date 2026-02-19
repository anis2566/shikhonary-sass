import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../trpc/index";
import { SubscriptionService } from "../services/subscription.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";

export const subscriptionRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        status: zNullishString,
        tier: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new SubscriptionService(ctx.db);
      const data = await service.list(input);
      return {
        success: true,
        data,
      };
    }),

  getStats: adminProcedure.query(async ({ ctx }) => {
    const service = new SubscriptionService(ctx.db);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new SubscriptionService(ctx.db);
      const data = await service.getById(input.id);
      return {
        success: true,
        data,
      };
    }),
});
