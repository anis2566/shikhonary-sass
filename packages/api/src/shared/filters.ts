import { z } from "zod";

/**
 * Shared filter input schema
 */
export const filterInputSchema = z.object({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  status: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

/**
 * Shared sort input schema
 */
export const sortInputSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * Combined base list input schema for most list endpoints
 */
export const baseListInputSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  isActive: z.coerce.boolean().optional(),
});

export type FilterInput = z.infer<typeof filterInputSchema>;
export type SortInput = z.infer<typeof sortInputSchema>;
export type BaseListInput = z.infer<typeof baseListInputSchema>;
