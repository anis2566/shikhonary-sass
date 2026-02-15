import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { AcademicChapterService } from "../services/academic-chapter.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";

export const academicChapterRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        subjectId: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      return await service.list(input);
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      return await service.getById(input.id);
    }),

  create: baseMutationProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Chapter created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Chapter updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Chapter deleted successfully",
        data,
      };
    }),

  bulkActive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      await service.bulkActive(input.ids);
      return {
        success: true,
        message: "Academic chapters activated successfully",
      };
    }),

  bulkDeactive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      await service.bulkDeactive(input.ids);
      return {
        success: true,
        message: "Academic chapters deactivated successfully",
      };
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Academic chapters deleted successfully",
      };
    }),

  reorder: baseMutationProcedure
    .input(z.array(z.object({ id: z.string(), position: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.reorder(input);
      return {
        success: true,
        message: "Chapters reordered successfully",
        data,
      };
    }),

  getStats: adminProcedure
    .input(z.object({ subjectId: zNullishString }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      return await service.getStats(input.subjectId);
    }),
} satisfies TRPCRouterRecord);
