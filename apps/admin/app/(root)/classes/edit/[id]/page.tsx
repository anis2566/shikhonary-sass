import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { EditClassView } from "@/modules/academic-class/ui/views/edit-class-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Edit Class",
  description: "Form to edit an existing Class",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditClass = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicClass.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit Class"
          subtitle="Customize academic classes"
        />
        <EditClassView classId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditClass;
