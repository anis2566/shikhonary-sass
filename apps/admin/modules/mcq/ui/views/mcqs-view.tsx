"use client";

import { useState } from "react";

import {
  useMCQs,
  useDeleteMCQ,
  useBulkDeleteMCQs,
  useActivateMCQ,
  useDeactivateMCQ,
} from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import { McqListStat } from "../components/stat-card";
import { Filter } from "../components/filter";
import { BulkActions } from "../components/bulk-actions";
import { McqCard, McqCardItem } from "../components/mcq-card";
import { Pagination } from "../components/pagination";

export const McqsView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { openDeleteModal } = useDeleteModal();

  const { data: mcqsData } = useMCQs();
  const { mutate: deleteMCQ, isPending: isDeleting } = useDeleteMCQ();
  const { mutateAsync: bulkDeleteMCQs, isPending: isBulkDeleting } =
    useBulkDeleteMCQs();
  const { mutateAsync: activateMCQ, isPending: isActivating } =
    useActivateMCQ();
  const { mutateAsync: deactivateMCQ, isPending: isDeactivating } =
    useDeactivateMCQ();

  const mcqs: McqCardItem[] = mcqsData?.items ?? [];
  const total = mcqsData?.meta?.total ?? 0;

  const isLoading =
    isDeleting || isBulkDeleting || isActivating || isDeactivating;

  const handleDelete = (id: string, question: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "mcq",
      entityName: question.slice(0, 60) + (question.length > 60 ? "..." : ""),
      onConfirm: (id) => {
        deleteMCQ({ id });
      },
    });
  };

  const handleBulkDelete = async () => {
    await bulkDeleteMCQs({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch(console.error);
  };

  const handleToggleStatus = async (mcq: McqCardItem) => {
    if (mcq.isActive) {
      await deactivateMCQ({ id: mcq.id }).catch(console.error);
    } else {
      await activateMCQ({ id: mcq.id }).catch(console.error);
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 text-foreground">
      {/* Stats */}
      <McqListStat />

      <div className="flex flex-col gap-6">
        {/* Filter */}
        <Filter setSelectedIds={setSelectedIds} isLoading={isLoading} />

        {/* Bulk Actions */}
        <BulkActions
          selectedCount={selectedIds.length}
          setSelectedIds={setSelectedIds}
          onBulkDelete={handleBulkDelete}
          isLoading={isLoading}
        />

        {/* Cards Grid */}
        {mcqs.length === 0 ? (
          <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-dashed border-border/50 p-12 text-center shadow-soft">
            <div className="size-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
              <span className="text-3xl">🤔</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">No MCQs Found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              We couldn&apos;t find any MCQs matching your criteria. Try
              adjusting your filters or create a new one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mcqs.map((mcq) => (
              <McqCard
                key={mcq.id}
                mcq={mcq}
                selected={selectedIds.includes(mcq.id)}
                onSelect={(id) => {
                  if (selectedIds.includes(id)) {
                    setSelectedIds(selectedIds.filter((i) => i !== id));
                  } else {
                    setSelectedIds([...selectedIds, id]);
                  }
                }}
                onDelete={() => handleDelete(mcq.id, mcq.question)}
                onToggleStatus={() => handleToggleStatus(mcq)}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="pt-2">
          <Pagination totalItem={total} />
        </div>
      </div>
    </div>
  );
};
