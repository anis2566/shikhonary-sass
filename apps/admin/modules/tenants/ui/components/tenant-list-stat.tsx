"use client";

import { Building2, CheckCircle2, XCircle, Ban } from "lucide-react";

import { StatsCard } from "./stat-card";
import { useTenantStats } from "@workspace/api-client";

export const TenantListStat = () => {
  const { data: statsData } = useTenantStats();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Tenants"
        value={statsData?.total ?? 0}
        icon={Building2}
      />
      <StatsCard
        title="Active"
        value={statsData?.active ?? 0}
        icon={CheckCircle2}
        className="[&_.text-primary]:text-green-500 [&_.bg-primary\/10]:bg-green-500/10 [&_.border-primary\/20]:border-green-500/20"
      />
      <StatsCard
        title="Inactive"
        value={statsData?.inactive ?? 0}
        icon={XCircle}
        className="[&_.text-primary]:text-blue-500 [&_.bg-primary\/10]:bg-blue-500/10 [&_.border-primary\/20]:border-blue-500/20"
      />
      <StatsCard
        title="Suspended"
        value={statsData?.suspended ?? 0}
        icon={Ban}
        className="[&_.text-primary]:text-red-500 [&_.bg-primary\/10]:bg-red-500/10 [&_.border-primary\/20]:border-red-500/20"
      />
    </div>
  );
};
