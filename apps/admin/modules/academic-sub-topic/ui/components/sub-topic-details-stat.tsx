"use client";

import { BookOpen, Hash, HelpCircle, Target } from "lucide-react";

import { SubTopicDetailsStatCard } from "./sub-topic-details-stat-card";
import { useAcademicSubTopicDetailedStats } from "@workspace/api-client";

interface SubTopicDetailsStatProps {
  subTopicId: string;
  position: number;
}

export const SubTopicDetailsStat = ({
  subTopicId,
  position,
}: SubTopicDetailsStatProps) => {
  const { data: statsData } = useAcademicSubTopicDetailedStats(subTopicId);
  const overview = statsData?.overview;

  const mcqs = overview?.totalMcqs || 0;
  const cqs = overview?.totalCqs || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 p-1">
      <SubTopicDetailsStatCard
        icon={HelpCircle}
        label="MCQ Assets"
        value={mcqs}
        color="orange"
      />
      <SubTopicDetailsStatCard
        icon={Target}
        label="CQ Assets"
        value={cqs}
        color="primary"
      />
      <SubTopicDetailsStatCard
        icon={BookOpen}
        label="Total Questions"
        value={overview?.totalQuestions || 0}
        color="blue"
      />
      <SubTopicDetailsStatCard
        icon={Hash}
        label="Order"
        value={`#${position || 0}`}
        color="green"
      />
    </div>
  );
};
