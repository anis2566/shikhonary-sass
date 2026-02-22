import { Metadata } from "next";
import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { EditMcqView } from "@/modules/mcq/ui/views/edit-mcq-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Edit MCQ",
  description: "Update an existing multiple choice question",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditMcqPage = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.mcq.getById.queryOptions({ id }));
  prefetch(trpc.academicSubject.forSelection.queryOptions({}));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit MCQ"
          subtitle="Update an existing question"
        />
        <Suspense>
          <EditMcqView id={id} />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default EditMcqPage;
