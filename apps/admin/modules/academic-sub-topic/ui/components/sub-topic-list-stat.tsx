"use client";

import { CheckCircle, XCircle, BookOpen, HelpCircle } from "lucide-react";

import { StatsCard } from "./stat-card";
import { useAcademicSubTopicStats } from "@workspace/api-client";

export const SubTopicListStat = () => {
  const { data } = useAcademicSubTopicStats();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Sub-Topics"
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
      <StatsCard title="MCQs" value={0} icon={HelpCircle} />
    </div>
  );
};
