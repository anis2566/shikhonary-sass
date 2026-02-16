import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { AcademicSubjectService } from "../services/academic-subject.service";
import {
  baseListInputSchema,
  zNullishString,
  zNullishBoolean,
} from "../shared/filters";
import {
  academicSubjectFormSchema,
  updateAcademicSubjectSchema,
} from "@workspace/schema";

export const academicSubjectRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        classId: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.list(input);
      return {
        success: true,
        data,
      };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.getById(input.id);
      return {
        success: true,
        data,
      };
    }),

  create: baseMutationProcedure
    .input(academicSubjectFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Subject created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: updateAcademicSubjectSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Subject updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Subject deleted successfully",
        data,
      };
    }),

  reorder: baseMutationProcedure
    .input(z.array(z.object({ id: z.string(), position: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.reorder(input);
      return {
        success: true,
        message: "Subjects reordered successfully",
        data,
      };
    }),

  getStats: adminProcedure
    .input(z.object({ classId: zNullishString }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.getStats(input.classId);
      return {
        success: true,
        data,
      };
    }),

  bulkActive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      await service.bulkActive(input.ids);
      return {
        success: true,
        message: "Subjects activated successfully",
      };
    }),

  bulkDeactive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      await service.bulkDeactive(input.ids);
      return {
        success: true,
        message: "Subjects deactivated successfully",
      };
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Subjects deleted successfully",
      };
    }),

  getDetailedStats: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.getDetailedStats(input.id);
      return {
        success: true,
        data,
      };
    }),

  getStatisticsData: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.getStatisticsData(input.id);
      return {
        success: true,
        data,
      };
    }),

  getRecentChapters: adminProcedure
    .input(z.object({ subjectId: z.string(), limit: z.number().default(4) }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.getRecentChapters(input);
      return {
        success: true,
        data,
      };
    }),

  getRecentTopics: adminProcedure
    .input(z.object({ subjectId: z.string(), limit: z.number().default(4) }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.getRecentTopics(input);
      return {
        success: true,
        data,
      };
    }),

  forSelection: adminProcedure
    .input(z.object({ classId: zNullishString }).optional())
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      const data = await service.forSelection(input?.classId);
      return {
        success: true,
        data,
      };
    }),
});
