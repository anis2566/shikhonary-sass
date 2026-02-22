"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type {
  ChapterDetailedStats,
  ChapterStatisticsData,
  ChapterWithRelations,
  PaginatedResponse,
  RecentTopicsResponse,
} from "@workspace/api";

import { useTRPC } from "../client";
import { useAcademicChapterFilters } from "../filters/client";

// ============================================================================
// ACADEMIC CHAPTER MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating an academic chapter
 */
export function useCreateAcademicChapter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create academic chapter");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating an academic chapter
 */
export function useUpdateAcademicChapter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update academic chapter");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getById.queryKey({
              id: data.data?.id as string,
            }),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting an academic chapter
 */
export function useDeleteAcademicChapter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic chapter");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for reordering academic chapters
 */
export function useReorderAcademicChapters() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.reorder.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to reorder academic chapters");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk activating academic chapters
 */
export function useBulkActiveAcademicChapters() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.bulkActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate academic chapters");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deactivating academic chapters
 */
export function useBulkDeactivateAcademicChapters() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.bulkDeactive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate academic chapters");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for activating a single academic chapter
 */
export function useActiveAcademicChapter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.academicChapter.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate academic chapter");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("Academic chapter activated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getById.queryKey({
              id: variables.id,
            }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });

  return {
    ...mutation,
    mutate: (vars: { id: string }) =>
      mutation.mutate({ id: vars.id, data: { isActive: true } }),
    mutateAsync: (vars: { id: string }) =>
      mutation.mutateAsync({ id: vars.id, data: { isActive: true } }),
  };
}

/**
 * Mutation hook for deactivating a single academic chapter
 */
export function useDeactivateAcademicChapter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.academicChapter.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate academic chapter");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("Academic chapter deactivated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getById.queryKey({
              id: variables.id,
            }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });

  return {
    ...mutation,
    mutate: (vars: { id: string }) =>
      mutation.mutate({ id: vars.id, data: { isActive: false } }),
    mutateAsync: (vars: { id: string }) =>
      mutation.mutateAsync({ id: vars.id, data: { isActive: false } }),
  };
}

/**
 * Mutation hook for bulk deleting academic chapters
 */
export function useBulkDeleteAcademicChapters() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicChapter.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic chapters");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicChapter.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// ACADEMIC CHAPTER QUERIES
// ============================================================================

export function useAcademicChapters() {
  const trpc = useTRPC();
  const [filters, _] = useAcademicChapterFilters();

  const input = {
    ...filters,
    sortBy:
      filters.sort === "POSITION_ASC" || filters.sort === "POSITION_DESC"
        ? "position"
        : "createdAt",
    sortOrder:
      filters.sort === "POSITION_DESC" || filters.sort === "DESC"
        ? ("desc" as const)
        : ("asc" as const),
  };

  return useQuery({
    ...trpc.academicChapter.list.queryOptions(input),
    select: (data) => data.data as PaginatedResponse<ChapterWithRelations>,
  });
}

export function useAcademicChapterById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicChapter.getById.queryOptions({ id }),
    select: (res) => res.data as ChapterWithRelations,
  });
}

export function useAcademicChapterStats(subjectId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicChapter.getStats.queryOptions({ subjectId }),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting detailed academic chapter statistics
 */
export function useAcademicChapterDetailedStats(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicChapter.getDetailedStats.queryOptions({ id }),
    select: (data) => data.data as ChapterDetailedStats,
  });
}

/**
 * Hook for getting academic chapter statistics data for charts
 */
export function useAcademicChapterStatistics(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicChapter.getStatisticsData.queryOptions({ id }),
    select: (data) => data.data as ChapterStatisticsData,
  });
}

/**
 * Hook for getting recently updated topics for an academic chapter
 */
export function useAcademicChapterRecentTopics(chapterId: string, limit = 4) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicChapter.getRecentTopics.queryOptions({ chapterId, limit }),
    select: (data) => data.data as RecentTopicsResponse,
  });
}

/**
 * Hook for getting chapters for selection dropdowns
 */
export function useAcademicChaptersForSelection(subjectId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicChapter.list.queryOptions({
      page: 1,
      limit: 100,
      subjectId: subjectId || null,
      isActive: true,
      sortBy: "position",
      sortOrder: "asc",
    }),
    select: (data) => {
      const response = data.data as PaginatedResponse<ChapterWithRelations>;
      return response.items.map((chapter) => ({
        id: chapter.id,
        displayName: chapter.displayName,
      }));
    },
  });
}
