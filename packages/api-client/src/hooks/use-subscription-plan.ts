"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import type {
  SubscriptionPlanWithRelations,
  PaginatedResponse,
} from "@workspace/api";

import { useTRPC } from "../client";
import { useSubscriptionPlanFilters } from "../filters/client";

// ============================================================================
// SUBSCRIPTION PLAN MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a subscription plan
 */
export function useCreateSubscriptionPlan() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.subscriptionPlan.createOne.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create subscription plan");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a subscription plan
 */
export function useUpdateSubscriptionPlan() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.subscriptionPlan.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update subscription plan");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.getById.queryKey({
              id: data.data?.id as string,
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
 * Mutation hook for deleting a subscription plan
 */
export function useDeleteSubscriptionPlan() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.subscriptionPlan.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete subscription plan");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for activating a subscription plan
 */
export function useActivateSubscriptionPlan() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.subscriptionPlan.activate.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate subscription plan");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.getById.queryKey({
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
 * Mutation hook for deactivating a subscription plan
 */
export function useDeactivateSubscriptionPlan() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.subscriptionPlan.deactivate.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate subscription plan");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.getById.queryKey({
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
 * Mutation hook for setting plan popularity
 */
export function useSetSubscriptionPlanPopularity() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.subscriptionPlan.setPopular.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update plan popularity");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.subscriptionPlan.getById.queryKey({
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

// ============================================================================
// SUBSCRIPTION PLAN QUERIES
// ============================================================================

/**
 * Hook for listing subscription plans with filters
 */
export function useSubscriptionPlans() {
  const trpc = useTRPC();
  const [filters] = useSubscriptionPlanFilters();

  return useSuspenseQuery({
    ...trpc.subscriptionPlan.list.queryOptions(filters),
    select: (data) =>
      data.data as PaginatedResponse<SubscriptionPlanWithRelations>,
  });
}

/**
 * Hook for getting a subscription plan by ID
 */
export function useSubscriptionPlanById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.subscriptionPlan.getById.queryOptions({ id }),
    select: (res) => res.data as SubscriptionPlanWithRelations,
  });
}

/**
 * Hook for getting subscription plan statistics
 */
export function useSubscriptionPlanStats() {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.subscriptionPlan.getStats.queryOptions(),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting plans available for selection
 */
export function useSubscriptionPlansForSelection() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.subscriptionPlan.forSelection.queryOptions(),
    select: (data) =>
      data.data as {
        id: string;
        name: string;
        displayName: string;
        monthlyPriceBDT: number;
        defaultStudentLimit: number;
        defaultTeacherLimit: number;
        defaultStorageLimit: number;
        defaultExamLimit: number;
      }[],
  });
}
