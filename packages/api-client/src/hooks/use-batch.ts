"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useBatchFilters } from "../filters/client";

// ============================================================================
// BATCH MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a batch
 */
export function useCreateBatch() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.batch.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create batch");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.batch.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a batch
 */
export function useUpdateBatch() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.batch.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update batch");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.batch.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a batch
 */
export function useDeleteBatch() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.batch.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete batch");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.batch.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// BATCH QUERIES
// ============================================================================

/**
 * Hook for listing batches with filters
 */
export function useBatches() {
  const trpc = useTRPC();
  const [filters, _] = useBatchFilters();
  return useSuspenseQuery(trpc.batch.list.queryOptions(filters));
}

/**
 * Hook for getting a batch by ID
 */
export function useBatchById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.batch.getById.queryOptions({ id }));
}

/**
 * Hook for getting batch statistics
 */
export function useBatchStats(filters: { classId?: string } = {}) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.batch.getStats.queryOptions(filters));
}
