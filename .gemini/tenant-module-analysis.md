# Tenant Module Implementation Analysis

## Executive Summary

After exploring the tenant module across all layers (admin app, api-client, api, and comparing with academic-subject module), I've identified several gaps and areas for improvement to bring the tenant module to the same standard as the academic modules.

---

## Current Implementation Status

### ✅ What's Working

1. **Basic CRUD Operations**
   - `create`, `update`, `delete`, `getById`, `list` endpoints exist
   - `toggleStatus` for activation/deactivation
   - Basic pagination and filtering in place

2. **UI Components**
   - TenantsView with header, stats, filters, bulk actions
   - TenantList with table display
   - Pagination component
   - Filter component
   - BulkActions component

3. **API Client Hooks**
   - `useTenants()` - list with filters
   - `useTenantById()` - get by ID
   - `useCreateTenant()` - create
   - `useUpdateTenant()` - update
   - `useDeleteTenant()` - delete
   - `useToggleTenantStatus()` - toggle active status

---

## ❌ Missing Features (Compared to Academic-Subject Module)

### 1. **Bulk Operations in API**

**Academic Subject Has:**

```typescript
// packages/api/src/routers/academic-subject.ts
bulkActive: baseMutationProcedure
  .input(z.object({ ids: z.array(z.string()) }))
  .mutation(async ({ ctx, input }) => {
    const service = new AcademicSubjectService(ctx.db);
    await service.bulkActive(input.ids);
    return {
      success: true,
      message: "Subjects activated successfully",
    };
  }),

bulkDeactive: baseMutationProcedure
  .input(z.object({ ids: z.array(z.string()) }))
  .mutation(async ({ ctx, input }) => {
    const service = new AcademicSubjectService(ctx.db);
    await service.bulkDeactive(input.ids);
    return {
      success: true,
      message: "Subjects deactivated successfully",
    };
  }),

bulkDelete: baseMutationProcedure
  .input(z.object({ ids: z.array(z.string()) }))
  .mutation(async ({ ctx, input }) => {
    const service = new AcademicSubjectService(ctx.db);
    await service.bulkDelete(input.ids);
    return {
      success: true,
      message: "Subjects deleted successfully",
    };
  }),
```

**Tenant Module Missing:**

- `bulkActive` endpoint
- `bulkDeactive` endpoint
- `bulkDelete` endpoint

### 2. **Service Layer Methods**

**TenantService Missing:**

```typescript
// These methods need to be added to TenantService
async bulkActive(ids: string[]): Promise<void>
async bulkDeactive(ids: string[]): Promise<void>
async bulkDelete(ids: string[]): Promise<void>
async getStats(): Promise<TenantStats>
```

### 3. **API Client Hooks**

**Missing Hooks in `packages/api-client/src/hooks/use-tenant.ts`:**

```typescript
// These hooks are called in TenantsView but don't exist!
export function useActivateTenant(); // ❌ Missing
export function useDeactivateTenant(); // ❌ Missing
export function useBulkActivateTenants(); // ❌ Missing
export function useBulkDeactivateTenants(); // ❌ Missing
export function useBulkDeleteTenants(); // ❌ Missing
export function useTenantStats(); // ❌ Missing
```

**Academic Subject Has:**

```typescript
export function useActiveAcademicSubject(); // ✅ Exists
export function useDeactivateAcademicSubject(); // ✅ Exists
export function useBulkActiveAcademicSubjects(); // ✅ Exists
export function useBulkDeactivateAcademicSubjects(); // ✅ Exists
export function useBulkDeleteAcademicSubjects(); // ✅ Exists
export function useAcademicSubjectStats(); // ✅ Exists
```

### 4. **Statistics/Analytics**

**Academic Subject Has:**

- `getStats` - aggregate statistics
- `getDetailedStats` - detailed analytics
- `getStatisticsData` - chart data
- `getRecentChapters` - recent activity
- `getRecentTopics` - recent activity

