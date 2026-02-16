import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { AcademicTopicService } from "../services/academic-topic.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";

import {
  academicTopicFormSchema,
  updateAcademicTopicSchema,
} from "@workspace/schema";

export const academicTopicRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        classId: zNullishString,
        subjectId: zNullishString,
        chapterId: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      const data = await service.list(input);
      return {
        success: true,
        data,
      };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      const data = await service.getById(input.id);
      return {
        success: true,
        data,
      };
    }),

  create: baseMutationProcedure
    .input(academicTopicFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Topic created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: updateAcademicTopicSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Topic updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Topic deleted successfully",
        data,
      };
    }),

  bulkActive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      await service.bulkActive(input.ids);
      return {
        success: true,
        message: "Academic topics activated successfully",
      };
    }),

  bulkDeactive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      await service.bulkDeactive(input.ids);
      return {
        success: true,
        message: "Academic topics deactivated successfully",
      };
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Academic topics deleted successfully",
      };
    }),

  reorder: baseMutationProcedure
    .input(z.array(z.object({ id: z.string(), position: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      const data = await service.reorder(input);
      return {
        success: true,
        message: "Topics reordered successfully",
        data,
      };
    }),

  getStats: adminProcedure
    .input(z.object({ chapterId: zNullishString }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      const data = await service.getStats(input.chapterId);
      return {
        success: true,
        data,
      };
    }),

  forSelection: adminProcedure
    .input(z.object({ chapterId: zNullishString }).optional())
    .query(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      const data = await service.forSelection(input?.chapterId);
      return {
        success: true,
        data,
      };
    }),

  getDetailedStats: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      const data = await service.getDetailedStats(input.id);
      return {
        success: true,
        data,
      };
    }),

  getRecentSubTopics: adminProcedure
    .input(
      z.object({
        topicId: z.string(),
        limit: z.number().min(1).max(10).default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      const data = await service.getRecentSubTopics(input);
      return {
        success: true,
        data,
      };
    }),

  getStatisticsData: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicTopicService(ctx.db);
      const data = await service.getStatisticsData(input.id);
      return {
        success: true,
        data,
      };
    }),
});
