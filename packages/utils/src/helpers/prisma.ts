/**
 * Shared Prisma-related utilities
 */

/**
 * Builds a Prisma standard sort order object
 * Useful for normalizing sort parameters from URLs
 */
export const buildPrismaOrderBy = (
  sort: string | undefined,
  defaultField: string = "createdAt",
  defaultOrder: "asc" | "desc" = "desc",
) => {
  if (!sort) {
    return { [defaultField]: defaultOrder };
  }

  const [field, order] = sort.split("_");

  if (!field) return { [defaultField]: defaultOrder };

  // Handle position-based sorting specifically for reorderable items
  if (field === "position") {
    return { position: order === "desc" ? "desc" : "asc" };
  }

  return { [field]: order === "desc" ? "desc" : "asc" };
};

/**
 * Normalizes boolean strings from query params to actual Prisma booleans
 */
export const normalizePrismaBoolean = (value: string | boolean | undefined) => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};
