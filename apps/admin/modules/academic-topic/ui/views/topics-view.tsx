"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";

import { AcademicTopic } from "@workspace/db";
import {
  useReorderAcademicTopics,
  useBulkActiveAcademicTopics,
  useBulkDeactivateAcademicTopics,
  useBulkDeleteAcademicTopics,
  useActiveAcademicTopic,
  useDeactivateAcademicTopic,
  useDeleteAcademicTopic,
  useAcademicTopics,
  useAcademicTopicFilters,
} from "@workspace/api-client";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import { TopicListStat } from "../components/topic-list-stat";
import { Filter } from "../components/filter";
import { BulkActions } from "../components/bulk-actions";
import { TopicList } from "../components/topic-list";
import { Pagination } from "../components/pagination";

export const TopicsView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reorderMode, setReorderMode] = useState(false);

  const [filters] = useAcademicTopicFilters();
  const { openDeleteModal } = useDeleteModal();

  const { data: topicsData } = useAcademicTopics();
  const { mutate: reorderAcademicTopics, isPending: isReordering } =
    useReorderAcademicTopics();
  const { mutateAsync: bulkActiveAcademicTopics, isPending: isBulkActivating } =
    useBulkActiveAcademicTopics();
  const {
    mutateAsync: bulkDeactivateAcademicTopics,
    isPending: isBulkDeactivating,
  } = useBulkDeactivateAcademicTopics();
  const { mutateAsync: bulkDeleteAcademicTopics, isPending: isBulkDeleting } =
    useBulkDeleteAcademicTopics();
  const { mutateAsync: activeAcademicTopic, isPending: isActivating } =
    useActiveAcademicTopic();
  const { mutateAsync: deactivateAcademicTopic, isPending: isDeactivating } =
    useDeactivateAcademicTopic();
  const { mutate: deleteAcademicTopic, isPending: isDeleting } =
    useDeleteAcademicTopic();

  const onReorder = (items: AcademicTopic[]) => {
    reorderAcademicTopics(
      items.map((item, index) => ({ id: item.id, position: index + 1 })),
    );
  };

  const onBulkActivate = async () => {
    await bulkActiveAcademicTopics({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onBulkDeactivate = async () => {
    await bulkDeactivateAcademicTopics({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onBulkDelete = async () => {
    await bulkDeleteAcademicTopics({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onActive = async (id: string) => {
    await activeAcademicTopic({ id })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onDeactivate = async (id: string) => {
    await deactivateAcademicTopic({ id })
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

  const handleDeleteTopic = (topicId: string, topicName: string) => {
    openDeleteModal({
      entityId: topicId,
      entityType: "topic",
      entityName: topicName,
      onConfirm: (id) => {
        deleteAcademicTopic({ id });
      },
    });
  };

  const showReorderMode = !!filters.chapterId;

  return (
    <div className="min-h-screen p-4 space-y-6 text-foreground">
      {/* List Stat */}
      <TopicListStat />

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
        <TopicList
          onReorder={onReorder}
          disableReorder={!reorderMode || isReordering}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onActive={onActive}
          onDeactivate={onDeactivate}
          isLoading={isLoading}
          handleDelete={handleDeleteTopic}
        />

        {/* Pagination */}
        <div className="pt-2">
          <Pagination totalItem={topicsData?.meta.total || 0} />
        </div>
      </div>
    </div>
  );
};
