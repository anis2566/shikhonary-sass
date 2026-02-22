"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
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
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubject.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
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
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicSubject.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicSubject.getById.queryKey({
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
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicSubject.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicSubject.getById.queryKey({
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
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubject.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk activating academic subjects
 */
export function useBulkActiveAcademicSubjects() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.bulkActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate academic subjects");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubject.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deactivating academic subjects
 */
export function useBulkDeactivateAcademicSubjects() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.bulkDeactive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate academic subjects");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubject.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deleting academic subjects
 */
export function useBulkDeleteAcademicSubjects() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicSubject.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic subjects");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubject.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for activating a single academic subject
 */
export function useActiveAcademicSubject() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.academicSubject.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate academic subject");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("Academic subject activated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicSubject.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicSubject.getById.queryKey({
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
 * Mutation hook for deactivating a single academic subject
 */
export function useDeactivateAcademicSubject() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.academicSubject.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate academic subject");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("Academic subject deactivated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicSubject.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicSubject.getById.queryKey({
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
// ACADEMIC SUBJECT QUERIES
// ============================================================================

export function useAcademicSubjects() {
  const trpc = useTRPC();
  const [filters, _] = useAcademicSubjectFilters();
  return useQuery({
    ...trpc.academicSubject.list.queryOptions(filters),
    select: (data) => data.data,
  });
}

export function useAcademicSubjectById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicSubject.getById.queryOptions({ id }),
    select: (data) => data.data,
  });
}

export function useAcademicSubjectStats(classId?: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicSubject.getStats.queryOptions({ classId }),
    select: (data) => data.data,
  });
}

export function useAcademicSubjectsForSelection(classId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicSubject.forSelection.queryOptions({ classId }),
    select: (data) => data.data,
  });
}

export function useAcademicSubjectByClassId(classId: string) {
  return useAcademicSubjectsForSelection(classId);
}

/**
 * Hook for getting detailed academic subject statistics
 */
export function useAcademicSubjectDetailedStats(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicSubject.getDetailedStats.queryOptions({ id }),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting academic subject statistics data for charts
 */
export function useAcademicSubjectStatistics(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.academicSubject.getStatisticsData.queryOptions({ id }),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting recently updated chapters for an academic subject
 */
export function useAcademicSubjectRecentChapters(subjectId: string, limit = 4) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicSubject.getRecentChapters.queryOptions({
      subjectId,
      limit,
    }),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting recently updated topics for an academic subject
 */
export function useAcademicSubjectRecentTopics(subjectId: string, limit = 4) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.academicSubject.getRecentTopics.queryOptions({ subjectId, limit }),
    select: (data) => data.data,
  });
}
