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

/**
 * Mutation hook for activating a single tenant
 */
export function useActivateTenant() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.tenant.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate tenant");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("Tenant activated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.tenant.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tenant.getById.queryKey({ id: variables.id }),
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
 * Mutation hook for deactivating a single tenant
 */
export function useDeactivateTenant() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.tenant.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate tenant");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("Tenant deactivated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.tenant.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tenant.getById.queryKey({ id: variables.id }),
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

/**
 * Mutation hook for bulk activating tenants
 */
export function useBulkActivateTenants() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.bulkActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate tenants");
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
 * Mutation hook for bulk deactivating tenants
 */
export function useBulkDeactivateTenants() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.bulkDeactive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate tenants");
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
 * Mutation hook for bulk deleting tenants
 */
export function useBulkDeleteTenants() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete tenants");
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

/**
 * Hook for getting tenant statistics
 */
export function useTenantStats() {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.tenant.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
