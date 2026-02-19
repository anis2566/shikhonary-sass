import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";

import { NewSubscriptionPlanView } from "@/modules/subscription-plan/ui/views/new-subscription-plan-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "New Subscription Plan",
  description: "New Subscription Plan",
};

const NewSubscriptionPlan = () => {
  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="New Subscription Plan"
          subtitle="Create a new subscription plan"
        />
        <NewSubscriptionPlanView />
      </div>
    </HydrateClient>
  );
};

export default NewSubscriptionPlan;
