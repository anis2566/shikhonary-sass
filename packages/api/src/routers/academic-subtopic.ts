import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { AcademicSubTopicService } from "../services/academic-subtopic.service";
import { baseListInputSchema } from "../shared/filters";

export const academicSubTopicRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        topicId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      return await service.list(input);
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      return await service.getById(input.id);
    }),

  create: baseMutationProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      return await service.create(input);
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      return await service.update(input.id, input.data);
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      return await service.delete(input.id);
    }),

  reorder: baseMutationProcedure
    .input(z.array(z.object({ id: z.string(), position: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      return await service.reorder(input);
    }),

  getStats: adminProcedure
    .input(z.object({ topicId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubTopicService(ctx.db);
      return await service.getStats(input.topicId);
    }),
} satisfies TRPCRouterRecord);
