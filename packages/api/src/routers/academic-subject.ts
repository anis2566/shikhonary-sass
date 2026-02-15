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

export const academicSubjectRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        classId: zNullishString,
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
      const data = await service.create(input);
      return {
        success: true,
        message: "Subject created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
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
      return await service.getStats(input.classId);
    }),
} satisfies TRPCRouterRecord);
