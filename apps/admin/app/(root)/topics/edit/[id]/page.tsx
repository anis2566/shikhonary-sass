import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { EditTopicView } from "@/modules/academic-topic/ui/views/edit-topic-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Edit Topic",
  description: "Form to edit an existing Topic",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditTopic = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicTopic.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit Topic"
          subtitle="Customize academic topics"
        />
        <EditTopicView topicId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditTopic;
