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
 * Helpers to handle nullish values from nuqs by converting null to undefined.
 * This ensures compatibility with the service layer which expects optional (undefined) rather than null.
 */
export const zNullishString = z.preprocess(
  (v) => (v === null ? undefined : v),
  z.string().optional(),
) as z.ZodType<string | undefined, z.ZodTypeDef, string | null | undefined>;

export const zNullishBoolean = z.preprocess((val) => {
  if (val === "ACTIVE" || val === "true" || val === true) return true;
  if (val === "INACTIVE" || val === "false" || val === false) return false;
  if (val === "" || val === null || val === undefined) return undefined;
  return val;
}, z.boolean().optional()) as z.ZodType<
  boolean | undefined,
  z.ZodTypeDef,
  string | boolean | null | undefined
>;

/**
 * Combined base list input schema for most list endpoints
 */
export const baseListInputSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: zNullishString,
  sortBy: zNullishString,
  sortOrder: z.preprocess(
    (v) => (v === null ? undefined : v),
    z.enum(["asc", "desc"]).optional().default("desc"),
  ) as z.ZodType<
    "asc" | "desc",
    z.ZodTypeDef,
    "asc" | "desc" | null | undefined
  >,
  isActive: zNullishBoolean,
});

export type FilterInput = z.infer<typeof filterInputSchema>;
export type SortInput = z.infer<typeof sortInputSchema>;
export type BaseListInput = z.infer<typeof baseListInputSchema>;
