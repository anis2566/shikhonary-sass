import { z } from "zod";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  SORT,
} from "@workspace/utils/constants";

/**
 * Shared schemas for pagination and filtering
 */

export const paginationInputSchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(100).default(DEFAULT_PAGE_SIZE),
});

export const sortInputSchema = z.object({
  sort: z.string().optional(),
  order: z.nativeEnum(SORT).default(SORT.DESC),
});

export const filterInputSchema = z.object({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const searchInputSchema = z.object({
  q: z.string().optional(),
});

/**
 * Combined list query schema
 */
export const listQuerySchema = paginationInputSchema
  .merge(sortInputSchema)
  .merge(filterInputSchema);

export type ListQueryInput = z.infer<typeof listQuerySchema>;
