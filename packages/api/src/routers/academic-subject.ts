import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { AcademicSubjectService } from "../services/academic-subject.service";
import { baseListInputSchema } from "../shared/filters";

export const academicSubjectRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        classId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      return await service.list(input);
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      return await service.getById(input.id);
    }),

  create: baseMutationProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      return await service.create(input);
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      return await service.update(input.id, input.data);
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      return await service.delete(input.id);
    }),

  reorder: baseMutationProcedure
    .input(z.array(z.object({ id: z.string(), position: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      return await service.reorder(input);
    }),

  getStats: adminProcedure
    .input(z.object({ classId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicSubjectService(ctx.db);
      return await service.getStats(input.classId);
    }),
} satisfies TRPCRouterRecord);
