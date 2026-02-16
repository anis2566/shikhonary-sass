"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";

import { AcademicSubject } from "@workspace/db";
import {
  useReorderAcademicSubjects,
  useBulkActiveAcademicSubjects,
  useBulkDeactivateAcademicSubjects,
  useBulkDeleteAcademicSubjects,
  useActiveAcademicSubject,
  useDeactivateAcademicSubject,
  useDeleteAcademicSubject,
  useAcademicSubjects,
  useAcademicSubjectFilters,
} from "@workspace/api-client";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import { SubjectListStat } from "../components/subject-list-stat";
import { Filter } from "../components/filter";
import { BulkActions } from "../components/bulk-actions";
import { SubjectList } from "../components/subject-list";
import { Pagination } from "../components/pagination";

export const SubjectsView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reorderMode, setReorderMode] = useState(false);

  const [filters] = useAcademicSubjectFilters();
  const { openDeleteModal } = useDeleteModal();

  const { data: subjectsData } = useAcademicSubjects();
  const { mutate: reorderAcademicSubjects, isPending: isReordering } =
    useReorderAcademicSubjects();
  const {
    mutateAsync: bulkActiveAcademicSubjects,
    isPending: isBulkActivating,
  } = useBulkActiveAcademicSubjects();
  const {
    mutateAsync: bulkDeactivateAcademicSubjects,
    isPending: isBulkDeactivating,
  } = useBulkDeactivateAcademicSubjects();
  const { mutateAsync: bulkDeleteAcademicSubjects, isPending: isBulkDeleting } =
    useBulkDeleteAcademicSubjects();
  const { mutateAsync: activeAcademicSubject, isPending: isActivating } =
    useActiveAcademicSubject();
  const { mutateAsync: deactivateAcademicSubject, isPending: isDeactivating } =
    useDeactivateAcademicSubject();
  const { mutate: deleteAcademicSubject, isPending: isDeleting } =
    useDeleteAcademicSubject();

  const onReorder = (items: AcademicSubject[]) => {
    reorderAcademicSubjects(
      items.map((item, index) => ({ id: item.id, position: index + 1 })),
    );
  };

  const onBulkActivate = async () => {
    await bulkActiveAcademicSubjects({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onBulkDeactivate = async () => {
    await bulkDeactivateAcademicSubjects({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onBulkDelete = async () => {
    await bulkDeleteAcademicSubjects({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onActive = async (id: string) => {
    await activeAcademicSubject({ id })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onDeactivate = async (id: string) => {
    await deactivateAcademicSubject({ id })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const isLoading =
    isReordering ||
    isBulkActivating ||
    isBulkDeactivating ||
    isBulkDeleting ||
    isActivating ||
    isDeactivating ||
    isDeleting;

  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    openDeleteModal({
      entityId: subjectId,
      entityType: "subject",
      entityName: subjectName,
      onConfirm: (id) => {
        deleteAcademicSubject({ id });
      },
    });
  };

  return (
    <div className="min-h-screen p-4 space-y-6 text-foreground">
      {/* Class List Stat */}
      <SubjectListStat />

      <div className="flex flex-col gap-6">
        {/* Filter */}
        <Filter
          reorderMode={reorderMode}
          showReorder={!!filters.classId}
          setReorderMode={setReorderMode}
          setSelectedIds={setSelectedIds}
          isLoading={isLoading}
        />

        {/* Bulk Actions */}
        <BulkActions
          selectedCount={selectedIds.length}
          setSelectedIds={setSelectedIds}
          onBulkActivate={onBulkActivate}
          onBulkDeactivate={onBulkDeactivate}
          onBulkDelete={onBulkDelete}
          isLoading={isLoading}
        />

        {/* Reorder Mode Banner */}
        {reorderMode && (
          <div className="flex items-center gap-3 p-4 bg-primary/[0.03] backdrop-blur-md border border-primary/20 rounded-xl shadow-glow animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GripVertical className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <span className="text-sm text-primary font-semibold block">
                Reorder Mode Active
              </span>
              <span className="text-xs text-primary/70">
                Drag rows to adjust position. Your changes are synchronized
                automatically with the database.
              </span>
            </div>
          </div>
        )}

        {/* Subject List */}
        <SubjectList
          onReorder={onReorder}
          disableReorder={!reorderMode || isReordering}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onActive={onActive}
          onDeactivate={onDeactivate}
          isLoading={isLoading}
          handleDelete={handleDeleteSubject}
        />

        {/* Pagination */}
        <div className="pt-2">
          <Pagination totalItem={subjectsData?.meta.total || 0} />
        </div>
      </div>
    </div>
  );
};
