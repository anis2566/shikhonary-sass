import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { AcademicClassService } from "../services/academic-class.service";
import { baseListInputSchema } from "../shared/filters";

export const academicClassRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        level: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      return await service.list(input);
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      return await service.getById(input.id);
    }),

  create: baseMutationProcedure
    .input(z.any()) // Use AcademicClassSchema from @workspace/schema
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      return await service.create(input);
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      return await service.update(input.id, input.data);
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      return await service.delete(input.id);
    }),

  reorder: baseMutationProcedure
    .input(z.array(z.object({ id: z.string(), position: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      return await service.reorder(input);
    }),

  getStats: adminProcedure.query(async ({ ctx }) => {
    const service = new AcademicClassService(ctx.db);
    return await service.getStats();
  }),
});
