import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../trpc/index";
import { AcademicTreeService } from "../services/academic-tree.service";

export const academicTreeRouter = createTRPCRouter({
  /**
   * Returns the full nested hierarchy:
   *   Class → Subject → Chapter → Topic → SubTopic
   * Optionally scoped by classId / subjectId, or filtered by a search term.
   */
  getHierarchy: adminProcedure
    .input(
      z
        .object({
          classId: z.string().optional(),
          subjectId: z.string().optional(),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicTreeService(ctx.db);
      const data = await service.getHierarchy(input ?? undefined);
      return {
        success: true,
        data,
      };
    }),

  /**
   * Returns flat counts for every level of the hierarchy.
   * Useful for dashboard stat cards.
   */
  getCounts: adminProcedure.query(async ({ ctx }) => {
    const service = new AcademicTreeService(ctx.db);
    const data = await service.getCounts();
    return {
      success: true,
      data,
    };
  }),

  /**
   * Cross-level search: returns matching entities from all five levels,
   * each with its full breadcrumb path back to the class.
   */
  searchHierarchy: adminProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicTreeService(ctx.db);
      const data = await service.searchHierarchy(input.query);
      return {
        success: true,
        data,
      };
    }),
});
