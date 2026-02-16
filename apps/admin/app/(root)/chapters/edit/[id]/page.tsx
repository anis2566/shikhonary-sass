import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { EditChapterView } from "@/modules/academic-chapter/ui/views/edit-chapter-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Edit Chapter",
  description: "Form to edit an existing Chapter",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditChapter = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicChapter.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit Chapter"
          subtitle="Customize academic chapters"
        />
        <EditChapterView chapterId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditChapter;
