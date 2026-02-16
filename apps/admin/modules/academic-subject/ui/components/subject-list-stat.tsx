"use client";

import { BookOpen, CheckCircle, XCircle, Layers } from "lucide-react";

import { StatsCard } from "./stat-card";
import { useAcademicSubjectStats } from "@workspace/api-client";

export const SubjectListStat = () => {
  const { data } = useAcademicSubjectStats();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Subjects"
        value={data?.totalSubject || 0}
        icon={BookOpen}
      />
      <StatsCard
        title="Active"
        value={data?.activeSubject || 0}
        icon={CheckCircle}
        className="[&_.text-primary]:text-green-500 [&_.bg-primary\/10]:bg-green-500/10"
      />
      <StatsCard
        title="Inactive"
        value={data?.inactiveSubject || 0}
        icon={XCircle}
        className="[&_.text-primary]:text-red-500 [&_.bg-primary\/10]:bg-red-500/10"
      />
      <StatsCard
        title="Total Chapters"
        value={data?.totalChapters || 0}
        icon={Layers}
      />
    </div>
  );
};
