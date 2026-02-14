import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { McqService } from "../services/mcq.service";
import { baseListInputSchema } from "../shared/filters";

export const mcqRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        subjectId: z.string().optional(),
        chapterId: z.string().optional(),
        type: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      return await service.list(input);
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      return await service.getById(input.id);
    }),

  create: baseMutationProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      return await service.create(input);
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      return await service.update(input.id, input.data);
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      return await service.delete(input.id);
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      return await service.bulkDelete(input.ids);
    }),

  getStats: adminProcedure
    .input(z.object({ chapterId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      return await service.getStats(input.chapterId);
    }),
} satisfies TRPCRouterRecord);
