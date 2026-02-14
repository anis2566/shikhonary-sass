import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { StudentService } from "../services/student.service";
import { baseListInputSchema } from "../shared/filters";

/**
 * Tenant-level Student Management Router
 */
export const studentRouter = createTRPCRouter({
  list: tenantProcedure
    .input(
      baseListInputSchema.extend({
        batchId: z.string().optional(),
        classId: z.string().optional(),
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
      return await service.create(input);
    }),

  update: baseTenantMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient);
      return await service.update(input.id, input.data);
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient);
      return await service.delete(input.id);
    }),

  bulkImport: baseTenantMutationProcedure
    .input(z.array(z.any()))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient);
      return await service.bulkImport(input);
    }),
} satisfies TRPCRouterRecord);
