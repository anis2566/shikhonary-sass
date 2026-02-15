"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "../client";

// ============================================================================
// SUBSCRIPTION PLAN MUTATIONS
// ============================================================================

/**
 * Mutation hook for assigning a plan to a tenant
 */
export function useAssignSubscriptionPlan() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.subscriptionPlan.assignPlan.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to assign subscription plan");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.subscriptionPlan.getUsage.queryKey(),
        });
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
 * Hook for listing all available subscription plans
 */
export function useSubscriptionPlans() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.subscriptionPlan.listPlans.queryOptions());
}

/**
 * Hook for getting usage statistics for a tenant
 */
export function useSubscriptionUsage(tenantId: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.subscriptionPlan.getUsage.queryOptions({ tenantId }),
  );
}
