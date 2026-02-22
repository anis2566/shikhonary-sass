"use client";

import Link from "next/link";
import {
  Building2,
  CreditCard,
  Calendar,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Pause,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { type SubscriptionWithRelations } from "@workspace/api-client";

type SubscriptionStatus =
  | "trial"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

const statusConfig: Record<
  SubscriptionStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ElementType;
    color: string;
  }
> = {
  trial: {
    label: "Trial",
    variant: "secondary",
    icon: Clock,
    color: "text-blue-600",
  },
  active: {
    label: "Active",
    variant: "default",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  past_due: {
    label: "Past Due",
    variant: "destructive",
    icon: AlertCircle,
    color: "text-destructive",
  },
  canceled: {
    label: "Canceled",
    variant: "outline",
    icon: XCircle,
    color: "text-muted-foreground",
  },
  expired: {
    label: "Expired",
    variant: "outline",
    icon: Pause,
    color: "text-muted-foreground",
  },
};

const tierColors: Record<string, string> = {
  FREE: "bg-muted text-muted-foreground",
  STARTER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PRO: "bg-primary/10 text-primary",
  ENTERPRISE:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

interface SubscriptionCardProps {
  subscription: SubscriptionWithRelations;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const status = (subscription.status?.toLowerCase() ||
    "trial") as SubscriptionStatus;
  const statusInfo = statusConfig[status] || statusConfig.trial;
  const StatusIcon = statusInfo.icon;

  const formatCurrency = (amount: number, currency: string) =>
    `${currency} ${amount.toLocaleString()}`;

  return (
    <Link href={`/subscriptions/${subscription.id}`} className="block group">
      <Card className="bg-card/40 backdrop-blur-md border border-border/50 hover:border-primary/50 hover:shadow-glow transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: tenant + tier info */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-soft group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-foreground truncate text-lg">
                    {subscription.tenant.name}
                  </span>
                  <Badge
                    className={cn(
                      "font-semibold",
                      tierColors[subscription.plan.name] || "bg-muted",
                    )}
                  >
                    {subscription.plan.name}
                  </Badge>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      statusInfo.color,
                    )}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    <Badge
                      variant={statusInfo.variant}
                      className="text-[10px] h-5 px-1.5 uppercase tracking-wider"
                    >
                      {statusInfo.label}
                    </Badge>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground/80">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    {formatCurrency(subscription.plan.monthlyPriceBDT, "BDT")}
                    /mo
                    {subscription.billingCycle === "yearly" && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-1 uppercase">
                        Yearly
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Ends{" "}
                    {format(
                      new Date(subscription.currentPeriodEnd),
                      "MMM d, yyyy",
                    )}
                  </span>
                  {subscription.paymentProvider && (
                    <span className="capitalize text-[10px] font-bold bg-muted/50 px-2 py-0.5 rounded-full uppercase tracking-tight">
                      {subscription.paymentProvider}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: badges + arrow */}
            <div className="flex items-center gap-3 ml-auto">
              {subscription.cancelAtPeriodEnd && (
                <Badge
                  variant="outline"
                  className="text-amber-600 border-amber-300 text-[10px] uppercase font-bold tracking-wider"
                >
                  Cancels soon
                </Badge>
              )}
              {status === "past_due" && (
                <Badge
                  variant="destructive"
                  className="text-[10px] uppercase font-bold tracking-wider animate-pulse"
                >
                  Action Required
                </Badge>
              )}
              <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
