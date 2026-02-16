"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";

import { AcademicSubTopic } from "@workspace/db";
import {
  useReorderAcademicSubTopics,
  useBulkActiveAcademicSubTopics,
  useBulkDeactivateAcademicSubTopics,
  useBulkDeleteAcademicSubTopics,
  useActiveAcademicSubTopic,
  useDeactivateAcademicSubTopic,
  useDeleteAcademicSubTopic,
  useAcademicSubTopics,
  useAcademicSubTopicFilters,
} from "@workspace/api-client";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import { SubTopicListStat } from "../components/sub-topic-list-stat";
import { Filter } from "../components/filter";
import { BulkActions } from "../components/bulk-actions";
import { SubTopicList } from "../components/sub-topic-list";
import { Pagination } from "../components/pagination";

export const SubTopicsView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reorderMode, setReorderMode] = useState(false);

  const [filters] = useAcademicSubTopicFilters();
  const { openDeleteModal } = useDeleteModal();

  const { data: subTopicsData } = useAcademicSubTopics();
  const { mutate: reorderAcademicSubTopics, isPending: isReordering } =
    useReorderAcademicSubTopics();
  const {
    mutateAsync: bulkActiveAcademicSubTopics,
    isPending: isBulkActivating,
  } = useBulkActiveAcademicSubTopics();
  const {
    mutateAsync: bulkDeactivateAcademicSubTopics,
    isPending: isBulkDeactivating,
  } = useBulkDeactivateAcademicSubTopics();
  const {
    mutateAsync: bulkDeleteAcademicSubTopics,
    isPending: isBulkDeleting,
  } = useBulkDeleteAcademicSubTopics();
  const { mutateAsync: activeAcademicSubTopic, isPending: isActivating } =
    useActiveAcademicSubTopic();
  const { mutateAsync: deactivateAcademicSubTopic, isPending: isDeactivating } =
    useDeactivateAcademicSubTopic();
  const { mutate: deleteAcademicSubTopic, isPending: isDeleting } =
    useDeleteAcademicSubTopic();

  const onReorder = (items: AcademicSubTopic[]) => {
    reorderAcademicSubTopics(
      items.map((item, index) => ({ id: item.id, position: index + 1 })),
    );
  };

  const onBulkActivate = async () => {
    await bulkActiveAcademicSubTopics({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onBulkDeactivate = async () => {
    await bulkDeactivateAcademicSubTopics({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onBulkDelete = async () => {
    await bulkDeleteAcademicSubTopics({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onActive = async (id: string) => {
    await activeAcademicSubTopic({ id })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onDeactivate = async (id: string) => {
    await deactivateAcademicSubTopic({ id })
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

  const handleDeleteSubTopic = (subTopicId: string, subTopicName: string) => {
    openDeleteModal({
      entityId: subTopicId,
      entityType: "subtopic",
      entityName: subTopicName,
      onConfirm: (id) => {
        deleteAcademicSubTopic({ id });
      },
    });
  };

  const showReorderMode = !!filters.topicId;

  return (
    <div className="min-h-screen p-4 space-y-6 text-foreground">
      {/* List Stat */}
      <SubTopicListStat />

      <div className="flex flex-col gap-6">
        {/* Filter */}
        <Filter
          reorderMode={reorderMode}
          showReorderMode={showReorderMode}
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

        {/* List */}
        <SubTopicList
          onReorder={onReorder}
          disableReorder={!reorderMode || isReordering}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onActive={onActive}
          onDeactivate={onDeactivate}
          isLoading={isLoading}
          handleDelete={handleDeleteSubTopic}
        />

        {/* Pagination */}
        <div className="pt-2">
          <Pagination totalItem={subTopicsData?.meta.total || 0} />
        </div>
      </div>
    </div>
  );
};
