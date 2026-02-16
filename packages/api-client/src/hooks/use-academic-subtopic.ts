"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type {
  SubTopicDetailedStats,
  SubTopicStatisticsData,
  RecentQuestionsResponse,
} from "@workspace/api";
import { useTRPC } from "../client";
import { useAcademicSubTopicFilters } from "../filters/client";

// ============================================================================
// ACADEMIC SUBTOPIC MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating an academic subtopic
 */
export function useCreateAcademicSubTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubTopic.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create academic subtopic");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating an academic subtopic
 */
export function useUpdateAcademicSubTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubTopic.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update academic subtopic");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting an academic subtopic
 */
export function useDeleteAcademicSubTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubTopic.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic subtopic");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for reordering academic subtopics
 */
export function useReorderAcademicSubTopics() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubTopic.reorder.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to reorder academic subtopics");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk activating academic subtopics
 */
export function useBulkActiveAcademicSubTopics() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubTopic.bulkActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate academic subtopics");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deactivating academic subtopics
 */
export function useBulkDeactivateAcademicSubTopics() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubTopic.bulkDeactive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate academic subtopics");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deleting academic subtopics
 */
export function useBulkDeleteAcademicSubTopics() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubTopic.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic subtopics");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for activating an academic subtopic
 */
export function useActiveAcademicSubTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubTopic.active.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate academic subtopic");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deactivating an academic subtopic
 */
export function useDeactivateAcademicSubTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubTopic.deactivate.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate academic subtopic");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// ACADEMIC SUBTOPIC QUERIES
// ============================================================================

export function useAcademicSubTopics() {
  const trpc = useTRPC();
  const [filters, _] = useAcademicSubTopicFilters();
  return useSuspenseQuery({
    ...trpc.academicSubTopic.list.queryOptions(filters),
    select: (data) => data.data,
  });
}

export function useAcademicSubTopicById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicSubTopic.getById.queryOptions({ id }),
    select: (data) => data.data,
  });
}

export function useAcademicSubTopicStats(topicId?: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicSubTopic.getStats.queryOptions({ topicId }),
    select: (data) => data.data,
  });
}

export function useAcademicSubTopicsForSelection(topicId?: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicSubTopic.forSelection.queryOptions({ topicId }),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting detailed academic subtopic statistics
 */
export function useAcademicSubTopicDetailedStats(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicSubTopic.getDetailedStats.queryOptions({ id }),
    select: (data) => data.data as SubTopicDetailedStats,
  });
}

/**
 * Hook for getting academic subtopic statistics data for charts
 */
export function useAcademicSubTopicStatistics(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicSubTopic.getStatisticsData.queryOptions({ id }),
    select: (data) => data.data as SubTopicStatisticsData,
  });
}

/**
 * Hook for getting recently updated questions for an academic subtopic
 */
export function useAcademicSubTopicRecentQuestions(
  subTopicId: string,
  limit = 5,
) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicSubTopic.getRecentQuestions.queryOptions({
      subTopicId,
      limit,
    }),
    select: (data) => data.data as RecentQuestionsResponse,
  });
}
