import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { TenantService } from "../services/tenant.service";
import { baseListInputSchema } from "../shared/filters";
import { tenantFormSchema, updateTenantSchema } from "@workspace/schema";

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
    .input(tenantFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Tenant created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: updateTenantSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Tenant updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Tenant deleted successfully",
        data,
      };
    }),

  toggleStatus: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      const data = await service.toggleStatus(input.id);
      return {
        success: true,
        message: "Tenant status updated successfully",
        data,
      };
    }),

  bulkActive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      await service.bulkActive(input.ids);
      return {
        success: true,
        message: "Tenants activated successfully",
      };
    }),

  bulkDeactive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      await service.bulkDeactive(input.ids);
      return {
        success: true,
        message: "Tenants deactivated successfully",
      };
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Tenants deleted successfully",
      };
    }),

  getStats: adminProcedure.query(async ({ ctx }) => {
    const service = new TenantService(ctx.db);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),
} satisfies TRPCRouterRecord);
