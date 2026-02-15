"use client";

import { Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@workspace/ui/components/button";

interface BulkActionsProps {
  selectedCount: number;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkDelete: () => void;
  isLoading?: boolean;
}

export const BulkActions = ({
  selectedCount,
  setSelectedIds,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  isLoading,
}: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
      <span className="text-sm font-medium text-foreground">
        {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
      </span>
      <div className="flex items-center gap-1 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkActivate}
          disabled={isLoading}
        >
          <ToggleRight className="h-4 w-4 mr-1" />
          Activate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDeactivate}
          disabled={isLoading}
        >
          <ToggleLeft className="h-4 w-4 mr-1" />
          Deactivate
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={onBulkDelete}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedIds([])}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
