import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { AcademicChapterService } from "../services/academic-chapter.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";
import {
  academicChapterFormSchema,
  updateAcademicChapterSchema,
} from "@workspace/schema";

export const academicChapterRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        subjectId: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.list(input);
      return {
        success: true,
        data,
      };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.getById(input.id);
      return {
        success: true,
        data,
      };
    }),

  create: baseMutationProcedure
    .input(academicChapterFormSchema)
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
    .input(z.object({ id: z.string(), data: updateAcademicChapterSchema }))
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
      const data = await service.getStats(input.subjectId);
      return {
        success: true,
        data,
      };
    }),

  getDetailedStats: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.getDetailedStats(input.id);
      return {
        success: true,
        data,
      };
    }),

  getStatisticsData: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.getStatisticsData(input.id);
      return {
        success: true,
        data,
      };
    }),

  getRecentTopics: adminProcedure
    .input(z.object({ chapterId: z.string(), limit: z.number().default(4) }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicChapterService(ctx.db);
      const data = await service.getRecentTopics(input);
      return {
        success: true,
        data,
      };
    }),
});
