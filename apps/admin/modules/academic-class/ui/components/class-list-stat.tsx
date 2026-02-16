"use client";

import { GraduationCap, CheckCircle, XCircle, Layers } from "lucide-react";

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
        title="Total Subjects"
        value={statsData?.totalSubject ?? 0}
        icon={Layers}
      />
    </div>
  );
};
