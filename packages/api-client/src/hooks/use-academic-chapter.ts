"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
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
        await queryClient.invalidateQueries({
          queryKey: trpc.academicChapter.list.queryKey(),
        });
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
        await queryClient.invalidateQueries({
          queryKey: trpc.academicChapter.list.queryKey(),
        });
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
        await queryClient.invalidateQueries({
          queryKey: trpc.academicChapter.list.queryKey(),
        });
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
        await queryClient.invalidateQueries({
          queryKey: trpc.academicChapter.list.queryKey(),
        });
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
        await queryClient.invalidateQueries({
          queryKey: trpc.academicChapter.list.queryKey(),
        });
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
        await queryClient.invalidateQueries({
          queryKey: trpc.academicChapter.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
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
        await queryClient.invalidateQueries({
          queryKey: trpc.academicChapter.list.queryKey(),
        });
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
  return useSuspenseQuery(trpc.academicChapter.list.queryOptions(filters));
}

export function useAcademicChapterById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.academicChapter.getById.queryOptions({ id }));
}

export function useAcademicChapterStats(subjectId?: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.academicChapter.getStats.queryOptions({ subjectId }),
  );
}
