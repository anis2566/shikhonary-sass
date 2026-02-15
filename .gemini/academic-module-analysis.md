# Academic Module Implementation Analysis

## Executive Summary

The academic module is **partially implemented** with significant gaps. While the foundational structure is in place for the hierarchical academic system (Class → Subject → Chapter → Topic → Subtopic), only the **Class** level has a complete UI implementation. The other levels (Subject, Chapter, Topic, Subtopic) have backend support but lack frontend modules.

---

## Current Implementation Status

### ✅ **Fully Implemented: Academic Class**

**Backend (API Layer)**

- ✅ Complete CRUD operations (`create`, `update`, `delete`, `getById`, `list`)
- ✅ Bulk operations (`bulkActive`, `bulkDeactive`, `bulkDelete`)
- ✅ Reordering functionality
- ✅ Statistics endpoint (`getStats`)
- ✅ Standardized response format with `success`, `message`, `data`

**Frontend (API Client Hooks)**

- ✅ All mutation hooks with proper error handling and toast notifications
- ✅ Query hooks with suspense support
- ✅ Filter integration (`useAcademicClassFilters`)
- ✅ Proper cache invalidation

**UI Module** (`apps/admin/modules/academic-class`)

- ✅ Complete views:
  - `ClassesView` - List view with filters, pagination, sorting
  - `ClassView` - Detail view with tabs (Overview, Subjects, Statistics)
  - `NewClassView` - Create form
  - `EditClassView` - Edit form
- ✅ Components:
  - `ClassList` - Table with drag-and-drop reordering
  - `Filter` - Advanced filtering (search, level, status, sort)
  - `Pagination` - Pagination controls
  - `BulkActions` - Bulk activate/deactivate/delete
  - `ClassListStat` - Statistics cards
  - `ClassDetailsStat` - Detail page statistics
  - `OverviewTab` - Overview with recent subjects
  - `SubjectsTab` - Subject listing
  - `StatisticsTab` - Analytics and charts
  - `SortableRow` - Drag-and-drop row component

---

### ⚠️ **Partially Implemented: Academic Subject, Chapter, Topic, Subtopic**

#### **Backend (API Layer)** - ✅ Complete

All entities have complete backend implementation:

**Academic Subject**

- ✅ CRUD operations
- ✅ Reordering
- ✅ Statistics by class (`getStats`)
- ✅ Filter by `classId`

**Academic Chapter**

- ✅ CRUD operations
- ✅ Bulk operations (activate, deactivate, delete)
- ✅ Reordering
- ✅ Statistics by subject (`getStats`)
- ✅ Filter by `subjectId`

**Academic Topic**

- ✅ CRUD operations
- ✅ Bulk operations (activate, deactivate, delete)
- ✅ Reordering
- ✅ Statistics by chapter (`getStats`)
- ✅ Filter by `chapterId`

**Academic Subtopic**

- ✅ CRUD operations
- ✅ Bulk operations (activate, deactivate, delete)
- ✅ Reordering
- ✅ Statistics by topic (`getStats`)
- ✅ Filter by `topicId`

#### **Frontend (API Client Hooks)** - ✅ Complete

All entities have complete hook implementations:

- ✅ Mutation hooks (create, update, delete, reorder, bulk operations)
- ✅ Query hooks (list, getById, getStats)
- ✅ Filter integration
- ✅ Proper error handling and cache invalidation

#### **UI Modules** - ❌ **MISSING**

**Critical Gap**: No UI modules exist for:

- ❌ `apps/admin/modules/academic-subject` - **Does not exist**
- ❌ `apps/admin/modules/academic-chapter` - **Does not exist**
- ❌ `apps/admin/modules/academic-topic` - **Does not exist**
- ❌ `apps/admin/modules/academic-subtopic` - **Does not exist**

**Impact**: Users cannot:

- Create, edit, or delete subjects, chapters, topics, or subtopics
- View detailed information about these entities
- Manage the hierarchical structure beyond the class level
- Access statistics for these entities

