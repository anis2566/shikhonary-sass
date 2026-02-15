"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "../client";
import { useAcademicSubjectFilters } from "../filters/client";

// ============================================================================
// ACADEMIC SUBJECT MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating an academic subject
 */
export function useCreateAcademicSubject() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create academic subject");
    },
    onSuccess: async () => {
      toast.success("Subject created successfully");
      await queryClient.invalidateQueries({
        queryKey: trpc.academicSubject.list.queryKey(),
      });
    },
  });
}

/**
 * Mutation hook for updating an academic subject
 */
export function useUpdateAcademicSubject() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update academic subject");
    },
    onSuccess: async () => {
      toast.success("Subject updated successfully");
      await queryClient.invalidateQueries({
        queryKey: trpc.academicSubject.list.queryKey(),
      });
    },
  });
}

/**
 * Mutation hook for deleting an academic subject
 */
export function useDeleteAcademicSubject() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic subject");
    },
    onSuccess: async () => {
      toast.success("Subject deleted successfully");
      await queryClient.invalidateQueries({
        queryKey: trpc.academicSubject.list.queryKey(),
      });
    },
  });
}

/**
 * Mutation hook for reordering academic subjects
 */
export function useReorderAcademicSubjects() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.reorder.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to reorder academic subjects");
    },
    onSuccess: async () => {
      toast.success("Subjects reordered successfully");
      await queryClient.invalidateQueries({
        queryKey: trpc.academicSubject.list.queryKey(),
      });
    },
  });
}

// ============================================================================
// ACADEMIC SUBJECT QUERIES
// ============================================================================

export function useAcademicSubjects() {
  const trpc = useTRPC();
  const [filters, _] = useAcademicSubjectFilters();
  return useSuspenseQuery(trpc.academicSubject.list.queryOptions(filters));
}

export function useAcademicSubjectById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.academicSubject.getById.queryOptions({ id }));
}

export function useAcademicSubjectStats(classId?: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.academicSubject.getStats.queryOptions({ classId }),
  );
}
