"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type {
  TopicDetailedStats,
  TopicStatisticsData,
  TopicWithRelations,
  RecentSubTopic,
  PaginatedResponse,
} from "@workspace/api";

import { useTRPC } from "../client";
import { useAcademicTopicFilters } from "../filters/client";

// ============================================================================
// ACADEMIC TOPIC MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating an academic topic
 */
export function useCreateAcademicTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicTopic.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create academic topic");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating an academic topic
 */
export function useUpdateAcademicTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicTopic.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update academic topic");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicTopic.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicTopic.getById.queryKey({
              id: variables.id,
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
 * Mutation hook for deleting an academic topic
 */
export function useDeleteAcademicTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicTopic.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic topic");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicTopic.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicTopic.getById.queryKey({
              id: variables.id,
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
 * Mutation hook for reordering academic topics
 */
export function useReorderAcademicTopics() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicTopic.reorder.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to reorder academic topics");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk activating academic topics
 */
export function useBulkActiveAcademicTopics() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicTopic.bulkActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate academic topics");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deactivating academic topics
 */
export function useBulkDeactivateAcademicTopics() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicTopic.bulkDeactive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate academic topics");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deleting academic topics
 */
export function useBulkDeleteAcademicTopics() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicTopic.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic topics");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicTopic.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for activating a single academic topic
 */
export function useActiveAcademicTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.academicTopic.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate academic topic");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("Academic topic activated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicTopic.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicTopic.getById.queryKey({
              id: variables.id,
            }),
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
 * Mutation hook for deactivating a single academic topic
 */
export function useDeactivateAcademicTopic() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.academicTopic.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate academic topic");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("Academic topic deactivated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicTopic.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicTopic.getById.queryKey({
              id: variables.id,
            }),
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

// ============================================================================
// ACADEMIC TOPIC QUERIES
// ============================================================================

export function useAcademicTopics() {
  const trpc = useTRPC();
  const [filters, _] = useAcademicTopicFilters();
  return useQuery({
    ...trpc.academicTopic.list.queryOptions(filters),
    select: (data) => data.data as PaginatedResponse<TopicWithRelations>,
  });
}

export function useAcademicTopicById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicTopic.getById.queryOptions({ id }),
    select: (data) => data.data as TopicWithRelations,
  });
}

export function useAcademicTopicStats(chapterId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicTopic.getStats.queryOptions({ chapterId }),
    select: (data) => data.data,
  });
}

export function useAcademicTopicsForSelection(chapterId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicTopic.forSelection.queryOptions({ chapterId }),
    select: (data) => data.data,
  });
}

export function useAcademicTopicByChapterId(chapterId: string) {
  return useAcademicTopicsForSelection(chapterId);
}

/**
 * Hook for getting detailed academic topic statistics
 */
export function useAcademicTopicDetailedStats(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicTopic.getDetailedStats.queryOptions({ id }),
    select: (data) => data.data as TopicDetailedStats,
  });
}

/**
 * Hook for getting recently updated subtopics for an academic topic
 */
export function useAcademicTopicRecentSubTopics(topicId: string, limit = 5) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicTopic.getRecentSubTopics.queryOptions({ topicId, limit }),
    select: (data) => data.data as RecentSubTopic[],
  });
}

/**
 * Hook for getting academic topic statistics data for charts
 */
export function useAcademicTopicStatistics(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicTopic.getStatisticsData.queryOptions({ id }),
    select: (data) => data.data as TopicStatisticsData,
  });
}
