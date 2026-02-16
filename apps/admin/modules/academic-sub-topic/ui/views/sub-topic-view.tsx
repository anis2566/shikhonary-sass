"use client";

import { useState } from "react";
import { ActivityIcon, BarChart3 } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

import { SubTopicDetailsStat } from "../components/sub-topic-details-stat";
import { OverviewTab } from "../components/overview-tab";
import { StatisticsTab } from "../components/statistics-tab";

import { useAcademicSubTopicById } from "@workspace/api-client";

interface SubTopicViewProps {
  subTopicId: string;
}

export const SubTopicView = ({ subTopicId }: SubTopicViewProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: subTopic } = useAcademicSubTopicById(subTopicId);

  if (!subTopic) {
    return (
      <div className="p-8 text-center bg-card/40 backdrop-blur-xl rounded-3xl border border-dashed border-border/50 shadow-soft max-w-lg mx-auto mt-20">
        <h2 className="text-xl font-bold text-foreground">
          Sub-Topic not found
        </h2>
        <p className="text-muted-foreground mt-2">
          The sub-topic you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      {/* Stats */}
      <SubTopicDetailsStat
        subTopicId={subTopicId}
        position={subTopic.position || 0}
      />

      {/* Tabs */}
      <Tabs
        className="space-y-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <ActivityIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <OverviewTab
          subTopicId={subTopicId}
          subTopic={subTopic as any}
          setActiveTab={setActiveTab}
        />
        <StatisticsTab subTopicId={subTopicId} />
      </Tabs>
    </div>
  );
};
