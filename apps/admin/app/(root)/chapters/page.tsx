import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { ChaptersView } from "@/modules/academic-chapter/ui/views/chapters-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { academicChapterLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Chapters",
  description: "Manage academic chapters",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Chapters = async ({ searchParams }: Props) => {
  const params = await academicChapterLoader(searchParams);

  // prefetch(trpc.academicChapter.getStats.queryOptions());
  prefetch(trpc.academicChapter.list.queryOptions(params));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader title="Chapters" subtitle="Manage academic chapters" />
        <ChaptersView />
      </div>
    </HydrateClient>
  );
};

export default Chapters;
