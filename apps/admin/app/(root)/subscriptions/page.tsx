import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { SubscriptionsView } from "@/modules/subscriptions/ui/views/subscriptions-view";
import { subscriptionLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "Subscriptions",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Subscriptions = async ({ searchParams }: Props) => {
  const params = await subscriptionLoader(searchParams);

  prefetch(trpc.subscription.list.queryOptions(params));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Subscriptions"
          subtitle="Manage subscriptions"
        />
        <SubscriptionsView />
      </div>
    </HydrateClient>
  );
};

export default Subscriptions;
