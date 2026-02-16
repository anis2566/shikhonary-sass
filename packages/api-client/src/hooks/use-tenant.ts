"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useTenantFilters } from "../filters/client";

// ============================================================================
// TENANT MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a tenant
 */
export function useCreateTenant() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create tenant");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tenant.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a tenant
 */
export function useUpdateTenant() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update tenant");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tenant.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a tenant
 */
export function useDeleteTenant() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete tenant");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tenant.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for toggling tenant active status
 */
export function useToggleTenantStatus() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.toggleStatus.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle tenant status");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tenant.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// TENANT QUERIES
// ============================================================================

/**
 * Hook for listing tenants with filters
 */
export function useTenants() {
  const trpc = useTRPC();
  const [filters, _] = useTenantFilters();
  return useSuspenseQuery(trpc.tenant.list.queryOptions(filters));
}

/**
 * Hook for getting a tenant by ID
 */
export function useTenantById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.tenant.getById.queryOptions({ id }));
}
