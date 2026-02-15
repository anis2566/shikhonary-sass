import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { BatchService } from "../services/batch.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";

export const batchRouter = createTRPCRouter({
  list: tenantProcedure
    .input(
      baseListInputSchema.extend({
        classId: zNullishString,
        academicYear: zNullishString,
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
      const data = await service.create(input);
      return {
        success: true,
        message: "Batch created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Batch updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Batch deleted successfully",
        data,
      };
    }),

  getStats: tenantProcedure
    .input(z.object({ classId: zNullishString }))
    .query(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient);
      return await service.getStats(input.classId);
    }),
} satisfies TRPCRouterRecord);
