import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { TenantService } from "../services/tenant.service";
import { baseListInputSchema } from "../shared/filters";

/**
 * Platform-wide Tenant Management Router (Admin Only)
 */
export const tenantRouter = createTRPCRouter({
  list: adminProcedure
    .input(baseListInputSchema)
    .query(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      return await service.list(input);
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      return await service.getById(input.id);
    }),

  create: baseMutationProcedure
    .input(z.any()) // Replace with proper schema from @workspace/schema
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      return await service.create(input);
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      return await service.update(input.id, input.data);
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      return await service.delete(input.id);
    }),

  toggleStatus: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      return await service.toggleStatus(input.id);
    }),
} satisfies TRPCRouterRecord);
