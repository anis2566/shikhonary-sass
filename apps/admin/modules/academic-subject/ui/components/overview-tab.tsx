"use client";

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
import { Progress } from "@workspace/ui/components/progress";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Calendar,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  FileText,
  HelpCircle,
  Layers,
  Plus,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useAcademicSubjectRecentChapters,
  useAcademicSubjectDetailedStats,
  useDeleteAcademicSubject,
} from "@workspace/api-client";
import { Dispatch, SetStateAction } from "react";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

interface OverviewProps {
  subjectId: string;
  subject: {
    id: string;
    name: string;
    displayName: string;
    code?: string | null;
    position: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    class?: {
      id: string;
      name: string;
      displayName: string;
    } | null;
  };
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export const Overview = ({
  subjectId,
  subject,
  setActiveTab,
}: OverviewProps) => {
  const router = useRouter();
  const { mutate: deleteAcademicSubject } = useDeleteAcademicSubject();
  const { openDeleteModal } = useDeleteModal();

  const { data: statsData, isLoading: isLoadingStats } =
    useAcademicSubjectDetailedStats(subjectId);
  const overview = statsData?.stats?.overview;

  // Fetch recent chapters
  const { data: chaptersData, isLoading: isLoadingChapters } =
    useAcademicSubjectRecentChapters(subjectId);
  const chapters = chaptersData || [];

  const handleCopyId = () => {
    navigator.clipboard.writeText(subject.id);
    toast.success("ID copied to clipboard");
  };

  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    openDeleteModal({
      entityId: subjectId,
      entityType: "subject",
      entityName: subjectName,
      onConfirm: (id) => {
        deleteAcademicSubject({ id });
      },
    });
  };

  // Calculate stats
  const activeChapters = overview?.totalChapters || 0; // The service doesn't have activeChapters yet, using total
  const totalTopics = overview?.totalTopics || 0;
  const totalQuestions = (overview?.totalMcqs || 0) + (overview?.totalCqs || 0);
  const completionRate = totalTopics > 0 ? (totalTopics / 50) * 100 : 0; // Mock completion
  const totalChapters = overview?.totalChapters || 0;

