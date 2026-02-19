import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { EditSubscriptionPlanView } from "@/modules/subscription-plan/ui/views/edit-subscription-plan-view";

export const metadata: Metadata = {
  title: "Edit Subscription Plan",
  description: "Form to edit an existing Subscription Plan",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditSubscriptionPlan = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.subscriptionPlan.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit Subscription"
          subtitle="Customize academic subscriptions"
        />
        <EditSubscriptionPlanView id={id} />
      </div>
    </HydrateClient>
  );
};

export default EditSubscriptionPlan;
