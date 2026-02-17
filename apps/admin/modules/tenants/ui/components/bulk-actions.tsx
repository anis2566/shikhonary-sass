"use client";

import { X, Check, XCircle, Trash2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";

interface BulkActionsProps {
  selectedCount: number;
  setSelectedIds: (ids: string[]) => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkDelete: () => void;
  isLoading: boolean;
}

import { motion, AnimatePresence } from "framer-motion";

export const BulkActions = ({
  selectedCount,
  setSelectedIds,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  isLoading,
}: BulkActionsProps) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className="w-full"
        >
          <Card className="bg-primary/[0.03] backdrop-blur-xl border-primary/20 rounded-2xl overflow-hidden shadow-glow p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-soft">
                  <Check className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-primary tracking-tight">
                    {selectedCount} Tenant{selectedCount > 1 ? "s" : ""}{" "}
                    Selected
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 leading-none">
                    Bulk Actions Available
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkActivate}
                  disabled={isLoading}
                  className="h-9 px-4 bg-background/50 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary rounded-xl transition-all font-bold shadow-soft flex-shrink-0"
                >
                  <Check className="w-3.5 h-3.5 mr-2 stroke-[3]" />
                  Reactivate All
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkDeactivate}
                  disabled={isLoading}
                  className="h-9 px-4 bg-background/50 border-amber-500/20 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500 rounded-xl transition-all font-bold shadow-soft flex-shrink-0"
                >
                  <XCircle className="w-3.5 h-3.5 mr-2 stroke-[3]" />
                  Suspend All
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkDelete}
                  disabled={isLoading}
                  className="h-9 px-4 bg-background/50 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all font-bold shadow-soft flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2 stroke-[3]" />
                  Purge Records
                </Button>

                <div className="w-px h-6 bg-primary/20 mx-1 flex-shrink-0" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                  disabled={isLoading}
                  className="h-9 px-3 text-muted-foreground hover:bg-muted rounded-xl transition-all font-bold flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
