"use client";

import { CheckCircle, XCircle, BookOpen, Layers } from "lucide-react";

import { StatsCard } from "./stat-card";
import { useAcademicTopicStats } from "@workspace/api-client";

export const TopicListStat = () => {
  const { data } = useAcademicTopicStats();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Topics"
        value={data?.total || 0}
        icon={BookOpen}
      />
      <StatsCard
        title="Active"
        value={data?.active || 0}
        icon={CheckCircle}
        className="[&_.text-primary]:text-green-500 [&_.bg-primary\/10]:bg-green-500/10"
      />
      <StatsCard
        title="Inactive"
        value={data?.inactive || 0}
        icon={XCircle}
        className="[&_.text-primary]:text-red-500 [&_.bg-primary\/10]:bg-red-500/10"
      />
      <StatsCard
        title="Sub-Topics"
        value={0} // This could be fetched separately if needed
        icon={Layers}
      />
    </div>
  );
};
