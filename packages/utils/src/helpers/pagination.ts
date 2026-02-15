/**
 * Pagination and query parsing logic
 */
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants/pagination";

/**
 * Calculates Prisma skip/take and metadata for pagination
 */
export const calculatePagination = (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_PAGE_SIZE,
  totalItems: number = 0,
) => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const totalPages = Math.ceil(totalItems / safeLimit);
  const skip = (safePage - 1) * safeLimit;

  return {
    skip,
    take: safeLimit,
    metadata: {
      currentPage: safePage,
      pageSize: safeLimit,
      totalItems,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  };
};

/**
 * Simple parser for URL query styles (converts "true" strings to boolean)
 */
export const parseBooleanParam = (
  value: string | null | undefined,
): boolean | undefined => {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

/**
 * Parses common URL search parameters into a structured object.
 * Useful for tRPC procedures or API routes.
 */
export const parseQueryFilters = (
  params: Record<string, string | string[] | undefined>,
) => {
  const page =
    typeof params.page === "string" ? parseInt(params.page) : DEFAULT_PAGE;
  const limit =
    typeof params.limit === "string"
      ? parseInt(params.limit)
      : DEFAULT_PAGE_SIZE;
  const sort = typeof params.sort === "string" ? params.sort : "desc";
  const isActive = parseBooleanParam(params.isActive as string);
  const search = typeof params.search === "string" ? params.search : undefined;

  return {
    page: Math.max(1, page),
    limit: Math.max(1, limit),
    sort,
    isActive,
    search,
  };
};