**Tenant Module Missing:**

- Statistics endpoints
- Analytics data
- Recent activity tracking

### 5. **Proper Schema Validation**

**Academic Subject:**

```typescript
// Uses proper Zod schemas from @workspace/schema
import {
  academicSubjectFormSchema,
  updateAcademicSubjectSchema,
} from "@workspace/schema";

create: baseMutationProcedure
  .input(academicSubjectFormSchema)
  .mutation(...)
```

**Tenant Module:**

```typescript
// Uses z.any() - NO VALIDATION! ⚠️
create: baseMutationProcedure
  .input(z.any()) // Replace with proper schema from @workspace/schema
  .mutation(...)
```

### 6. **Filter System**

**Academic Subject:**

- Uses `useAcademicSubjectFilters()` from `@workspace/api-client`
- Centralized filter management
- Type-safe filters

**Tenant Module:**

- Custom filter implementation in UI
- No centralized filter hook
- Less type-safe

### 7. **Response Structure**

**Academic Subject (Consistent):**

```typescript
return {
  success: true,
  data: {
    items: [...],
    meta: {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10
    }
  }
};
```

**Tenant Module (Inconsistent):**

```typescript
// list() returns PaginatedResponse directly
return createPaginatedResponse(items, total, page, limit);

// But getById() returns raw data
return tenant;
```

---

## 🔧 Required Fixes

### Priority 1: Critical Functionality

1. **Add Missing Bulk Operations**
   - Add `bulkActive`, `bulkDeactive`, `bulkDelete` to TenantService
   - Add corresponding router endpoints
   - Add API client hooks

