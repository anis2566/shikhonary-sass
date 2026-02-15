"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
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

// ============================================================================
// ACADEMIC TOPIC QUERIES
// ============================================================================

export function useAcademicTopics() {
  const trpc = useTRPC();
  const [filters, _] = useAcademicTopicFilters();
  return useSuspenseQuery(trpc.academicTopic.list.queryOptions(filters));
}

export function useAcademicTopicById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.academicTopic.getById.queryOptions({ id }));
}

export function useAcademicTopicStats(chapterId?: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.academicTopic.getStats.queryOptions({ chapterId }),
  );
}
