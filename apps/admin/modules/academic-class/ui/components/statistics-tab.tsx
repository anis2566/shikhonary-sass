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
import { Skeleton } from "@workspace/ui/components/skeleton";
import { TabsContent } from "@workspace/ui/components/tabs";

import { useAcademicClassStatistics } from "@workspace/api-client";
import { cn } from "@workspace/ui/lib/utils";

interface StatisticsTabProps {
  classId: string;
}

export const StatisticsTab = ({ classId }: StatisticsTabProps) => {
  const { data: statistics, isLoading } = useAcademicClassStatistics(classId);

  if (isLoading) {
    return (
      <TabsContent
        value="statistics"
        className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-48 md:col-span-2 rounded-3xl" />
        </div>
      </TabsContent>
    );
  }

  if (!statistics) {
    return (
      <TabsContent value="statistics" className="mt-0 space-y-6">
        <div className="text-center py-20 bg-card/50 backdrop-blur-md rounded-3xl border border-border/50 shadow-soft">
          <BookOpen className="size-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-black text-foreground">
            Failed to load class statistics
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            Please refresh or check back later.
          </p>
        </div>
      </TabsContent>
    );
  }

  const { contentDistribution, hierarchy, questionBank } = statistics;

  return (
    <TabsContent
      value="statistics"
      className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="grid gap-8 md:grid-cols-2">
        {/* Content Distribution */}
        <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
          <CardHeader className="pb-6 bg-muted/30 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-soft">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black tracking-tight">
                  Content Distribution
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Weightage of subjects in this class
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {contentDistribution.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8 font-medium">
                No subjects data available
              </p>
            ) : (
              contentDistribution.map((subject) => (
                <div key={subject.id} className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {subject.name}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-muted/50 px-2 py-0.5 rounded-lg border border-border/50">
                      {subject.chapters} chapters ({subject.percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={subject.percentage}
                    className="h-2.5 rounded-full bg-muted shadow-inner group-hover:bg-muted font-bold overflow-hidden"
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Question Bank Summary */}
        <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
          <CardHeader className="pb-6 bg-muted/30 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 rounded-2xl text-orange-600 shadow-soft">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black tracking-tight">
                  Question Bank
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Detailed distribution of items in this class
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="relative overflow-hidden flex flex-col p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10 group hover:bg-orange-500/10 transition-all duration-300">
                <HelpCircle className="absolute -right-2 -top-2 h-12 w-12 text-orange-600/10 group-hover:scale-125 transition-transform" />
                <p className="text-4xl font-black text-orange-600 tracking-tighter">
                  {questionBank.mcqs}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-600/70 mt-1">
                  MCQ Pool
                </p>
              </div>
              <div className="relative overflow-hidden flex flex-col p-6 rounded-2xl bg-primary/5 border border-primary/10 group hover:bg-primary/10 transition-all duration-300">
                <Target className="absolute -right-2 -top-2 h-12 w-12 text-primary/10 group-hover:scale-125 transition-transform" />
                <p className="text-4xl font-black text-primary tracking-tighter">
                  {questionBank.cqs}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mt-1">
                  CQ Assets
                </p>
              </div>
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-xl border border-border/50 shadow-soft">
                  <Target className="size-4 text-muted-foreground" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/80">
                  Total Question Bank
                </span>
              </div>
              <span className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter">
                {questionBank.total}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Hierarchy Depth */}
        <Card className="md:col-span-2 bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
          <CardHeader className="pb-6 bg-muted/30 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 rounded-2xl text-purple-600 shadow-soft">
                <BookText className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black tracking-tight">
                  Academic Hierarchy
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Vertical breakdown of content depth
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 overflow-x-auto py-2">
              {[
                {
                  label: "Subjects",
                  value: hierarchy.subjects,
                  icon: BookText,
                  color: "green",
                },
                {
                  label: "Chapters",
                  value: hierarchy.chapters,
                  icon: FileText,
                  color: "yellow",
                },
                {
                  label: "Topics",
                  value: hierarchy.topics,
                  icon: Layers,
                  color: "purple",
                },
                {
                  label: "Sub-Topics",
                  value: hierarchy.subTopics,
                  icon: BookOpen,
                  color: "blue",
                },
                {
                  label: "Questions",
                  value: hierarchy.questions,
                  icon: HelpCircle,
                  color: "primary",
                },
              ].map((item, i, arr) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="text-center min-w-[120px] p-4 rounded-2xl bg-background/50 border border-border/50 shadow-soft hover:shadow-glow transition-all group">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border transition-transform group-hover:scale-110",
                        item.color === "green" &&
                          "bg-green-500/10 border-green-500/20 text-green-600",
                        item.color === "yellow" &&
                          "bg-yellow-500/10 border-yellow-500/20 text-yellow-600",
                        item.color === "purple" &&
                          "bg-purple-500/10 border-purple-500/20 text-purple-600",
                        item.color === "blue" &&
                          "bg-blue-500/10 border-blue-500/20 text-blue-600",
                        item.color === "primary" &&
                          "bg-primary/10 border-primary/20 text-primary",
                      )}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>
                    <p className="text-3xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                      {item.value}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">
                      {item.label}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <ChevronRight className="h-5 w-5 text-muted-foreground/30 shrink-0 hidden xl:block" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
