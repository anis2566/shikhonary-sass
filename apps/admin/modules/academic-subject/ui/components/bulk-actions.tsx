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
    <div className="flex items-center gap-4 p-4 bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-medium animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center gap-2.5 px-3 py-1.5 bg-primary/10 rounded-xl border border-primary/20">
        <div className="flex items-center justify-center size-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg animate-pulse">
          {selectedCount}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Selected
        </span>
      </div>

      <div className="h-6 w-px bg-border/50" />

      <div className="flex items-center gap-2 flex-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkActivate}
          disabled={isLoading}
          className="h-9 rounded-xl border-border/50 hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/20 transition-all font-semibold"
        >
          <ToggleRight className="h-4 w-4 mr-2" />
          Activate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDeactivate}
          disabled={isLoading}
          className="h-9 rounded-xl border-border/50 hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/20 transition-all font-semibold"
        >
          <ToggleLeft className="h-4 w-4 mr-2" />
          Deactivate
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-border/50 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all font-semibold"
          onClick={onBulkDelete}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-xl hover:bg-muted/80 text-muted-foreground"
        onClick={() => setSelectedIds([])}
        disabled={isLoading}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
