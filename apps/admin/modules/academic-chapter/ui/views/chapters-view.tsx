"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";

import { AcademicChapter } from "@workspace/db";

import {
  useAcademicChapters,
  useActiveAcademicChapter,
  useBulkActiveAcademicChapters,
  useBulkDeactivateAcademicChapters,
  useBulkDeleteAcademicChapters,
  useDeactivateAcademicChapter,
  useDeleteAcademicChapter,
  useReorderAcademicChapters,
  useAcademicChapterFilters,
} from "@workspace/api-client";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { ChapterListStat } from "../components/chapter-list-stat";
import { Filter } from "../components/filter";
import { BulkActions } from "../components/bulk-actions";
import { ChapterList } from "../components/chapter-list";
import { Pagination } from "../components/pagination";

export const ChaptersView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reorderMode, setReorderMode] = useState(false);

  const [filters] = useAcademicChapterFilters();
  const { openDeleteModal } = useDeleteModal();

  const { data } = useAcademicChapters();
  const { mutate: reorderAcademicChapters, isPending: isReordering } =
    useReorderAcademicChapters();
  const {
    mutateAsync: bulkActiveAcademicChapters,
    isPending: isBulkActivating,
  } = useBulkActiveAcademicChapters();
  const {
    mutateAsync: bulkDeactivateAcademicChapters,
    isPending: isBulkDeactivating,
  } = useBulkDeactivateAcademicChapters();
  const { mutateAsync: bulkDeleteAcademicChapters, isPending: isBulkDeleting } =
    useBulkDeleteAcademicChapters();
  const { mutateAsync: activeAcademicChapter, isPending: isActivating } =
    useActiveAcademicChapter();
  const { mutateAsync: deactivateAcademicChapter, isPending: isDeactivating } =
    useDeactivateAcademicChapter();
  const { mutate: deleteAcademicChapter, isPending: isDeleting } =
    useDeleteAcademicChapter();

  const onReorder = (items: AcademicChapter[]) => {
    reorderAcademicChapters(
      items.map((item, index) => ({ id: item.id, position: index })),
    );
  };

  const onBulkActivate = async () => {
    try {
      await bulkActiveAcademicChapters({ ids: selectedIds });
      setSelectedIds([]);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const onBulkDeactivate = async () => {
    try {
      await bulkDeactivateAcademicChapters({ ids: selectedIds });
      setSelectedIds([]);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await bulkDeleteAcademicChapters({ ids: selectedIds });
      setSelectedIds([]);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const onActive = async (id: string) => {
    try {
      await activeAcademicChapter({ id });
      setSelectedIds([]);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const onDeactivate = async (id: string) => {
    try {
      await deactivateAcademicChapter({ id });
      setSelectedIds([]);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const isLoading =
    isReordering ||
    isBulkActivating ||
    isBulkDeactivating ||
    isBulkDeleting ||
    isActivating ||
    isDeactivating ||
    isDeleting;

  const handleDeleteChapter = (chapterId: string, chapterName: string) => {
    openDeleteModal({
      entityId: chapterId,
      entityType: "chapter",
      entityName: chapterName,
      onConfirm: (id) => {
        deleteAcademicChapter({ id });
      },
    });
  };

  const showReorderMode =
    (filters.classId ?? "") !== "" && (filters.subjectId ?? "") !== "";

  return (
    <div className="min-h-screen p-4 space-y-6 text-foreground">
      {/* Chapter List Stat */}
      <ChapterListStat />

      <div className="flex flex-col gap-6">
        {/* Filter */}
        <Filter
          reorderMode={reorderMode}
          setReorderMode={setReorderMode}
          setSelectedIds={setSelectedIds}
          isLoading={isLoading}
          showReorderMode={showReorderMode}
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

        {/* Chapter List */}
        <ChapterList
          onReorder={onReorder}
          disableReorder={!reorderMode || isReordering}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onActive={onActive}
          onDeactivate={onDeactivate}
          isLoading={isLoading}
          handleDelete={handleDeleteChapter}
        />

        {/* Pagination */}
        <div className="pt-2">
          <Pagination totalItem={data?.meta.total || 0} />
        </div>
      </div>
    </div>
  );
};
