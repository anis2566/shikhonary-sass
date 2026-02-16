import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { AcademicSubTopicService } from "../services/academic-subtopic.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";

import {
  academicSubTopicFormSchema,
  updateAcademicSubTopicSchema,
} from "@workspace/schema";

export const academicSubTopicRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        classId: zNullishString,
        subjectId: zNullishString,
        chapterId: zNullishString,
        topicId: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      const data = await service.list(input);
      return {
        success: true,
        data,
      };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      const data = await service.getById(input.id);
      return {
        success: true,
        data,
      };
    }),

  create: baseMutationProcedure
    .input(academicSubTopicFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Subtopic created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: updateAcademicSubTopicSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Subtopic updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Subtopic deleted successfully",
        data,
      };
    }),

  bulkActive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      await service.bulkActive(input.ids);
      return {
        success: true,
        message: "Academic subtopics activated successfully",
      };
    }),

  bulkDeactive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      await service.bulkDeactive(input.ids);
      return {
        success: true,
        message: "Academic subtopics deactivated successfully",
      };
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Academic subtopics deleted successfully",
      };
    }),

  active: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      await service.bulkActive([input.id]);
      return {
        success: true,
        message: "Academic subtopic activated successfully",
      };
    }),

  deactivate: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      await service.bulkDeactive([input.id]);
      return {
        success: true,
        message: "Academic subtopic deactivated successfully",
      };
    }),

  reorder: baseMutationProcedure
    .input(z.array(z.object({ id: z.string(), position: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      const data = await service.reorder(input);
      return {
        success: true,
        message: "Subtopics reordered successfully",
        data,
      };
    }),

  getStats: adminProcedure
    .input(z.object({ topicId: zNullishString }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      const data = await service.getStats(input.topicId);
      return {
        success: true,
        data,
      };
    }),

  forSelection: adminProcedure
    .input(z.object({ topicId: zNullishString }).optional())
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      const data = await service.forSelection(input?.topicId);
      return {
        success: true,
        data,
      };
    }),

  getDetailedStats: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      const data = await service.getDetailedStats(input.id);
      return {
        success: true,
        data,
      };
    }),

  getStatisticsData: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      const data = await service.getStatisticsData(input.id);
      return {
        success: true,
        data,
      };
    }),

  getRecentQuestions: adminProcedure
    .input(z.object({ subTopicId: z.string(), limit: z.number().default(5) }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      const data = await service.getRecentQuestions(input);
      return {
        success: true,
        data,
      };
    }),
});