---

## Data Model Analysis

### Hierarchical Structure

```
AcademicClass (Master DB)
  ├── AcademicSubject (Master DB)
  │     ├── AcademicChapter (Master DB)
  │     │     ├── AcademicTopic (Master DB)
  │     │     │     ├── AcademicSubTopic (Master DB)
  │     │     │     │     ├── MCQ (Master DB)
  │     │     │     │     └── CQ (Master DB)
  │     │     │     ├── MCQ
  │     │     │     └── CQ
  │     │     ├── MCQ
  │     │     └── CQ
  │     ├── MCQ
  │     └── CQ
  └── CQ
```

### Schema Completeness

**Master Database** (`prisma-master/schema.prisma`)

- ✅ All academic entities defined
- ✅ Proper relations established
- ✅ Indexes for performance
- ✅ Position field for ordering
- ✅ `isActive` flag for soft activation/deactivation

**Tenant Database** (`prisma-tenant/schema.prisma`)

- ✅ References academic entities via `academicClassId`, `subjectIds`, `chapterIds`, `topicIds`
- ✅ Used in `Student`, `Batch`, `Exam` models
- ⚠️ **Note**: Academic entities are stored in master DB, referenced by ID in tenant DB

---

## Identified Gaps and Issues

### 1. **Missing UI Modules** (Critical)

**Problem**: No frontend modules for Subject, Chapter, Topic, Subtopic

**Required Components for Each Module**:

#### Views

- `{Entity}View` - Detail view with tabs
- `{Entity}sView` - List view with filters
- `New{Entity}View` - Create form
- `Edit{Entity}View` - Edit form

#### Components

- `{Entity}List` - Table with drag-and-drop
- `Filter` - Search, filters, sorting
- `Pagination` - Pagination controls
- `BulkActions` - Bulk operations
- `{Entity}ListStat` - Statistics cards
- `{Entity}DetailsStat` - Detail statistics
- `OverviewTab` - Overview information
- `{Children}Tab` - Child entities listing (e.g., ChaptersTab in SubjectView)
- `StatisticsTab` - Analytics
- `SortableRow` - Drag-and-drop row

#### Forms

- `{Entity}Form` - Create/edit form component

### 2. **Inconsistent Response Handling**

**Issue**: `useAcademicSubject` hooks don't handle standardized responses

**Current State**:

```typescript
// academic-subject hooks
onSuccess: async () => {
  toast.success("Subject created successfully");
  // ...
};
```

**Expected** (like academic-class):

```typescript
onSuccess: async (data) => {
  if (data.success) {
    toast.success(data.message);
    // ...
  } else {
    toast.error(data.message);
  }
};
```

**Affected Hooks**:

- `useCreateAcademicSubject`
- `useUpdateAcademicSubject`
- `useDeleteAcademicSubject`
- `useReorderAcademicSubjects`

### 3. **Missing Single Activation/Deactivation Hooks**

**Issue**: Chapter, Topic, and Subtopic lack individual activate/deactivate hooks

**Current State**:

- ✅ Academic Class has `useActiveAcademicClass` and `useDeactivateAcademicClass`
- ❌ Academic Subject, Chapter, Topic, Subtopic only have bulk operations

**Impact**: Cannot toggle individual entity status without using bulk operations or update mutation

### 4. **Type Safety Issues**

**Issue**: Some router inputs use `z.any()` instead of proper schemas

**Examples**:

```typescript
// academic-class.ts
create: baseMutationProcedure
  .input(z.any()) // Use AcademicClassSchema from @workspace/schema
  .mutation(async ({ ctx, input }) => {
    // ...
  }),
```

**Impact**: Loss of type safety and validation at API boundary

### 5. **Missing Navigation and Routing**

**Issue**: No routes defined for subject, chapter, topic, subtopic management

**Current Routes** (assumed based on links in code):

