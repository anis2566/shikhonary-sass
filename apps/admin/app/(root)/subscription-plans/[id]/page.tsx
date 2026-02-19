import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SubscriptionPlanDetailsView } from "@/modules/subscription-plan/ui/views/subscription-plan-details-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata = {
  title: "Subscription Plan Details",
  description: "View detailed configuration of the subscription plan",
};

const SubscriptionPlanDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  // Prefetching for better UX
  prefetch(trpc.subscriptionPlan.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Plan Overview"
          subtitle="Detailed configuration and service metrics"
        />
        <SubscriptionPlanDetailsView id={id} />
      </div>
    </HydrateClient>
  );
};

export default SubscriptionPlanDetailsPage;
