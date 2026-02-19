import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { StatsCard } from "./stats-card";

interface SubscriptionListStatProps {
  stats: {
    total: number;
    active: number;
    trial: number;
    pastDue: number;
    mrr: number;
  };
  currency?: string;
}

export const SubscriptionListStat = ({
  stats,
  currency = "BDT",
}: SubscriptionListStatProps) => {
  const formatCurrency = (amount: number, curr: string) =>
    `${curr} ${amount.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatsCard title="Total" value={stats.total} icon={CreditCard} />
      <StatsCard
        title="Active"
        value={stats.active}
        icon={CheckCircle2}
        className="[&_.text-primary]:text-green-600 [&_.bg-primary\/10]:bg-green-600/10"
      />
      <StatsCard
        title="Trial"
        value={stats.trial}
        icon={Clock}
        className="[&_.text-primary]:text-blue-600 [&_.bg-primary\/10]:bg-blue-600/10"
      />
      <StatsCard
        title="Past Due"
        value={stats.pastDue}
        icon={AlertCircle}
        className="[&_.text-primary]:text-destructive [&_.bg-primary\/10]:bg-destructive/10"
      />
      <StatsCard
        title="MRR"
        value={formatCurrency(stats.mrr, currency)}
        icon={TrendingUp}
        className="md:col-span-2 lg:col-span-1"
      />
    </div>
  );
};
