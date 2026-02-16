"use client";

import {
  BookOpen,
  BookText,
  FileText,
  HelpCircle,
  Layers,
  Target,
} from "lucide-react";

import { ClassDetailsStatCard } from "./class-details-stat-card";
import { useAcademicClassDetailedStats } from "@workspace/api-client";

interface ClassDetailsStatProps {
  classId: string;
}

export const ClassDetailsStat = ({ classId }: ClassDetailsStatProps) => {
  const { data: statsData } = useAcademicClassDetailedStats(classId);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <ClassDetailsStatCard
        icon={BookText}
        label="Subjects"
        value={statsData?.stats?.overview?.totalSubjects || 0}
        color="green"
      />
      <ClassDetailsStatCard
        icon={FileText}
        label="Chapters"
        value={statsData?.stats?.overview?.totalChapters || 0}
        color="yellow"
      />
      <ClassDetailsStatCard
        icon={Layers}
        label="Topics"
        value={statsData?.stats?.overview?.totalTopics || 0}
        color="purple"
      />
      <ClassDetailsStatCard
        icon={BookOpen}
        label="Sub-Topics"
        value={statsData?.stats?.overview?.totalSubTopics || 0}
        color="blue"
      />
      <ClassDetailsStatCard
        icon={HelpCircle}
        label="MCQs"
        value={statsData?.stats?.overview?.totalMcqs || 0}
        color="orange"
      />
      <ClassDetailsStatCard
        icon={Target}
        label="CQs"
        value={statsData?.stats?.overview?.totalCqs || 0}
        color="primary"
      />
    </div>
  );
};