- ✅ `/classes` - List classes
- ✅ `/classes/:id` - View class
- ✅ `/classes/create` - Create class
- ✅ `/classes/:id/edit` - Edit class
- ❌ `/subjects` - **Missing**
- ❌ `/subjects/:id` - **Missing** (referenced in SubjectsTab)
- ❌ `/subjects/create` - **Missing** (referenced in SubjectsTab)
- ❌ `/chapters/*` - **Missing**
- ❌ `/topics/*` - **Missing**
- ❌ `/subtopics/*` - **Missing**

### 6. **Incomplete Data Fetching in ClassView**

**Issue**: `useAcademicClassById` returns data with subjects, but subjects lack `_count` property

**Current**:

```typescript
// class-view.tsx line 71
subjects={classData?.subjects || []}
```

**Expected Type**:

```typescript
type SubjectWithRelation = AcademicSubject & {
  _count: {
    chapters: number;
    mcqs: number;
    cqs: number;
  };
};
```

**Impact**: SubjectsTab expects `_count` but doesn't receive it, causing potential runtime errors

### 7. **Missing Filter Definitions**

**Issue**: Filter hooks are imported but may not be defined

**Used in hooks**:

- `useAcademicClassFilters` - ✅ Used
- `useAcademicSubjectFilters` - ✅ Used
- `useAcademicChapterFilters` - ✅ Used
- `useAcademicTopicFilters` - ✅ Used
- `useAcademicSubTopicFilters` - ✅ Used

**Verification Needed**: Check if these are properly defined in `@/filters/client`

---

## Recommendations

### Priority 1: Create Missing UI Modules (High Priority)

**Action**: Create complete UI modules for Subject, Chapter, Topic, Subtopic

**Approach**: Clone and adapt the `academic-class` module structure

**Steps for Each Entity**:

1. Create module directory: `apps/admin/modules/academic-{entity}`
2. Implement views (list, detail, create, edit)
3. Implement components (list, filters, stats, tabs)
4. Implement forms
5. Add routing
6. Test CRUD operations
7. Test bulk operations
8. Test drag-and-drop reordering

**Estimated Effort**: 2-3 days per module (8-12 days total)

### Priority 2: Fix Response Handling Consistency (Medium Priority)

**Action**: Update Subject, Chapter, Topic, Subtopic hooks to handle standardized responses

**Files to Update**:

- `packages/api-client/src/hooks/use-academic-subject.ts`
- `packages/api-client/src/hooks/use-academic-chapter.ts`
- `packages/api-client/src/hooks/use-academic-topic.ts`
- `packages/api-client/src/hooks/use-academic-subtopic.ts`

**Pattern to Follow**:

```typescript
onSuccess: async (data) => {
  if (data.success) {
    toast.success(data.message);
    await queryClient.invalidateQueries({
      queryKey: trpc.{entity}.list.queryKey(),
    });
  } else {
    toast.error(data.message);
  }
}
```

**Estimated Effort**: 2-3 hours

### Priority 3: Add Individual Activation Hooks (Medium Priority)

**Action**: Add `useActive{Entity}` and `useDeactivate{Entity}` hooks for Subject, Chapter, Topic, Subtopic

**Pattern to Follow** (from academic-class):

```typescript
export function useActiveAcademicSubject() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.academicSubject.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate academic subject");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success("Academic subject activated successfully");
        await queryClient.invalidateQueries({
          queryKey: trpc.academicSubject.list.queryKey(),
        });
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
```

**Estimated Effort**: 2-3 hours

### Priority 4: Fix Type Safety in API Routers (Medium Priority)

**Action**: Replace `z.any()` with proper Zod schemas

**Steps**:

1. Create validation schemas in `@workspace/schema` or inline
2. Update router input definitions
3. Verify type inference works correctly

**Example**:

