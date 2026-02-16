import { Metadata } from "next";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { EditSubTopicView } from "@/modules/academic-sub-topic/ui/views/edit-sub-topic-view";

export const metadata: Metadata = {
  title: "Edit Sub-Topic",
  description: "Edit academic sub-topic",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditSubTopic = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicSubTopic.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit Sub-Topic"
          subtitle="Customize academic sub-topic information"
        />
        <EditSubTopicView subTopicId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditSubTopic;
