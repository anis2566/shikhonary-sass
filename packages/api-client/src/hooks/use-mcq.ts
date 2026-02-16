"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useMCQFilters } from "../filters/client";

// ============================================================================
// MCQ MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating an MCQ
 */
export function useCreateMCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create MCQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating an MCQ
 */
export function useUpdateMCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update MCQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting an MCQ
 */
export function useDeleteMCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete MCQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deleting MCQs
 */
export function useBulkDeleteMCQs() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to bulk delete MCQs");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// MCQ QUERIES
// ============================================================================

/**
 * Hook for listing MCQs with filters
 */
export function useMCQs() {
  const trpc = useTRPC();
  const [filters, _] = useMCQFilters();
  return useSuspenseQuery({
    ...trpc.mcq.list.queryOptions(filters),
    select: (data: any) => data.data,
  });
}

/**
 * Hook for getting an MCQ by ID
 */
export function useMCQById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.mcq.getById.queryOptions({ id }),
    select: (data: any) => data.data,
  });
}

/**
 * Hook for getting MCQ statistics
 */
export function useMCQStats(filters: any) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.mcq.getStats.queryOptions(filters),
    select: (data: any) => data.data,
  });
}
