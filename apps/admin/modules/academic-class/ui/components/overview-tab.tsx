"use client";

import {
  BookText,
  Calendar,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  Hash,
  Layers,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
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
import { TabsContent } from "@workspace/ui/components/tabs";

import { cn } from "@workspace/ui/lib/utils";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { useDeleteAcademicClass } from "@workspace/api-client";

interface OverviewTabProps {
  classId: string;
  cls?: {
    id: string;
    name: string;
    displayName: string;
    level: string;
    position: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    subjects?: Array<{
      id: string;
      name: string;
      displayName: string;
      isActive: boolean;
      _count: {
        chapters: number;
        mcqs: number;
        cqs: number;
      };
    }>;
  };
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export const OverviewTab = ({
  classId,
  cls,
  setActiveTab,
}: OverviewTabProps) => {
  const { mutate: deleteAcademicClass } = useDeleteAcademicClass();
  const { openDeleteModal } = useDeleteModal();

  // Get subjects from props
  const subjects = cls?.subjects || [];
  const recentSubjects = subjects.slice(0, 3); // Show only first 3

  const handleCopyId = () => {
    if (cls?.id) {
      navigator.clipboard.writeText(cls.id);
      toast.success("ID copied to clipboard");
    }
  };

  const handleDeleteClass = (classId: string, className: string) => {
    openDeleteModal({
      entityId: classId,
      entityType: "class",
      entityName: className,
      onConfirm: (id) => {
        deleteAcademicClass({ id });
      },
    });
  };

  // Calculate stats from subjects data
  const activeSubjects = subjects.filter((s) => s.isActive).length;
  const totalSubjects = subjects.length;
  const totalChapters = subjects.reduce(
    (sum, s) => sum + (s._count?.chapters || 0),
    0,
  );
  const totalQuestions = subjects.reduce(
    (sum, s) => sum + (s._count?.mcqs || 0) + (s._count?.cqs || 0),
    0,
  );
  // Estimate completion rate based on average 5 chapters per subject
  const expectedChapters = totalSubjects * 5;
  const completionRate =
    expectedChapters > 0 ? (totalChapters / expectedChapters) * 100 : 0;

  return (
    <TabsContent
      value="overview"
      className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Information */}
          <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl shadow-medium overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                Class Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                    Display Name
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {cls?.displayName}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                    Status
                  </p>
                  <Badge
                    variant={cls?.isActive ? "default" : "secondary"}
                    className={cn(
                      "text-[11px] font-bold px-2 py-0.5 rounded-full transition-all",
                      cls?.isActive
                        ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                        : "bg-muted text-muted-foreground border-transparent",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full mr-1.5 animate-pulse",
                        cls?.isActive ? "bg-primary" : "bg-muted-foreground",
                      )}
                    />
                    {cls?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                    System Name (Slug)
                  </p>
                  <code className="text-xs font-bold bg-muted/50 border border-border/50 px-2.5 py-1 rounded-lg block w-fit text-muted-foreground">
                    {cls?.name}
                  </code>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                    Display Position
                  </p>
                  <div className="flex items-center gap-2 bg-muted/30 w-fit px-3 py-1 rounded-lg border border-border/50 shadow-soft">
                    <Hash className="h-3.5 w-3.5 text-primary" />
                    <span className="font-bold text-foreground text-sm">
                      {cls?.position}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="opacity-50" />

              {/* Content Summary */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                  Content Summary
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Active Subjects", value: activeSubjects },
                    { label: "Total Chapters", value: totalChapters },
                    { label: "Questions", value: totalQuestions },
                    {
                      label: "Completion",
                      value: `${Math.min(Math.round(completionRate), 100)}%`,
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="text-center p-4 rounded-2xl bg-primary/[0.02] border border-primary/5 shadow-soft transition-all hover:bg-primary/[0.05] hover:shadow-glow hover:scale-[1.02] duration-300"
                    >
                      <p className="text-2xl font-black text-foreground tracking-tight">
                        {stat.value}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-muted-foreground/70 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Subjects Preview */}
          <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl shadow-medium overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50 bg-muted/20">
              <div>
                <CardTitle className="text-lg font-black tracking-tight tracking-tight">
                  Recent Subjects
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  Latest subjects added to this class
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("subjects")}
                className="rounded-xl border-border/50 hover:bg-primary/10 hover:text-primary transition-all font-bold text-xs"
              >
                View All
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {recentSubjects.length === 0 ? (
                <div className="text-center py-12 bg-muted/10 rounded-2xl border border-dashed border-border/50">
                  <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary shadow-soft">
                    <BookText className="size-7" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    No subjects yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Start by adding your first subject
                  </p>
                  <Button
                    size="sm"
                    asChild
                    className="rounded-xl font-bold shadow-glow"
                  >
                    <Link href={`/subjects/create?classId=${classId}`}>
                      <Plus className="h-4 w-4 mr-2 stroke-[3]" />
                      Add First Subject
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {recentSubjects.map((subject) => (
                    <Link
                      key={subject.id}
                      href={`/subjects/${subject.id}`}
                      className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background/50 hover:bg-primary/[0.02] hover:border-primary/20 transition-all duration-300 group shadow-soft hover:shadow-glow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center text-primary transition-all shadow-soft group-hover:scale-110">
                          <BookText className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                            {subject.displayName}
                          </p>
                          <p className="text-xs font-medium text-muted-foreground/70">
                            {subject._count?.chapters || 0} Chapters •{" "}
                            {(subject._count?.mcqs || 0) +
                              (subject._count?.cqs || 0)}{" "}
                            Questions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={subject.isActive ? "default" : "secondary"}
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                            subject.isActive
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted text-muted-foreground border-transparent",
                          )}
                        >
                          {subject.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div className="size-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-all">
                          <ChevronRight className="size-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Metadata & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl shadow-medium overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg font-black tracking-tight">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 text-sm font-bold hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all group"
                asChild
              >
                <Link href={`/subjects/create?classId=${classId}`}>
                  <Plus className="h-4 w-4 mr-2 group-hover:scale-125 transition-transform" />
                  Add New Subject
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 text-sm font-bold hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all group"
                asChild
              >
                <Link href={`/academic-tree?classId=${classId}`}>
                  <Layers className="h-4 w-4 mr-2 group-hover:scale-125 transition-transform" />
                  View Content Tree
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-11 rounded-xl border-border/50 text-sm font-bold hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all group"
                asChild
              >
                <Link href={`/classes/edit/${classId}`}>
                  <Edit className="h-4 w-4 mr-2 group-hover:scale-125 transition-transform" />
                  Edit Class Details
                </Link>
              </Button>
              <div className="py-2">
                <Separator className="opacity-50" />
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-all font-bold group"
                onClick={() =>
                  cls && handleDeleteClass(cls.id, cls.displayName)
                }
              >
                <Trash2 className="h-4 w-4 mr-2 group-hover:scale-125 transition-transform" />
                Delete Class
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl shadow-medium overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg font-black tracking-tight">
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground shadow-soft">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Created
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {cls?.createdAt
                      ? new Date(cls.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
              <Separator className="opacity-50" />
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground shadow-soft">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Last Updated
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {cls?.updatedAt
                      ? new Date(cls.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
              <Separator className="opacity-50" />
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Class ID
                </p>
                <div className="flex items-center gap-2 group">
                  <code className="text-[11px] font-bold bg-muted/50 border border-border/50 px-3 py-2 rounded-xl flex-1 break-all text-muted-foreground group-hover:border-primary/20 transition-colors">
                    {cls?.id || "N/A"}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                    onClick={handleCopyId}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Progress */}
          <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl shadow-medium overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg font-black tracking-tight tracking-tight">
                Content Progress
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Based on average 5 chapters per subject
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                      Chapter Coverage
                    </span>
                    <span className="text-lg font-black text-primary tracking-tight">
                      {Math.min(Math.round(completionRate), 100)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(completionRate, 100)}
                    className="h-2.5 bg-primary/10"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-xl border border-primary/10">
                  <BookText className="size-3.5 text-primary" />
                  <p className="text-[10px] font-bold text-primary/80 uppercase tracking-wider">
                    {totalChapters} chapters across {totalSubjects} subjects
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};
