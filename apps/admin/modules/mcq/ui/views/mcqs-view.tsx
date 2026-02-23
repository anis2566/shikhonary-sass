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
    <div className="min-h-screen p-6 lg:p-8 space-y-10 text-foreground animate-in fade-in duration-700">
      {/* Stats */}
      <McqListStat />

      <div className="flex flex-col gap-10">
        {/* Filter & Actions Section */}
        <div className="space-y-6">
          <Filter setSelectedIds={setSelectedIds} isLoading={isLoading} />

          <BulkActions
            selectedCount={selectedIds.length}
            setSelectedIds={setSelectedIds}
            onBulkDelete={handleBulkDelete}
            isLoading={isLoading}
          />
        </div>

        {/* Cards Grid */}
        {mcqs.length === 0 ? (
          <div className="bg-card/80 backdrop-blur-2xl rounded-[3rem] border border-dashed border-border/60 p-20 text-center shadow-medium transition-all duration-500 hover:border-primary/30">
            <div className="size-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary/10 shadow-inner group transition-transform duration-500 hover:rotate-12">
              <span className="text-5xl group-hover:scale-110 transition-transform cursor-default">
                🤔
              </span>
            </div>
            <h3 className="text-3xl font-black bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              No MCQs Found
            </h3>
            <p className="text-base text-muted-foreground/80 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
              We couldn&apos;t find any MCQs matching your criteria. Try
              adjusting filters or create a new entry to get started.
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
