import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { StudentService } from "../services/student.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";

/**
 * Tenant-level Student Management Router
 */
export const studentRouter = createTRPCRouter({
  list: tenantProcedure
    .input(
      baseListInputSchema.extend({
        batchId: zNullishString,
        classId: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient);
      return await service.list(input);
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient);
      return await service.getById(input.id);
    }),

  create: baseTenantMutationProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient);
      const data = await service.create(input);
      return {
        success: true,
        message: "Student created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Student updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Student deleted successfully",
        data,
      };
    }),

  bulkImport: baseTenantMutationProcedure
    .input(z.array(z.any()))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient);
      const data = await service.bulkImport(input);
      return {
        success: true,
        message: "Students imported successfully",
        data,
      };
    }),
} satisfies TRPCRouterRecord);
