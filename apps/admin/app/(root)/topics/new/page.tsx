import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";

import { NewTopicView } from "@/modules/academic-topic/ui/views/new-topic-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "New Topic",
  description: "Create a new topic",
};

const NewTopic = () => {
  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader title="New Topic" subtitle="Create a new topic" />
        <NewTopicView />
      </div>
    </HydrateClient>
  );
};

export default NewTopic;
