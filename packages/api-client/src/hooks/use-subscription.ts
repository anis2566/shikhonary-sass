import { useSuspenseQuery } from "@tanstack/react-query";
import { type PaginatedResponse } from "@workspace/api";
import { useTRPC } from "../client";
import { useSubscriptionFilters } from "../filters/client";
import {
  type Subscription,
  type SubscriptionPlan,
  type Tenant,
} from "@workspace/db";

/**
 * Subscription with its related Tenant and SubscriptionPlan
 */
export interface SubscriptionWithRelations extends Subscription {
  tenant: Tenant;
  plan: SubscriptionPlan;
}

// ============================================================================
// SUBSCRIPTION QUERIES
// ============================================================================

/**
 * Hook for getting a paginated list of subscriptions
 */
export function useSubscriptions() {
  const trpc = useTRPC();
  const [filters] = useSubscriptionFilters();
  return useSuspenseQuery({
    ...trpc.subscription.list.queryOptions(filters),
    select: (data) =>
      data.data as PaginatedResponse<SubscriptionWithRelations> | undefined,
  });
}

/**
 * Hook for getting subscription statistics
 */
export function useSubscriptionStats() {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.subscription.getStats.queryOptions(),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting a subscription by ID
 */
export function useSubscriptionById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.subscription.getById.queryOptions({ id }),
    select: (data) => data.data as SubscriptionWithRelations | undefined,
  });
}
