"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useStudentFilters } from "../filters/client";

// ============================================================================
// STUDENT MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a student
 */
export function useCreateStudent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create student");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a student
 */
export function useUpdateStudent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update student");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a student
 */
export function useDeleteStudent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete student");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk importing students
 */
export function useBulkImportStudents() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.bulkImport.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to import students");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// STUDENT QUERIES
// ============================================================================

/**
 * Hook for listing students with filters
 */
export function useStudents() {
  const trpc = useTRPC();
  const [filters, _] = useStudentFilters();
  return useSuspenseQuery(trpc.student.list.queryOptions(filters));
}

/**
 * Hook for getting a student by ID
 */
export function useStudentById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.student.getById.queryOptions({ id }));
}
