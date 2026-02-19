import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { SubscriptionPlansView } from "@/modules/subscription-plan/ui/views/subscription-plans-view";
import { subscriptionPlanLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Subscription Plans",
  description: "Subscription Plans",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const SubscriptionPlans = async ({ searchParams }: Props) => {
  const params = await subscriptionPlanLoader(searchParams);

  prefetch(trpc.subscriptionPlan.list.queryOptions(params));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Subscription Plans"
          subtitle="Manage subscription plans"
        />
        <SubscriptionPlansView />
      </div>
    </HydrateClient>
  );
};

export default SubscriptionPlans;
