"use client";

import { useState } from "react";
import { Activity, BarChart3, BookText } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs";

import { TopicDetailsStat } from "../components/topic-details-stat";
import { OverviewTab } from "../components/overview-tab";
import { SubTopicsTab } from "../components/sub-topics";
import { StatisticsTab } from "../components/statistics-tab";
import { useAcademicTopicById } from "@workspace/api-client";

interface TopicViewProps {
  topicId: string;
}

export function TopicView({ topicId }: TopicViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: topic } = useAcademicTopicById(topicId);

  if (!topic) {
    return (
      <div className="p-8 text-center bg-card/40 backdrop-blur-xl rounded-3xl border border-dashed border-border/50 shadow-soft max-w-lg mx-auto mt-20">
        <h2 className="text-xl font-bold text-foreground">Topic not found</h2>
        <p className="text-muted-foreground mt-2">
          The topic you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      {/* Stats */}
      <TopicDetailsStat topicId={topicId} position={topic.position || 0} />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="sub-topics" className="gap-2">
            <BookText className="h-4 w-4" />
            <span className="hidden sm:inline">Sub-Topics</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {topic.subtopics?.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
        </TabsList>

        <OverviewTab
          topicId={topicId}
          topic={topic}
          setActiveTab={setActiveTab}
        />

        <TabsContent value="sub-topics" className="mt-0">
          <SubTopicsTab
            subTopics={topic.subtopics || []}
            topicName={topic.displayName || topic.name}
            topicId={topicId}
          />
        </TabsContent>

        <StatisticsTab topicId={topicId} />
      </Tabs>
    </div>
  );
}