2. **Fix Hook Imports**
   - TenantsView imports from `@/trpc/api/use-tenant` (doesn't exist!)
   - Should import from `@workspace/api-client`
   - Add missing hooks to api-client package

3. **Add Proper Schema Validation**
   - Create `tenantFormSchema` in `@workspace/schema`
   - Create `updateTenantSchema` in `@workspace/schema`
   - Replace `z.any()` with proper schemas

### Priority 2: Feature Parity

4. **Add Statistics/Analytics**
   - `getStats()` - total tenants, active, inactive, by type
   - `getTenantStats(id)` - individual tenant stats
   - Stats display component

5. **Standardize Response Structure**
   - Wrap all responses in `{ success, data, message }` format
   - Use consistent pagination structure

6. **Add Filter System**
   - Create `useTenantFilters()` hook in api-client
   - Centralize filter state management
   - Add filter persistence (URL params)

### Priority 3: Code Quality

7. **Type Safety**
   - Remove `any` types
   - Add proper TypeScript interfaces
   - Use generated Prisma types

8. **Error Handling**
   - Consistent error messages
   - Proper error boundaries
   - Toast notifications

---

## 📁 File Structure Comparison

### Academic Subject Module (Reference)

```
packages/api/src/
├── routers/academic-subject.ts (193 lines, comprehensive)
├── services/academic-subject.service.ts (full CRUD + bulk + stats)

packages/api-client/src/
├── hooks/use-academic-subject.ts (373 lines, all hooks)
├── filters/client.ts (useAcademicSubjectFilters)

apps/admin/modules/academic-subject/
├── ui/
│   ├── views/
│   │   ├── subjects-view.tsx (uses @workspace/api-client hooks)
│   │   ├── subject-view.tsx
│   │   ├── new-subject-view.tsx
│   │   └── edit-subject-view.tsx
│   ├── components/ (12 files)
│   └── form/ (2 files)
```

### Tenant Module (Current)

```
packages/api/src/
├── routers/tenant.ts (77 lines, basic CRUD only)
├── services/tenant.service.ts (151 lines, missing bulk operations)

packages/api-client/src/
├── hooks/use-tenant.ts (136 lines, missing many hooks)
├── filters/client.ts (useTenantFilters exists ✅)

apps/admin/modules/tenants/
├── ui/
│   ├── views/
│   │   ├── tenants-view.tsx (imports from wrong path!)
│   │   ├── tenant-view.tsx
│   │   ├── new-tenant-view.tsx
│   │   └── edit-tenant-view.tsx
│   ├── components/ (24 files)
│   ├── form/ (1 file)
│   ├── hooks/ (2 files)
│   └── modal/ (1 file)
```

---

## 🎯 Recommended Implementation Order

### Phase 1: Fix Critical Bugs (1-2 hours)

1. Add missing hooks to `packages/api-client/src/hooks/use-tenant.ts`
2. Update TenantsView imports to use `@workspace/api-client`
3. Add bulk operation methods to TenantService
4. Add bulk operation endpoints to tenant router

### Phase 2: Add Schemas & Validation (1 hour)

5. Create tenant schemas in `@workspace/schema`
6. Update router to use proper schemas
7. Remove all `z.any()` usages

### Phase 3: Add Statistics (2 hours)

8. Add `getStats()` to TenantService
9. Add stats endpoint to router
10. Create TenantListStat component (currently just a placeholder)
11. Add stats hooks to api-client

### Phase 4: Standardize Responses (1 hour)

12. Wrap all service responses consistently
13. Update hooks to handle new response structure
14. Update UI components to use new structure

---

## 📝 Code Examples for Implementation

### Example 1: Add Bulk Operations to TenantService

```typescript
// packages/api/src/services/tenant.service.ts

async bulkActive(ids: string[]): Promise<void> {
  try {
    await this.db.tenant.updateMany({
      where: { id: { in: ids } },
      data: { isActive: true },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

async bulkDeactive(ids: string[]): Promise<void> {
  try {
    await this.db.tenant.updateMany({
      where: { id: { in: ids } },
      data: { isActive: false },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

async bulkDelete(ids: string[]): Promise<void> {
  try {
    await this.db.tenant.deleteMany({
      where: { id: { in: ids } },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

async getStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byType: Record<string, number>;
}> {
  try {
    const [total, active, inactive, suspended, byType] = await Promise.all([
      this.db.tenant.count(),
      this.db.tenant.count({ where: { isActive: true } }),
      this.db.tenant.count({ where: { isActive: false } }),
      this.db.tenant.count({ where: { isSuspended: true } }),
      this.db.tenant.groupBy({
        by: ['type'],
        _count: true,
      }),
    ]);

    return {
      total,
      active,
      inactive,
      suspended,
      byType: byType.reduce((acc, item) => ({
        ...acc,
        [item.type]: item._count,
      }), {}),
    };
  } catch (error) {
    handlePrismaError(error);
    return { total: 0, active: 0, inactive: 0, suspended: 0, byType: {} };
  }
}
```

### Example 2: Add Missing Hooks to API Client

```typescript
// packages/api-client/src/hooks/use-tenant.ts

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
```

---

## 🚨 Critical Issues to Address Immediately

1. **TenantsView is broken!** It imports hooks that don't exist:

   ```typescript
   // ❌ This path doesn't exist!
   import {
     useTenants,
     useActivateTenant,
     useDeactivateTenant,
     useBulkActivateTenants,
     useBulkDeactivateTenants,
     useBulkDeleteTenants,
     useDeleteTenant,
   } from "@/trpc/api/use-tenant";
   ```

2. **No schema validation** - All inputs use `z.any()` which is a security risk

3. **Inconsistent response structure** - Some endpoints return raw data, others return wrapped responses

---

## ✅ Next Steps

Would you like me to:

1. **Implement all missing hooks** in the api-client package?
2. **Add bulk operations** to the tenant service and router?
3. **Create proper schemas** for tenant validation?
4. **Fix the TenantsView** imports and make it work?
5. **Add statistics/analytics** features?

Let me know which priority you'd like to tackle first, and I'll implement it following the academic-subject module pattern!
