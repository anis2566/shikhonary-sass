"use client";

import { useState } from "react";
import { ActivityIcon, BarChart3, BookText } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { OverviewTab } from "../components/overview-tab";

import { SubjectsTab } from "../components/subjects-tab";
import { StatisticsTab } from "../components/statistics-tab";
import { ClassDetailsStat } from "../components/class-details-stat";
import { useAcademicClassById } from "@workspace/api-client";

interface ClassViewProps {
  classId: string;
}

export const ClassView = ({ classId }: ClassViewProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: classData } = useAcademicClassById(classId);

  if (!classData) return null;

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-700">
      {/* Stats */}
      <ClassDetailsStat classId={classId} />

      {/* Tabs */}
      <Tabs
        className="space-y-6"
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <ActivityIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="subjects" className="gap-2">
            <BookText className="h-4 w-4" />
            <span className="hidden sm:inline">Subjects</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {classData.subjects.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <OverviewTab
          classId={classId}
          cls={classData}
          setActiveTab={setActiveTab}
        />
        <SubjectsTab
          subjects={classData.subjects}
          className={classData.name}
          classId={classId}
        />
        <StatisticsTab classId={classId} />
      </Tabs>
    </div>
  );
};
