"use client";

import {
  BookText,
  Calendar,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  Hash,
  HelpCircle,
  Layers,
  Plus,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "@workspace/ui/components/sonner";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { TabsContent } from "@workspace/ui/components/tabs";

import { cn } from "@workspace/ui/lib/utils";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import {
  useAcademicChapterDetailedStats,
  useAcademicChapterRecentTopics,
  useDeleteAcademicChapter,
} from "@workspace/api-client";
import { type AcademicChapter } from "@workspace/db";

interface ChapterWithRelations extends AcademicChapter {
  subject?: {
    id: string;
    displayName: string;
    class?: {
      id: string;
      displayName: string;
    } | null;
  } | null;
  topics?: TopicWithCount[];
}

interface TopicWithCount {
  id: string;
  displayName: string;
  isActive: boolean;
  _count?: {
    subtopics: number;
  };
}

interface OverviewTabProps {
  chapterId: string;
  chapter: ChapterWithRelations;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export const OverviewTab = ({
  chapterId,
  chapter,
  setActiveTab,
}: OverviewTabProps) => {
  const router = useRouter();
  const { mutate: deleteAcademicChapter } = useDeleteAcademicChapter();
  const { openDeleteModal } = useDeleteModal();

  // Fetch detailed statistics
  const { data: statsData, isLoading: isLoadingStats } =
    useAcademicChapterDetailedStats(chapterId);
  const stats = statsData?.stats;

  // Fetch recent topics
  const { data: topicsData, isLoading: isLoadingTopics } =
    useAcademicChapterRecentTopics(chapterId);
  const topics = topicsData?.topics || [];

  const handleCopyId = () => {
    navigator.clipboard.writeText(chapter.id);
    toast.success("ID copied to clipboard");
  };

  const handleDeleteChapter = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "chapter",
      entityName: name,
      onConfirm: (id) => {
        deleteAcademicChapter({ id });
      },
    });
  };

  // Calculate stats
  const activeTopics = stats?.overview.activeTopics || 0;
  const totalSubTopics = stats?.overview.totalSubTopics || 0;
  const totalMcqs = stats?.overview.totalMcqs || 0;
  const totalCqs = stats?.overview.totalCqs || 0;
  const completionRate = stats?.overview.completionRate || 0;

  return (
    <TabsContent
      value="overview"
      className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chapter Information */}
          <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
            <CardHeader className="pb-6 bg-muted/30 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-soft">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">
                    Chapter Information
                  </CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-70">
                    Detailed metadata and configuration
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
                    {chapter.displayName}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    Visibility Status
                  </p>
                  <Badge
                    variant={chapter.isActive ? "default" : "secondary"}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2",
                      chapter.isActive
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-transparent",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full mr-2",
                        chapter.isActive
                          ? "bg-primary animate-pulse"
                          : "bg-muted-foreground",
                      )}
                    />
                    {chapter.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    System Name (Slug)
                  </p>
                  <div className="flex items-center gap-2 group/code">
                    <code className="text-xs font-mono bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50 text-foreground/80 font-bold group-hover:bg-muted transition-colors">
                      {chapter.name}
                    </code>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    Structure Position
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="size-8 bg-muted rounded-lg flex items-center justify-center border border-border/50">
                      <Hash className="h-4 w-4 text-muted-foreground/70" />
                    </div>
                    <span className="font-black text-foreground">
                      {chapter.position}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Content Summary Stats */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                  Topic & Resource Distribution
                </p>
                {isLoadingStats ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-2xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="flex flex-col p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all hover:bg-muted/50">
                      <p className="text-2xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                        {activeTopics}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                        Active Topics
                      </p>
                    </div>
                    <div className="flex flex-col p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all hover:bg-muted/50">
                      <p className="text-2xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                        {totalSubTopics}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                        Sub-Topics
                      </p>
                    </div>
                    <div className="flex flex-col p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all hover:bg-muted/50">
                      <p className="text-2xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                        {totalMcqs}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                        MCQ Count
                      </p>
                    </div>
                    <div className="flex flex-col p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all hover:bg-muted/50">
                      <p className="text-2xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                        {totalCqs}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                        CQ Assets
                      </p>
                    </div>
                    <div className="flex flex-col p-4 rounded-2xl bg-primary/5 border border-primary/20 group hover:border-primary/30 transition-all hover:bg-primary/10">
                      <p className="text-2xl font-black text-primary tracking-tighter">
                        {Math.min(completionRate, 100)}%
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary/70 mt-1">
                        Coverage
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Topics Preview */}
          <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-6 bg-muted/30 border-b border-border/50 space-y-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-600 shadow-soft">
                  <BookText className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">
                    Recent Topics
                  </CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-70">
                    Latest additions to syllabus
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/50 font-bold uppercase tracking-widest text-[10px] h-9 px-4 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-soft active:scale-95"
                onClick={() => setActiveTab("topics")}
              >
                Full Access
                <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              {isLoadingTopics ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-2xl" />
                  ))}
                </div>
              ) : topics.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                  <div className="size-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
                    <BookText className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-lg font-black text-foreground mb-1">
                    No Topics Found
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto font-medium">
                    Start populating this chapter by creating its first
                    educational topic.
                  </p>
                  <Button
                    size="sm"
                    className="rounded-xl font-black tracking-tight shadow-glow hover:scale-105 transition-all"
                    asChild
                  >
                    <Link href={`/topics/new?chapterId=${chapterId}`}>
                      <Plus className="h-4 w-4 mr-2 stroke-[3]" />
                      Create New Topic
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {topics.map((topic: TopicWithCount, idx: number) => (
                    <Link
                      key={topic.id}
                      href={`/topics/${topic.id}`}
                      className="flex items-center justify-between p-5 rounded-2xl border border-border/50 bg-background/30 hover:bg-background/80 hover:border-primary/30 hover:shadow-glow transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-muted/50 flex items-center justify-center text-foreground font-black text-sm border border-border/50 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all shadow-soft">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <p className="font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                            {topic.displayName}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
                              <Layers className="size-3" />
                              {topic._count?.subtopics || 0} sub-topics
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={topic.isActive ? "default" : "secondary"}
                          className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                            topic.isActive
                              ? "bg-green-500/10 text-green-600 border border-green-500/20"
                              : "bg-muted text-muted-foreground border-transparent",
                          )}
                        >
                          {topic.isActive ? "Live" : "Draft"}
                        </Badge>
                        <ChevronRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
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
                asChild
              >
                <Link href={`/topics/new?chapterId=${chapterId}`}>
                  <Plus className="h-4 w-4 mr-3 text-primary group-hover:scale-125 transition-transform" />
                  Add New Topic
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold group shadow-soft"
                onClick={() =>
                  router.push(`/admin/mcqs?chapterId=${chapterId}`)
                }
              >
                <HelpCircle className="h-4 w-4 mr-3 text-orange-500 group-hover:scale-125 transition-transform" />
                Manage MCQ Bank
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold group shadow-soft"
                onClick={() => router.push(`/admin/cqs?chapterId=${chapterId}`)}
              >
                <Target className="h-4 w-4 mr-3 text-blue-500 group-hover:scale-125 transition-transform" />
                Manage CQ Bank
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold group shadow-soft"
                onClick={() =>
                  router.push(`/admin/academic-tree?chapterId=${chapterId}`)
                }
              >
                <Layers className="h-4 w-4 mr-3 text-purple-500 group-hover:scale-125 transition-transform" />
                Curriculum Explorer
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold group shadow-soft"
                asChild
              >
                <Link href={`/chapters/edit/${chapterId}`}>
                  <Edit className="h-4 w-4 mr-3 text-indigo-500 group-hover:scale-125 transition-transform" />
                  Edit Chapter Settings
                </Link>
              </Button>
              <div className="py-2">
                <Separator className="bg-border/50" />
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-all font-bold"
                onClick={() =>
                  handleDeleteChapter(chapter.id, chapter.displayName)
                }
              >
                <Trash2 className="h-4 w-4 mr-3" />
                Delete Chapter
              </Button>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
            <CardHeader className="pb-4 bg-muted/30 border-b border-border/50">
              <CardTitle className="text-lg font-black tracking-tight uppercase tracking-wider text-foreground/80">
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-muted/50 rounded-xl flex items-center justify-center border border-border/50">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Date Created
                  </p>
                  <p className="text-sm font-black text-foreground">
                    {new Date(chapter.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center gap-4">
                <div className="size-10 bg-muted/50 rounded-xl flex items-center justify-center border border-border/50">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Last Modified
                  </p>
                  <p className="text-sm font-black text-foreground">
                    {new Date(chapter.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Separator className="bg-border/50" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  Permanent Chapter ID
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-[10px] font-mono bg-muted/50 px-3 py-2 rounded-xl flex-1 break-all border border-border/20 text-muted-foreground select-all">
                    {chapter.id}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-10 w-10 text-primary hover:bg-primary/10 rounded-xl transition-all"
                    onClick={handleCopyId}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics Card */}
          <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
            <CardHeader className="pb-4 bg-muted/30 border-b border-border/50">
              <CardTitle className="text-lg font-black tracking-tight uppercase tracking-wider text-foreground/80">
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {isLoadingStats ? (
                <Skeleton className="h-32 rounded-2xl" />
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                          <Target className="size-3.5 text-primary" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">
                          Curriculum Coverage
                        </span>
                      </div>
                      <span className="text-sm font-black text-foreground">
                        {Math.min(completionRate, 100)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(completionRate, 100)}
                      className="h-2.5 bg-muted rounded-full"
                    />
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-[10px] font-medium text-primary/70 leading-relaxed uppercase tracking-widest">
                      Consistency Insight
                    </p>
                    <p className="text-xs font-black text-foreground mt-1 leading-relaxed">
                      {activeTopics} topics currently active. Ensure status
                      consistency across all platform delivery channels.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};
