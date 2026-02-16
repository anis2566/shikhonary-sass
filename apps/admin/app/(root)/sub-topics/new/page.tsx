import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";

import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { NewSubTopicView } from "@/modules/academic-sub-topic/ui/views/new-sub-topic-view";

export const metadata: Metadata = {
  title: "New Sub-Topic",
  description: "Create a new academic sub-topic",
};

const NewSubTopic = () => {
  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="New Sub-Topic"
          subtitle="Create a new academic sub-topic"
        />
        <NewSubTopicView />
      </div>
    </HydrateClient>
  );
};

export default NewSubTopic;
