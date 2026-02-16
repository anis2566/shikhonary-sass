"use client";

import {
  BookOpen,
  FileText,
  Hash,
  HelpCircle,
  Layers,
  Target,
} from "lucide-react";

import { SubjectDetailsStatCard } from "./subject-details-stat-card";
import { useAcademicSubjectDetailedStats } from "@workspace/api-client";

interface SubjectDetailsStatProps {
  subjectId: string;
  subjectPosition: number;
}

export const SubjectDetailsStat = ({
  subjectId,
  subjectPosition,
}: SubjectDetailsStatProps) => {
  const { data: statsData } = useAcademicSubjectDetailedStats(subjectId);
  const stats = statsData?.stats;

  const chapters = stats?.overview?.totalChapters || 0;
  const topics = stats?.overview?.totalTopics || 0;
  const subTopics = stats?.overview?.totalSubTopics || 0;
  const mcqs = stats?.overview?.totalMcqs || 0;
  const cqs = stats?.overview?.totalCqs || 0;
  const position = subjectPosition || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-1">
      <SubjectDetailsStatCard
        icon={FileText}
        label="Catalog Chapters"
        value={chapters}
        color="yellow"
      />
      <SubjectDetailsStatCard
        icon={Layers}
        label="Course Topics"
        value={topics}
        color="purple"
      />
      <SubjectDetailsStatCard
        icon={BookOpen}
        label="Sub-Modules"
        value={subTopics}
        color="blue"
      />
      <SubjectDetailsStatCard
        icon={HelpCircle}
        label="MCQ Assets"
        value={mcqs}
        color="orange"
      />
      <SubjectDetailsStatCard
        icon={Target}
        label="CQ Assets"
        value={cqs}
        color="primary"
      />
      <SubjectDetailsStatCard
        icon={Hash}
        label="Sort Position"
        value={`#${position}`}
        color="green"
      />
    </div>
  );
};
