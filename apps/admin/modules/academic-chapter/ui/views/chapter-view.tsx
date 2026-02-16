"use client";

import { useState } from "react";
import { ActivityIcon, BarChart3, BookText } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

import { ChapterDetailsStat } from "../components/chapter-details-stat";
import { OverviewTab } from "../components/overview-tab";
import { TopicsTab } from "../components/topics-tab";
import { StatisticsTab } from "../components/statistics-tab";

import { useAcademicChapterById } from "@workspace/api-client";

interface ChapterViewProps {
  chapterId: string;
}

export const ChapterView = ({ chapterId }: ChapterViewProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: chapter } = useAcademicChapterById(chapterId);

  if (!chapter) {
    return (
      <div className="p-8 text-center border border-dashed rounded-3xl">
        <h2 className="text-xl font-bold">Chapter not found</h2>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-700">
      {/* Stats */}
      <ChapterDetailsStat chapterId={chapterId} />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <ActivityIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="topics" className="gap-2">
            <BookText className="h-4 w-4" />
            <span className="hidden sm:inline">Topics</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {chapter?.topics?.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <OverviewTab
          chapterId={chapterId}
          chapter={chapter}
          setActiveTab={setActiveTab}
        />
        <TopicsTab
          topics={chapter?.topics || []}
          chapterName={chapter?.displayName || ""}
          chapterId={chapterId}
        />
        <StatisticsTab chapterId={chapterId} />
      </Tabs>
    </div>
  );
};
