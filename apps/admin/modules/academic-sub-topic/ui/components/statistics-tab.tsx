"use client";

import { HelpCircle, Hash, Target, BookOpen } from "lucide-react";

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

import { useAcademicSubTopicStatistics } from "@workspace/api-client";

interface StatisticsTabProps {
  subTopicId: string;
}

export const StatisticsTab = ({ subTopicId }: StatisticsTabProps) => {
  const { data, isLoading } = useAcademicSubTopicStatistics(subTopicId);

  if (isLoading) {
    return (
      <TabsContent value="statistics" className="mt-0 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </TabsContent>
    );
  }

  if (!data) {
    return (
      <TabsContent value="statistics" className="mt-0 space-y-6">
        <div className="text-center py-20 bg-card/50 backdrop-blur-md rounded-3xl border border-border/50 shadow-soft">
          <BookOpen className="size-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-black text-foreground">
            Failed to load sub-topic statistics
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            Please refresh or check back later.
          </p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent
      value="statistics"
      className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="grid gap-8 md:grid-cols-2">
        {/* MCQ Type Distribution */}
        <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
          <CardHeader className="pb-6 bg-muted/30 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-soft">
                <Hash className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black tracking-tight">
                  MCQ Distribution
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Breakdown by question type
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {data.mcqDistribution.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8 font-medium">
                No MCQ distribution data available
              </p>
            ) : (
              data.mcqDistribution.map((item) => (
                <div key={item.type} className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {item.type}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-muted/50 px-2 py-0.5 rounded-lg border border-border/50">
                      {item.count} q ({item.percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={item.percentage}
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
                  Resource Bank
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Detailed distribution of items
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="relative overflow-hidden flex flex-col p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10 group hover:bg-orange-500/10 transition-all duration-300">
                <HelpCircle className="absolute -right-2 -top-2 h-12 w-12 text-orange-600/10 group-hover:scale-125 transition-transform" />
                <p className="text-4xl font-black text-orange-600 tracking-tighter">
                  {data.questionBank.mcqs}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-600/70 mt-1">
                  MCQ Assets
                </p>
              </div>
              <div className="relative overflow-hidden flex flex-col p-6 rounded-2xl bg-primary/5 border border-primary/10 group hover:bg-primary/10 transition-all duration-300">
                <Target className="absolute -right-2 -top-2 h-12 w-12 text-primary/10 group-hover:scale-125 transition-transform" />
                <p className="text-4xl font-black text-primary tracking-tighter">
                  {data.questionBank.cqs}
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
                  Total Assessment Pool
                </span>
              </div>
              <span className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter">
                {data.questionBank.total}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
