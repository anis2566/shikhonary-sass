"use client";

import { BookOpen, Hash, HelpCircle, Layers, Target } from "lucide-react";

import { TopicDetailsStatCard } from "./topic-details-stat-card";
import { useAcademicTopicDetailedStats } from "@workspace/api-client";

interface TopicDetailsStatProps {
  topicId: string;
  position: number;
}

export const TopicDetailsStat = ({
  topicId,
  position,
}: TopicDetailsStatProps) => {
  const { data: statsData } = useAcademicTopicDetailedStats(topicId);
  const overview = statsData?.overview;

  const subTopics = overview?.totalSubTopics || 0;
  const mcqs = overview?.totalMcqs || 0;
  const cqs = overview?.totalCqs || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1">
      <TopicDetailsStatCard
        icon={Layers}
        label="Sub-Topics"
        value={subTopics}
        color="purple"
      />
      <TopicDetailsStatCard
        icon={HelpCircle}
        label="MCQ Assets"
        value={mcqs}
        color="orange"
      />
      <TopicDetailsStatCard
        icon={Target}
        label="CQ Assets"
        value={cqs}
        color="primary"
      />
      <TopicDetailsStatCard
        icon={BookOpen}
        label="Active Status"
        value={overview?.activeSubTopics || 0}
        color="blue"
      />
      <TopicDetailsStatCard
        icon={Hash}
        label="Order"
        value={`#${position || 0}`}
        color="green"
      />
    </div>
  );
};
