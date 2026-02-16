"use client";

import { BookOpen, CheckCircle, XCircle, Layers } from "lucide-react";

import { StatsCard } from "./stat-card";
import {
  useAcademicChapterStats,
  useAcademicChapterFilters,
} from "@workspace/api-client";

export const ChapterListStat = () => {
  const [filters] = useAcademicChapterFilters();
  const { data: statsData } = useAcademicChapterStats(
    filters.subjectId || undefined,
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Chapters"
        value={statsData?.total ?? 0}
        icon={BookOpen}
      />
      <StatsCard
        title="Active"
        value={statsData?.active ?? 0}
        icon={CheckCircle}
        className="[&_.text-primary]:text-green-500 [&_.bg-primary\/10]:bg-green-500/10"
      />
      <StatsCard
        title="Inactive"
        value={statsData?.inactive ?? 0}
        icon={XCircle}
        className="[&_.text-primary]:text-red-500 [&_.bg-primary\/10]:bg-red-500/10"
      />
      <StatsCard
        title="Total Topics"
        value={statsData?.totalTopics ?? 0}
        icon={Layers}
      />
    </div>
  );
};