```typescript
const createAcademicClassSchema = z.object({
  name: z.string().min(1),
  level: z.string(),
  displayName: z.string(),
  position: z.number().optional(),
  isActive: z.boolean().optional(),
});

create: baseMutationProcedure
  .input(createAcademicClassSchema)
  .mutation(async ({ ctx, input }) => {
    // input is now properly typed
  }),
```

**Estimated Effort**: 3-4 hours

### Priority 5: Fix Data Fetching in ClassView (High Priority)

**Action**: Update `getById` service to include `_count` for subjects

**File**: `packages/api/src/services/academic-class.service.ts`

**Update**:

```typescript
async getById(id: string) {
  return await this.db.academicClass.findUniqueOrThrow({
    where: { id },
    include: {
      subjects: {
        include: {
          _count: {
            select: {
              chapters: true,
              mcqs: true,
              cqs: true,
            },
          },
        },
      },
    },
  });
}
```

**Estimated Effort**: 30 minutes

### Priority 6: Implement Routing (High Priority)

**Action**: Add routes for all academic entities

**Files to Update**:

- Next.js app router configuration
- Navigation components
- Breadcrumbs

**Routes to Add**:

```
/subjects
/subjects/:id
/subjects/create
/subjects/:id/edit
/chapters
/chapters/:id
/chapters/create
/chapters/:id/edit
/topics
/topics/:id
/topics/create
/topics/:id/edit
/subtopics
/subtopics/:id
/subtopics/create
/subtopics/:id/edit
```

**Estimated Effort**: 2-3 hours

### Priority 7: Verify Filter Definitions (Low Priority)

**Action**: Ensure all filter hooks are properly defined

**File to Check**: `packages/api-client/src/filters/client.ts` (or equivalent)

**Estimated Effort**: 30 minutes

---

## Implementation Roadmap

### Phase 1: Critical Fixes (1-2 days)

1. ✅ Fix data fetching in ClassView (include `_count` for subjects)
2. ✅ Fix response handling consistency in hooks
3. ✅ Add individual activation/deactivation hooks

### Phase 2: Subject Module (2-3 days)

1. ✅ Create `academic-subject` module structure
2. ✅ Implement views and components
3. ✅ Add routing
4. ✅ Test functionality

### Phase 3: Chapter Module (2-3 days)

1. ✅ Create `academic-chapter` module structure
2. ✅ Implement views and components
3. ✅ Add routing
4. ✅ Test functionality

### Phase 4: Topic Module (2-3 days)

1. ✅ Create `academic-topic` module structure
2. ✅ Implement views and components
3. ✅ Add routing
4. ✅ Test functionality

### Phase 5: Subtopic Module (2-3 days)

1. ✅ Create `academic-subtopic` module structure
2. ✅ Implement views and components
3. ✅ Add routing
4. ✅ Test functionality

### Phase 6: Polish and Optimization (1-2 days)

1. ✅ Improve type safety (replace `z.any()`)
2. ✅ Add comprehensive error handling
3. ✅ Optimize queries and caching
4. ✅ Add loading states and skeletons
5. ✅ Verify filter definitions
6. ✅ Add integration tests

---

## Conclusion

The academic module has a **solid foundation** with complete backend implementation and well-structured hooks. However, it is **incomplete** due to missing UI modules for Subject, Chapter, Topic, and Subtopic levels.

**Key Strengths**:

- ✅ Complete backend API
- ✅ Comprehensive hooks with proper patterns
- ✅ Well-designed data model
- ✅ Excellent reference implementation (Class module)

**Key Weaknesses**:

- ❌ Missing 4 out of 5 UI modules (80% of user-facing functionality)
- ⚠️ Minor inconsistencies in response handling
- ⚠️ Type safety gaps in API layer

**Overall Assessment**: **60% Complete**

- Backend: 100% ✅
- Frontend Hooks: 100% ✅
- Frontend UI: 20% ❌ (only Class implemented)

**Recommendation**: Prioritize creating the missing UI modules using the Class module as a template. The backend is solid and ready to support full CRUD operations for all entities.
