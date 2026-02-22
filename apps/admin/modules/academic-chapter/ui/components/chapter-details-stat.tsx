"use client";

import { BookOpen, HelpCircle, Layers, Target } from "lucide-react";

import { ChapterDetailsStatCard } from "./chapter-details-stat-card";

import { useAcademicChapterDetailedStats } from "@workspace/api-client";

interface ChapterDetailsStatProps {
  chapterId: string;
}

export const ChapterDetailsStat = ({ chapterId }: ChapterDetailsStatProps) => {
  const { data: statsData } = useAcademicChapterDetailedStats(chapterId);
  const stats = statsData?.stats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
      <ChapterDetailsStatCard
        icon={Layers}
        label="Syllabus Topics"
        value={stats?.overview?.totalTopics || 0}
        color="purple"
      />
      <ChapterDetailsStatCard
        icon={BookOpen}
        label="Lesson Units"
        value={stats?.overview?.totalSubTopics || 0}
        color="blue"
      />
      <ChapterDetailsStatCard
        icon={HelpCircle}
        label="MCQ Assets"
        value={stats?.overview?.totalMcqs || 0}
        color="orange"
      />
      <ChapterDetailsStatCard
        icon={Target}
        label="CQ Assets"
        value={stats?.overview?.totalCqs || 0}
        color="primary"
      />
    </div>
  );
};
