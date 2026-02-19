"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  useSubscriptions,
  useSubscriptionStats,
  useSubscriptionFilters,
} from "@workspace/api-client";

import { SubscriptionListStat } from "../components/subscription-list-stat";
import { SubscriptionFilter } from "../components/subscription-filter";
import { SubscriptionList } from "../components/subscription-list";

const tierOrder = ["FREE", "STARTER", "PRO", "ENTERPRISE"];

export const SubscriptionsView = () => {
  const [filters, setFilters] = useSubscriptionFilters();

  const { data: subscriptionsData } = useSubscriptions();

  const { data: statsData } = useSubscriptionStats();

  const searchQuery = filters.search || "";
  const statusFilter = filters.status || "all";
  const tierFilter = filters.tier || "all";

  const setSearchQuery = (search: string) => setFilters({ search });
  const setStatusFilter = (status: string) => setFilters({ status });
  const setTierFilter = (tier: string) => setFilters({ tier });

  const filteredSubscriptions = subscriptionsData?.items || [];
  const stats = statsData || {
    total: 0,
    active: 0,
    trial: 0,
    pastDue: 0,
    mrr: 0,
  };

  // The original mockSubscriptions.length is replaced by stats.total for the count display
  // The useMemo for filteredSubscriptions and stats are removed as they are now fetched via hooks.

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-8 bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight lg:text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Subscriptions
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage tenant subscriptions and billing lifecycle from a central
            dashboard.
          </p>
        </div>
        <Button
          asChild
          className="rounded-xl shadow-glow hover:scale-105 transition-transform"
        >
          <Link href="/admin/subscriptions/create">
            <Plus className="w-5 h-5 mr-2" />
            New Subscription
          </Link>
        </Button>
      </div>

      {/* Stats Section */}
      <SubscriptionListStat stats={stats} />

      <div className="space-y-6">
        {/* Filter Section */}
        <SubscriptionFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          tierFilter={tierFilter}
          setTierFilter={setTierFilter}
          tierOrder={tierOrder}
        />

        {/* Result count */}
        <div className="flex items-center gap-2 px-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Showing {filteredSubscriptions.length} of {stats.total}{" "}
            subscriptions
          </span>
        </div>

        {/* Subscription List */}
        <SubscriptionList
          subscriptions={filteredSubscriptions}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          tierFilter={tierFilter}
        />
      </div>
    </div>
  );
};
