"use client";

import {
  BookText,
  Calendar,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  ExternalLink,
  Hash,
  Layers,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

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
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Class Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">
                    Display Name
                  </p>
                  <p className="text-base font-semibold">{cls?.displayName}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant={cls?.isActive ? "default" : "secondary"}
                    className={cn(
                      cls?.isActive &&
                        "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                    )}
                  >
                    {cls?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">
                    System Name (Slug)
                  </p>
                  <code className="text-sm bg-muted px-2 py-1 rounded block w-fit">
                    {cls?.name}
                  </code>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">
                    Display Position
                  </p>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{cls?.position}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Content Summary */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Content Summary
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">
                      {activeSubjects}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Active Subjects
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">
                      {totalChapters}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Chapters
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">
                      {totalQuestions}
                    </p>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">
                      {Math.min(Math.round(completionRate), 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Subjects Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Recent Subjects</CardTitle>
                <CardDescription>
                  Latest subjects added to this class
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("subjects")}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentSubjects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <BookText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    No subjects yet
                  </p>
                  <Button size="sm" asChild>
                    <Link href={`/subjects/create?classId=${classId}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Subject
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentSubjects.map((subject) => (
                    <Link
                      key={subject.id}
                      href={`/subjects/${subject.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/20 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <BookText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {subject.displayName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subject._count?.chapters || 0} chapters
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={subject.isActive ? "default" : "secondary"}
                          className={cn(
                            "text-xs",
                            subject.isActive &&
                              "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                          )}
                        >
                          {subject.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/subjects/create?classId=${classId}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Subject
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/academic-tree?classId=${classId}`}>
                  <Layers className="h-4 w-4 mr-2" />
                  View Content Tree
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/classes/edit/${classId}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Class Details
                </Link>
              </Button>
              <Separator className="my-3" />
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10"
                onClick={() =>
                  cls && handleDeleteClass(cls.id, cls.displayName)
                }
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Class
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">
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
              <Separator />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium">
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
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Class ID</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1.5 rounded flex-1 break-all">
                    {cls?.id || "N/A"}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    onClick={handleCopyId}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Progress */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Content Progress</CardTitle>
              <CardDescription>
                Based on average 5 chapters per subject
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Chapters Coverage
                    </span>
                    <span className="font-medium">
                      {Math.min(Math.round(completionRate), 100)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(completionRate, 100)}
                    className="h-2"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {totalChapters} chapters across {totalSubjects} subjects
                </div>
              </>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};
