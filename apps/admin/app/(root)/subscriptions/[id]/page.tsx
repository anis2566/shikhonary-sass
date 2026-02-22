import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { SubscriptionDetailsView } from "@/modules/subscriptions/ui/views/subscription-details-view";

export const metadata = {
  title: "Subscription Details",
  description: "View detailed information about this tenant subscription",
};

const SubscriptionDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  prefetch(trpc.subscription.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Subscription Overview"
          subtitle="Detailed billing, period, and history information"
        />
        <SubscriptionDetailsView id={id} />
      </div>
    </HydrateClient>
  );
};

export default SubscriptionDetailsPage;
