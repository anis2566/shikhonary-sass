"use client";

import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  FileText,
  HelpCircle,
  Plus,
  Sparkles,
  Target,
  Trash2,
  BookText,
} from "lucide-react";

import { TabsContent } from "@workspace/ui/components/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import {
  useAcademicSubTopicDetailedStats,
  useAcademicSubTopicRecentQuestions,
  useDeleteAcademicSubTopic,
} from "@workspace/api-client";

interface OverviewTabProps {
  subTopicId: string;
  subTopic: {
    id: string;
    name: string;
    displayName: string;
    position: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    topicId: string;
    topic?: {
      id: string;
      name: string;
      displayName: string;
      chapter?: {
        id: string;
        name: string;
        displayName: string;
      } | null;
    } | null;
  };
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export const OverviewTab = ({
  subTopicId,
  subTopic,
  setActiveTab,
}: OverviewTabProps) => {
  const router = useRouter();
  const { mutate: deleteSubTopic } = useDeleteAcademicSubTopic();
  const { openDeleteModal } = useDeleteModal();

  const { data: statsData, isLoading: isLoadingStats } =
    useAcademicSubTopicDetailedStats(subTopicId);
  const overview = statsData?.overview;

  const { data: recentQuestions, isLoading: isLoadingQuestions } =
    useAcademicSubTopicRecentQuestions(subTopicId);

  const handleCopyId = () => {
    navigator.clipboard.writeText(subTopic.id);
    toast.success("ID copied to clipboard");
  };

  const handleDeleteSubTopic = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "subtopic",
      entityName: name,
      onConfirm: (id) => {
        deleteSubTopic({ id });
      },
    });
  };

  const mcqs = overview?.totalMcqs || 0;
  const cqs = overview?.totalCqs || 0;
  const totalQuestions = overview?.totalQuestions || 0;

  return (
    <TabsContent
      value="overview"
      className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
            <CardHeader className="pb-6 bg-muted/30 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-soft">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">
                    Sub-Topic Information
                  </CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-70">
                    Core details and status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    Display Name
                  </p>
                  <p className="text-lg font-black text-foreground tracking-tight">
                    {subTopic.displayName}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    Visibility Status
                  </p>
                  <Badge
                    variant={subTopic.isActive ? "default" : "secondary"}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2",
                      subTopic.isActive
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-transparent",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full mr-2",
                        subTopic.isActive
                          ? "bg-primary animate-pulse"
                          : "bg-muted-foreground",
                      )}
                    />
                    {subTopic.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    System Name (Slug)
                  </p>
                  <div className="flex items-center gap-2 group/code">
                    <code className="text-xs font-mono bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50 text-foreground/80 font-bold group-hover:bg-muted transition-colors">
                      {subTopic.name}
                    </code>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    Parent Topic
                  </p>
                  {subTopic.topic ? (
                    <Link
                      href={`/topics/${subTopic.topic.id}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-black tracking-tight text-base group"
                    >
                      {subTopic.topic.displayName}
                      <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <span className="text-muted-foreground font-bold">—</span>
                  )}
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                  Question Summary
                </p>
                {isLoadingStats ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-2xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col p-5 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all hover:bg-muted/50">
                      <p className="text-3xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                        {mcqs}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                        MCQ Assets
                      </p>
                    </div>
                    <div className="flex flex-col p-5 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all hover:bg-muted/50">
                      <p className="text-3xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                        {cqs}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                        CQ Assets
                      </p>
                    </div>
                    <div className="flex flex-col p-5 rounded-2xl bg-primary/5 border border-primary/20 group hover:border-primary/30 transition-all hover:bg-primary/10">
                      <p className="text-3xl font-black text-primary tracking-tighter">
                        {totalQuestions}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mt-1">
                        Total Questions
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Questions Preview */}
          <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-6 bg-muted/30 border-b border-border/50 space-y-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-500/10 rounded-2xl text-yellow-600 shadow-soft">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">
                    Recent Assessment Items
                  </CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-70">
                    Latest additions to the question bank
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {isLoadingQuestions ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-2xl" />
                  ))}
                </div>
              ) : recentQuestions?.mcqs.length === 0 &&
                recentQuestions?.cqs.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                  <div className="size-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
                    <BookText className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-lg font-black text-foreground mb-1">
                    No Questions Yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto font-medium">
                    Add MCQs or CQs to this sub-topic to start building your
                    assessment pool.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {[
                    ...(recentQuestions?.mcqs || []).map((m: any) => ({
                      ...m,
                      type: "MCQ",
                    })),
                    ...(recentQuestions?.cqs || []).map((c: any) => ({
                      ...c,
                      type: "CQ",
                    })),
                  ]
                    .sort(
                      (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime(),
                    )
                    .slice(0, 5)
                    .map((q, idx) => (
                      <div
                        key={q.id}
                        className="flex items-center justify-between p-5 rounded-2xl border border-border/50 bg-background/30 hover:bg-background/80 hover:border-primary/30 hover:shadow-glow transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-xl bg-muted/50 flex items-center justify-center text-foreground font-black text-sm border border-border/50 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all shadow-soft">
                            {q.type}
                          </div>
                          <div>
                            <p className="font-black text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1 max-w-[300px]">
                              {q.questionText || q.title || "Untitled Question"}
                            </p>
                            <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest mt-1">
                              Last updated{" "}
                              {new Date(q.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-muted text-muted-foreground font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-lg border-transparent"
                        >
                          {q.type === "MCQ" ? q.type : "Creative"}
                        </Badge>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Quick Actions */}
          <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
            <CardHeader className="pb-4 bg-muted/30 border-b border-border/50">
              <CardTitle className="text-lg font-black tracking-tight uppercase tracking-wider text-foreground/80">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold group shadow-soft"
                onClick={() =>
                  router.push(`/admin/mcqs/new?subTopicId=${subTopicId}`)
                }
              >
                <Plus className="h-4 w-4 mr-3 text-primary group-hover:scale-125 transition-transform" />
                Add New MCQ
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold group shadow-soft"
                onClick={() =>
                  router.push(`/admin/cqs/new?subTopicId=${subTopicId}`)
                }
              >
                <Plus className="h-4 w-4 mr-3 text-blue-500 group-hover:scale-125 transition-transform" />
                Add New CQ
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold group shadow-soft"
                asChild
              >
                <Link href={`/sub-topics/edit/${subTopicId}`}>
                  <Edit className="h-4 w-4 mr-3 text-indigo-500 group-hover:scale-125 transition-transform" />
                  Edit Sub-Topic
                </Link>
              </Button>
              <div className="py-2">
                <Separator className="bg-border/50" />
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-all font-bold"
                onClick={() =>
                  handleDeleteSubTopic(subTopic.id, subTopic.displayName)
                }
              >
                <Trash2 className="h-4 w-4 mr-3" />
                Delete Sub-Topic
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
            <CardHeader className="pb-4 bg-muted/30 border-b border-border/50">
              <CardTitle className="text-lg font-black tracking-tight uppercase tracking-wider text-foreground/80">
                Traceability
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-muted/80 flex items-center justify-center text-muted-foreground shadow-soft border border-border/50">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    Creation Date
                  </p>
                  <p className="text-sm font-black text-foreground tracking-tight">
                    {new Date(subTopic.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-muted/80 flex items-center justify-center text-muted-foreground shadow-soft border border-border/50">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    Last Global Update
                  </p>
                  <p className="text-sm font-black text-foreground tracking-tight">
                    {new Date(subTopic.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Separator className="bg-border/50" />
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2">
                  Hash Identifier
                </p>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-xl border border-border/50 group/id transition-all hover:bg-muted">
                  <code className="text-[10px] font-mono flex-1 truncate font-bold opacity-80 pl-1">
                    {subTopic.id}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                    onClick={handleCopyId}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};
