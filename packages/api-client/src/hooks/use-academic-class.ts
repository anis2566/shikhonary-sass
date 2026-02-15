"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "../client";
import { useAcademicClassFilters } from "../filters/client";

// ============================================================================
// ACADEMIC CLASS MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating an academic class
 */
export function useCreateAcademicClass() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create academic class");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicClass.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating an academic class
 */
export function useUpdateAcademicClass() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update academic class");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicClass.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting an academic class
 */
export function useDeleteAcademicClass() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic class");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicClass.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for reordering academic classes
 */
export function useReorderAcademicClasses() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.reorder.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to reorder academic classes");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicClass.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk activating academic classes
 */
export function useBulkActiveAcademicClasses() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.bulkActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate academic classes");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicClass.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deactivating academic classes
 */
export function useBulkDeactivateAcademicClasses() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.bulkDeactive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate academic classes");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicClass.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for activating a single academic class
 */
export function useActiveAcademicClass() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.academicClass.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate academic class");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success("Academic class activated successfully");
        await queryClient.invalidateQueries({
          queryKey: trpc.academicClass.list.queryKey(),
        });
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
 * Mutation hook for deactivating a single academic class
 */
export function useDeactivateAcademicClass() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.academicClass.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate academic class");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success("Academic class deactivated successfully");
        await queryClient.invalidateQueries({
          queryKey: trpc.academicClass.list.queryKey(),
        });
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
 * Mutation hook for bulk deleting academic classes
 */
export function useBulkDeleteAcademicClasses() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicClass.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic classes");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicClass.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// ACADEMIC CLASS QUERIES
// ============================================================================

/**
 * Hook for listing academic classes with filters
 */
export function useAcademicClasses() {
  const trpc = useTRPC();
  const [filters, _] = useAcademicClassFilters();

  // Map custom 'sort' filter to standard 'sortBy' and 'sortOrder'
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

  return useSuspenseQuery(trpc.academicClass.list.queryOptions(input));
}

/**
 * Hook for getting an academic class by ID
 */
export function useAcademicClassById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicClass.getById.queryOptions({ id }),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting academic class statistics
 */
export function useAcademicClassStats() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.academicClass.getStats.queryOptions());
}
