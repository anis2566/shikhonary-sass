import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { EditSubjectView } from "@/modules/academic-subject/ui/views/edit-subject-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Edit Subject",
  description: "Edit academic subject details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditSubjectPage = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicSubject.getById.queryOptions({ id }));
  prefetch(trpc.academicClass.forSelection.queryOptions());

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit Subject"
          subtitle="Edit academic subject details"
        />
        <EditSubjectView subjectId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditSubjectPage;