  return (
    <TabsContent
      value="overview"
      className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Subject Information */}
          <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
            <CardHeader className="pb-6 bg-muted/30 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-soft">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">
                    Subject Information
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
                    {subject.displayName}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    Visibility Status
                  </p>
                  <Badge
                    variant={subject.isActive ? "default" : "secondary"}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2",
                      subject.isActive
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-transparent",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full mr-2",
                        subject.isActive
                          ? "bg-primary animate-pulse"
                          : "bg-muted-foreground",
                      )}
                    />
                    {subject.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    System Name (Slug)
                  </p>
                  <div className="flex items-center gap-2 group/code">
                    <code className="text-xs font-mono bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50 text-foreground/80 font-bold group-hover:bg-muted transition-colors">
                      {subject.name}
                    </code>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    Parent Academic Class
                  </p>
                  {subject.class ? (
                    <Link
                      href={`/classes/${subject.class.id}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-black tracking-tight text-base group"
                    >
                      {subject.class.displayName}
                      <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <span className="text-muted-foreground font-bold">—</span>
                  )}
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Content Summary Stats */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                  Content Distribution Summary
                </p>
                {isLoadingStats ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-2xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col p-5 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all hover:bg-muted/50">
                      <p className="text-3xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                        {activeChapters}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                        Active Chapters
                      </p>
                    </div>
                    <div className="flex flex-col p-5 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all hover:bg-muted/50">
                      <p className="text-3xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                        {totalTopics}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                        Total Topics
                      </p>
                    </div>
                    <div className="flex flex-col p-5 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all hover:bg-muted/50">
                      <p className="text-3xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                        {totalQuestions}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                        Questions Bank
                      </p>
                    </div>
                    <div className="flex flex-col p-5 rounded-2xl bg-primary/5 border border-primary/20 group hover:border-primary/30 transition-all hover:bg-primary/10">
                      <p className="text-3xl font-black text-primary tracking-tighter">
                        {Math.min(completionRate, 100)}%
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mt-1">
                        Completion
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Chapters Preview */}
          <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-6 bg-muted/30 border-b border-border/50 space-y-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-500/10 rounded-2xl text-yellow-600 shadow-soft">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">
                    Recent Chapters
                  </CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-70">
                    Latest additions to curriculum
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/50 font-bold uppercase tracking-widest text-[10px] h-9 px-4 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-soft active:scale-95"
                onClick={() => setActiveTab("chapters")}
              >
                View Catalog
                <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              {isLoadingChapters ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-2xl" />
                  ))}
                </div>
              ) : chapters.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                  <div className="size-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
                    <FileText className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-lg font-black text-foreground mb-1">
                    No Chapters Yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto font-medium">
                    Start building your curriculum by adding the first chapter
                    to this subject.
                  </p>
                  <Button
                    size="sm"
                    className="rounded-xl font-black tracking-tight shadow-glow hover:scale-105 transition-all"
                    asChild
                  >
                    <Link href={`/chapters/new?subjectId=${subjectId}`}>
                      <Plus className="h-4 w-4 mr-2 stroke-[3]" />
                      Create First Chapter
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {chapters.map((chapter, idx) => (
                    <Link
                      key={chapter.id}
                      href={`/chapters/${chapter.id}`}
                      className="flex items-center justify-between p-5 rounded-2xl border border-border/50 bg-background/30 hover:bg-background/80 hover:border-primary/30 hover:shadow-glow transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-muted/50 flex items-center justify-center text-foreground font-black text-sm border border-border/50 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all shadow-soft">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <p className="font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                            {chapter.displayName}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
                              <Layers className="size-3" />
                              {chapter._count.topics} topics
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
                              <HelpCircle className="size-3" />
                              {chapter._count.mcqs + chapter._count.cqs}{" "}
                              questions
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={chapter.isActive ? "default" : "secondary"}
                          className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                            chapter.isActive
                              ? "bg-green-500/10 text-green-600 border border-green-500/20"
                              : "bg-muted text-muted-foreground border-transparent",
                          )}
                        >
                          {chapter.isActive ? "Live" : "Draft"}
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
                <Link href={`/chapters/new?subjectId=${subjectId}`}>
                  <Plus className="h-4 w-4 mr-3 text-primary group-hover:scale-125 transition-transform" />
                  Add New Chapter
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold group shadow-soft"
                onClick={() =>
                  router.push(`/admin/mcqs?subjectId=${subjectId}`)
                }
              >
                <HelpCircle className="h-4 w-4 mr-3 text-orange-500 group-hover:scale-125 transition-transform" />
                Manage MCQ Bank
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold group shadow-soft"
                onClick={() => router.push(`/admin/cqs?subjectId=${subjectId}`)}
              >
                <Target className="h-4 w-4 mr-3 text-blue-500 group-hover:scale-125 transition-transform" />
                Manage CQ Bank
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold group shadow-soft"
                onClick={() =>
                  router.push(`/admin/academic-tree?subjectId=${subjectId}`)
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
                <Link href={`/subjects/edit/${subjectId}`}>
                  <Edit className="h-4 w-4 mr-3 text-indigo-500 group-hover:scale-125 transition-transform" />
                  Edit Subject Settings
                </Link>
              </Button>
              <div className="py-2">
                <Separator className="bg-border/50" />
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-all font-bold"
                onClick={() =>
                  handleDeleteSubject(subject.id, subject.displayName)
                }
              >
                <Trash2 className="h-4 w-4 mr-3" />
                Delete Subject
              </Button>
            </CardContent>
          </Card>

          {/* Statistics Card */}
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
                          Coverage
                        </span>
                      </div>
                      <span className="text-sm font-black text-foreground">
                        {Math.min(completionRate, 100)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(completionRate, 100)}
                      className="h-2 rounded-full bg-muted shadow-inner"
                    />
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/50">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Live Chapters
                      </span>
                      <span className="text-xs font-black bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20">
                        {activeChapters}/{totalChapters}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/50">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Question Pool
                      </span>
                      <span className="text-xs font-black bg-muted p-2.5 py-1 rounded-lg border border-border/50">
                        {totalQuestions} items
                      </span>
                    </div>
                  </div>
                </>
              )}
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
                    Enrollment Date
                  </p>
                  <p className="text-sm font-black text-foreground tracking-tight">
                    {new Date(subject.createdAt).toLocaleDateString("en-US", {
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
                    Last Modified
                  </p>
                  <p className="text-sm font-black text-foreground tracking-tight">
                    {new Date(subject.updatedAt).toLocaleDateString("en-US", {
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
                  Internal Identifier
                </p>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-xl border border-border/50 group/id transition-all hover:bg-muted">
                  <code className="text-[10px] font-mono flex-1 truncate font-bold opacity-80 pl-1">
                    {subject.id}
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
