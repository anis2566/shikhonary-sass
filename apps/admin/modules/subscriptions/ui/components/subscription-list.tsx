import Link from "next/link";
import { Plus, CreditCard } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { SubscriptionCard } from "./subscription-card";
import { type SubscriptionWithRelations } from "@workspace/api-client";

interface SubscriptionListProps {
  subscriptions: SubscriptionWithRelations[];
  searchQuery: string;
  statusFilter: string;
  tierFilter: string;
}

export const SubscriptionList = ({
  subscriptions,
  searchQuery,
  statusFilter,
  tierFilter,
}: SubscriptionListProps) => {
  if (subscriptions.length === 0) {
    return (
      <Card className="text-center py-20 bg-card/40 backdrop-blur-md border border-border/50">
        <CardContent>
          <div className="w-16 h-16 mx-auto bg-muted/50 rounded-2xl flex items-center justify-center mb-6">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No subscriptions found</h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all" || tierFilter !== "all"
              ? "Try adjusting your filters to find what you are looking for."
              : "You haven't created any subscriptions yet. Start by adding a new one."}
          </p>
          <Button asChild className="rounded-xl px-8 shadow-glow">
            <Link href="/admin/subscriptions/create">
              <Plus className="w-4 h-4 mr-2" />
              New Subscription
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
};
