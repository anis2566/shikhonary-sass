import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";

import { NewChapterView } from "@/modules/academic-chapter/ui/views/new-chapter-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "New Chapter",
  description: "Create a new chapter",
};

const NewChapter = () => {
  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader title="New Chapter" subtitle="Create a new chapter" />
        <NewChapterView />
      </div>
    </HydrateClient>
  );
};

export default NewChapter;
