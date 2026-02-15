"use client";

import {
  BookOpen,
  BookText,
  ChevronRight,
  FileText,
  HelpCircle,
  Layers,
  Target,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { TabsContent } from "@workspace/ui/components/tabs";

import { useAcademicClassStatistics } from "@/trpc/api/use-academic-class";

interface StatisticsTabProps {
  classId: string;
}

export const StatisticsTab = ({ classId }: StatisticsTabProps) => {
  const { data: statistics, isLoading } = useAcademicClassStatistics(classId);

  if (isLoading) {
    return (
      <TabsContent value="statistics" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-48 md:col-span-2" />
        </div>
      </TabsContent>
    );
  }

  if (!statistics) {
    return (
      <TabsContent value="statistics" className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load statistics</p>
        </div>
      </TabsContent>
    );
  }

  const { contentDistribution, hierarchy, questionBank } = statistics;

  return (
    <TabsContent value="statistics" className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Content Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Distribution</CardTitle>
            <CardDescription>
              Breakdown of content across subjects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentDistribution.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No subjects to display
              </p>
            ) : (
              contentDistribution.map((subject) => (
                <div key={subject.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-muted-foreground">
                      {subject.chapters} chapters
                    </span>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Question Bank Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question Bank Summary</CardTitle>
            <CardDescription>MCQs and CQs in this class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-orange-100/50 dark:bg-orange-900/20">
                <HelpCircle className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {questionBank.mcqs}
                </p>
                <p className="text-sm text-muted-foreground">MCQs</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-primary/10">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-primary">
                  {questionBank.cqs}
                </p>
                <p className="text-sm text-muted-foreground">CQs</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Questions
              </span>
              <span className="text-lg font-bold">{questionBank.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Hierarchy Depth */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Content Hierarchy</CardTitle>
            <CardDescription>
              Complete breakdown from subjects to questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
              <div className="text-center min-w-[100px]">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                  <BookText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-2xl font-bold">{hierarchy.subjects}</p>
                <p className="text-xs text-muted-foreground">Subjects</p>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />
              <div className="text-center min-w-[100px]">
                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-2">
                  <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-2xl font-bold">{hierarchy.chapters}</p>
                <p className="text-xs text-muted-foreground">Chapters</p>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />
              <div className="text-center min-w-[100px]">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                  <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-2xl font-bold">{hierarchy.topics}</p>
                <p className="text-xs text-muted-foreground">Topics</p>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />
              <div className="text-center min-w-[100px]">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-2xl font-bold">{hierarchy.subTopics}</p>
                <p className="text-xs text-muted-foreground">Sub-Topics</p>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />
              <div className="text-center min-w-[100px]">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-2">
                  <HelpCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-2xl font-bold">{hierarchy.questions}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
