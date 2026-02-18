"use client";

import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";

// ============================================================================
// ACADEMIC TREE QUERIES
// ============================================================================

/**
 * Hook for fetching the complete nested academic hierarchy.
 * Non-suspense — exposes isLoading/isError for manual handling.
 * Optionally scoped to a specific class or subject, or filtered by a search term.
 */
export function useAcademicHierarchy(input?: {
  classId?: string;
  subjectId?: string;
  search?: string;
}) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicTree.getHierarchy.queryOptions(input),
    select: (data) => data.data,
  });
}

/**
 * Suspense variant of useAcademicHierarchy.
 * Wrap the consuming component in a <Suspense> boundary.
 */
export function useAcademicHierarchySuspense(input?: {
  classId?: string;
  subjectId?: string;
  search?: string;
}) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicTree.getHierarchy.queryOptions(input),
    select: (data) => data.data,
  });
}

/**
 * Hook for fetching flat counts for every level of the hierarchy.
 * Non-suspense — exposes isLoading for manual handling.
 * Ideal for dashboard stat cards.
 */
export function useAcademicCounts() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicTree.getCounts.queryOptions(),
    select: (data) => data.data,
  });
}

/**
 * Suspense variant of useAcademicCounts.
 * Wrap the consuming component in a <Suspense> boundary.
 */
export function useAcademicTreeCounts() {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicTree.getCounts.queryOptions(),
    select: (data) => data.data,
  });
}

/**
 * Hook for searching across all five levels of the hierarchy simultaneously.
 * Results are grouped by entity type (classes, subjects, chapters, topics, subTopics),
 * each with its full breadcrumb path back to the class.
 *
 * Only fires when `query` has at least 1 character.
 */
export function useAcademicHierarchySearch(query: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicTree.searchHierarchy.queryOptions({ query }),
    select: (data) => data.data,
    enabled: query.trim().length > 0,
  });
}
