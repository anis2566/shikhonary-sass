"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";

import { AcademicClass } from "@workspace/db";

import {
  useAcademicClasses,
  useActiveAcademicClass,
  useBulkActiveAcademicClasses,
  useBulkDeactivateAcademicClasses,
  useBulkDeleteAcademicClasses,
  useDeactivateAcademicClass,
  useDeleteAcademicClass,
  useReorderAcademicClasses,
} from "@workspace/api-client";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import { Filter } from "../components/filter";
import { Pagination } from "../components/pagination";
import { ClassListStat } from "../components/class-list-stat";
import { ClassList } from "../components/class-list";
import { BulkActions } from "../components/bulk-actions";

export const ClassesView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reorderMode, setReorderMode] = useState(false);

  const { openDeleteModal } = useDeleteModal();

  const { data: classesData } = useAcademicClasses();
  const { mutate: reorderAcademicClasses, isPending: isReordering } =
    useReorderAcademicClasses();
  const {
    mutateAsync: bulkActiveAcademicClasses,
    isPending: isBulkActivating,
  } = useBulkActiveAcademicClasses();
  const {
    mutateAsync: bulkDeactivateAcademicClasses,
    isPending: isBulkDeactivating,
  } = useBulkDeactivateAcademicClasses();
  const { mutateAsync: bulkDeleteAcademicClasses, isPending: isBulkDeleting } =
    useBulkDeleteAcademicClasses();
  const { mutateAsync: activeAcademicClass, isPending: isActivating } =
    useActiveAcademicClass();
  const { mutateAsync: deactivateAcademicClass, isPending: isDeactivating } =
    useDeactivateAcademicClass();
  const { mutate: deleteAcademicClass, isPending: isDeleting } =
    useDeleteAcademicClass();

  const onReorder = (items: AcademicClass[]) => {
    reorderAcademicClasses(
      items.map((item, index) => ({ id: item.id, position: index })),
    );
  };

  const onBulkActivate = async () => {
    await bulkActiveAcademicClasses({ ids: selectedIds }).then(() =>
      setSelectedIds([]),
    );
  };

  const onBulkDeactivate = async () => {
    await bulkDeactivateAcademicClasses({ ids: selectedIds }).then(() =>
      setSelectedIds([]),
    );
  };

  const onBulkDelete = async () => {
    await bulkDeleteAcademicClasses({ ids: selectedIds }).then(() =>
      setSelectedIds([]),
    );
  };

  const onActive = async (id: string) => {
    await activeAcademicClass({ id }).then(() => setSelectedIds([]));
  };

  const onDeactivate = async (id: string) => {
    await deactivateAcademicClass({ id }).then(() => setSelectedIds([]));
  };

  const isLoading =
    isReordering ||
    isBulkActivating ||
    isBulkDeactivating ||
    isBulkDeleting ||
    isActivating ||
    isDeactivating ||
    isDeleting;

  const handleDeleteClass = (classId: string, className: string) => {
    openDeleteModal({
      entityId: classId,
      entityType: "class",
      entityName: className,
      onConfirm: (id) => {
        deleteAcademicClass({ id });
      },
    });
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Class List Stat */}
      <ClassListStat />

      <div className="flex flex-col gap-4">
        {/* Filter */}
        <Filter
          reorderMode={reorderMode}
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

        {/* Reorder Mode */}
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
      </div>

      {/* Class List */}
      <ClassList
        onReorder={onReorder}
        disableReorder={!reorderMode || isReordering}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onActive={onActive}
        onDeactivate={onDeactivate}
        isLoading={isLoading}
        handleDelete={handleDeleteClass}
      />

      {/* Pagination */}
      <Pagination totalItem={classesData?.meta.total ?? 0} />
    </div>
  );
};
