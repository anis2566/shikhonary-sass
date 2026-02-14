import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { BatchService } from "../services/batch.service";
import { baseListInputSchema } from "../shared/filters";

export const batchRouter = createTRPCRouter({
  list: tenantProcedure
    .input(
      baseListInputSchema.extend({
        classId: z.string().optional(),
        academicYear: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient);
      return await service.list(input);
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient);
      return await service.getById(input.id);
    }),

  create: baseTenantMutationProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient);
      return await service.create(input);
    }),

  update: baseTenantMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient);
      return await service.update(input.id, input.data);
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient);
      return await service.delete(input.id);
    }),

  getStats: tenantProcedure
    .input(z.object({ classId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient);
      return await service.getStats(input.classId);
    }),
} satisfies TRPCRouterRecord);
