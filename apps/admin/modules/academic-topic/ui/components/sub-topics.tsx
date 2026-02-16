"use client";

import { ChevronRight, Plus, HelpCircle, BookText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import {
  useBulkActiveAcademicTopics,
  useBulkDeactivateAcademicTopics,
  useBulkDeleteAcademicTopics,
} from "@workspace/api-client";
import { BulkActions } from "./bulk-actions";

interface SubTopicWithRelation {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
  position: number;
  _count?: {
    mcqs: number;
    cqs: number;
  };
}

interface SubTopicsTabProps {
  subTopics: SubTopicWithRelation[];
  topicName: string;
  topicId: string;
}

export const SubTopicsTab = ({
  subTopics,
  topicName,
  topicId,
}: SubTopicsTabProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { mutateAsync: bulkActive, isPending: isActivating } =
    useBulkActiveAcademicTopics();
  const { mutateAsync: bulkDeactivate, isPending: isDeactivating } =
    useBulkDeactivateAcademicTopics();
  const { mutateAsync: bulkDelete, isPending: isDeleting } =
    useBulkDeleteAcademicTopics();

  const isLoading = isActivating || isDeactivating || isDeleting;

  const handleSelectAll = () => {
    if (selectedIds.length === subTopics.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(subTopics.map((s) => s.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {selectedIds.length > 0 && (
        <BulkActions
          selectedCount={selectedIds.length}
          setSelectedIds={setSelectedIds}
          onBulkActivate={async () => {
            await bulkActive({ ids: selectedIds });
            setSelectedIds([]);
          }}
          onBulkDeactivate={async () => {
            await bulkDeactivate({ ids: selectedIds });
            setSelectedIds([]);
          }}
          onBulkDelete={async () => {
            await bulkDelete({ ids: selectedIds });
            setSelectedIds([]);
          }}
          isLoading={isLoading}
        />
      )}

      <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between pb-6 bg-muted/30 border-b border-border/50 space-y-0">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={
                subTopics.length > 0 && selectedIds.length === subTopics.length
              }
              onCheckedChange={handleSelectAll}
              className="rounded-md border-border/50"
            />
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-soft">
                <BookText className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black tracking-tight">
                  Sub-Topic Catalog ({subTopics.length})
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Full list of sub-topics for {topicName}
                </CardDescription>
              </div>
            </div>
          </div>
          <Button
            asChild
            className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-9 px-4 shadow-glow"
          >
            <Link href={`/topics/new?parentId=${topicId}`}>
              <Plus className="h-3.5 w-3.5 mr-2 stroke-[3]" />
              Add Sub-Topic
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-8">
          {subTopics.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
              <div className="size-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
                <BookText className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-black text-foreground mb-1">
                No Sub-Topics Yet
              </p>
              <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto font-medium">
                Your sub-topic repository is currently empty. Start building it
                out by adding your first sub-topic.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-xl font-black tracking-tight shadow-glow hover:scale-105 transition-all"
              >
                <Link href={`/topics/new?parentId=${topicId}`}>
                  <Plus className="h-4 w-4 mr-2 stroke-[3]" />
                  Create First Sub-Topic
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {subTopics.map((subTopic, idx) => (
                <div
                  key={subTopic.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-background/30 hover:bg-background/80 transition-all duration-300 group shadow-soft",
                    selectedIds.includes(subTopic.id) &&
                      "border-primary/30 bg-primary/[0.02] ring-1 ring-primary/10",
                  )}
                >
                  <Checkbox
                    checked={selectedIds.includes(subTopic.id)}
                    onCheckedChange={() => handleSelectOne(subTopic.id)}
                    className="rounded-md border-border/50"
                  />
                  <Link
                    href={`/topics/${subTopic.id}`}
                    className="flex-1 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <div className="size-12 rounded-xl bg-muted/50 flex items-center justify-center text-foreground font-black text-sm border border-border/50 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all shadow-soft">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <p className="font-black text-foreground group-hover:text-primary transition-colors tracking-tight text-base">
                          {subTopic.displayName}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.1em] flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg border border-border/30">
                            <HelpCircle className="size-3" />
                            {(subTopic._count?.mcqs || 0) +
                              (subTopic._count?.cqs || 0)}{" "}
                            items
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge
                        variant={subTopic.isActive ? "default" : "secondary"}
                        className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-2",
                          subTopic.isActive
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-muted text-muted-foreground border-transparent",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full mr-2",
                            subTopic.isActive
                              ? "bg-green-500 animate-pulse"
                              : "bg-muted-foreground",
                          )}
                        />
                        {subTopic.isActive ? "Live" : "Draft"}
                      </Badge>
                      <div className="size-9 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-300">
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
