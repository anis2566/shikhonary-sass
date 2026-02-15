"use client";

import { GraduationCap } from "lucide-react";

import { StatsCard } from "./stat-card";
import { useAcademicClassStats } from "@workspace/api-client";

export const ClassListStat = () => {
  const { data: statsData } = useAcademicClassStats();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Classes"
        value={statsData?.total ?? 0}
        icon={GraduationCap}
      />
      <StatsCard
        title="Active"
        value={statsData?.active ?? 0}
        icon={GraduationCap}
      />
      <StatsCard
        title="Inactive"
        value={statsData?.inactive ?? 0}
        icon={GraduationCap}
      />
      <StatsCard
        title="Total Subjects"
        value={statsData?.totalSubject ?? 0}
        icon={GraduationCap}
      />
    </div>
  );
};
