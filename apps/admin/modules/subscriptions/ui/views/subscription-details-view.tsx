"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Pause,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Ban,
  DollarSign,
  Receipt,
  Edit,
  History,
  TrendingUp,
  User,
  ExternalLink,
  AlertTriangle,
  MoreVertical,
  Copy,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Progress } from "@workspace/ui/components/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import { useSubscriptionById } from "@workspace/api-client";

// History entries are included at runtime by getById but not typed on SubscriptionWithRelations
interface SubscriptionHistoryEntry {
  id: string;
  event: string;
  fromPlanId: string | null;
  toPlanId: string | null;
  fromStatus: string | null;
  toStatus: string | null;
  reason: string | null;
  createdBy: string | null;
  createdAt: Date | string;
}

// ── Types ──────────────────────────────────────────────────────────────────

type SubscriptionStatus =
  | "trial"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

type EventType =
  | "created"
  | "upgraded"
  | "downgraded"
  | "renewed"
  | "canceled"
  | "expired"
  | "payment_failed"
  | "payment_succeeded";

// ── Config ─────────────────────────────────────────────────────────────────

const statusConfig: Record<
  SubscriptionStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ElementType;
    color: string;
    bg: string;
  }
> = {
  trial: {
    label: "Trial",
    variant: "secondary",
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  active: {
    label: "Active",
    variant: "default",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  past_due: {
    label: "Past Due",
    variant: "destructive",
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  canceled: {
    label: "Canceled",
    variant: "outline",
    icon: XCircle,
    color: "text-muted-foreground",
    bg: "bg-muted/50",
  },
  expired: {
    label: "Expired",
    variant: "outline",
    icon: Pause,
    color: "text-muted-foreground",
    bg: "bg-muted/50",
  },
};

const tierColors: Record<string, string> = {
  FREE: "bg-muted text-muted-foreground",
  STARTER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PRO: "bg-primary/10 text-primary",
  ENTERPRISE:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const tierGradient: Record<string, string> = {
  FREE: "from-muted to-muted/50",
  STARTER: "from-blue-500/10 to-blue-500/5",
  PRO: "from-primary/15 to-primary/5",
  ENTERPRISE: "from-amber-500/15 to-amber-500/5",
};

const eventConfig: Record<
  EventType,
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  created: {
    label: "Subscription Created",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  upgraded: {
    label: "Plan Upgraded",
    icon: ArrowUpCircle,
    color: "text-blue-600",
  },
  downgraded: {
    label: "Plan Downgraded",
    icon: ArrowDownCircle,
    color: "text-amber-600",
  },
  renewed: {
    label: "Subscription Renewed",
    icon: RefreshCw,
    color: "text-green-600",
  },
  canceled: {
    label: "Subscription Canceled",
    icon: Ban,
    color: "text-destructive",
  },
  expired: {
    label: "Subscription Expired",
    icon: Clock,
    color: "text-muted-foreground",
  },
  payment_failed: {
    label: "Payment Failed",
    icon: XCircle,
    color: "text-destructive",
  },
  payment_succeeded: {
    label: "Payment Succeeded",
    icon: DollarSign,
    color: "text-green-600",
  },
};

// ── Helper ─────────────────────────────────────────────────────────────────

function resolveEventType(event: string): EventType {
  const map: Record<string, EventType> = {
    CREATED: "created",
    UPGRADED: "upgraded",
    DOWNGRADED: "downgraded",
    RENEWED: "renewed",
    CANCELED: "canceled",
    EXPIRED: "expired",
    PAYMENT_FAILED: "payment_failed",
    PAYMENT_SUCCEEDED: "payment_succeeded",
  };
  return map[event.toUpperCase()] ?? "created";
}

// ── Sub-components ─────────────────────────────────────────────────────────

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

function SubscriptionDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Skeleton className="h-6 w-48 rounded-lg" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[500px] rounded-2xl" />
    </div>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────

interface SubscriptionDetailsViewProps {
  id: string;
}

// ── Main View ──────────────────────────────────────────────────────────────

export const SubscriptionDetailsView: React.FC<
  SubscriptionDetailsViewProps
> = ({ id }) => {
  const router = useRouter();
  const { data: subscription, isLoading } = useSubscriptionById(id);

  const history = useMemo<SubscriptionHistoryEntry[]>(() => {
    // history is included at runtime by getById but not declared on the type
    return (
      (subscription as unknown as { history?: SubscriptionHistoryEntry[] })
        ?.history ?? []
    );
  }, [subscription]);

  if (isLoading) return <SubscriptionDetailsSkeleton />;

  if (!subscription) {
    return (
      <div className="text-center py-16">
        <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">Subscription not found</h2>
        <p className="text-muted-foreground mb-4">
          The subscription ID does not match any record.
        </p>
        <Button variant="outline" onClick={() => router.push("/subscriptions")}>
          Back to Subscriptions
        </Button>
      </div>
    );
  }

  const status = (subscription.status?.toLowerCase() ??
    "trial") as SubscriptionStatus;
  const statusInfo = statusConfig[status] ?? statusConfig.trial;
  const StatusIcon = statusInfo.icon;

  const tierName = subscription.plan.name ?? "FREE";
  const gradient = tierGradient[tierName] ?? tierGradient.FREE;

  const periodStart = new Date(subscription.currentPeriodStart);
  const periodEnd = new Date(subscription.currentPeriodEnd);
  const today = new Date();
  const totalDays = differenceInDays(periodEnd, periodStart) || 1;
  const elapsedDays = differenceInDays(today, periodStart);
  const periodProgress = Math.min(
    100,
    Math.max(0, Math.round((elapsedDays / totalDays) * 100)),
  );
  const daysLeft = differenceInDays(periodEnd, today);

  const formatCurrency = (amount: number, currency: string) =>
    `${currency} ${amount.toLocaleString()}`;

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/subscriptions"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Subscriptions
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">
          {subscription.tenant.name}
        </span>
      </div>

      {/* Hero Header */}
      <div
        className={`rounded-2xl bg-gradient-to-br ${gradient} border border-border p-6`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-background/80 backdrop-blur border border-border flex items-center justify-center shadow-sm">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {subscription.tenant.name}
                </h1>
                <Badge className={tierColors[tierName] ?? "bg-muted"}>
                  {tierName}
                </Badge>
                <Badge variant={statusInfo.variant}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Subscription ID:{" "}
                <span className="font-mono">{subscription.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/tenants/${subscription.tenantId}`}>
                <ExternalLink className="w-4 h-4 mr-1.5" /> View Tenant
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/subscriptions/${id}/edit`}>
                <Edit className="w-4 h-4 mr-1.5" /> Edit
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-9 h-9">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <RefreshCw className="w-4 h-4 mr-2" /> Renew Subscription
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUpCircle className="w-4 h-4 mr-2" /> Upgrade Plan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(subscription.id)}
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy Subscription ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Ban className="w-4 h-4 mr-2" /> Cancel Subscription
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {status === "past_due" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">Payment Overdue</p>
            <p className="text-xs opacity-80">
              This subscription has a failed payment. Please contact the tenant
              to resolve billing.
            </p>
          </div>
        </div>
      )}
      {subscription.cancelAtPeriodEnd && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">Scheduled for Cancellation</p>
            <p className="text-xs opacity-80">
              This subscription will cancel on{" "}
              {format(periodEnd, "MMMM d, yyyy")}.
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Monthly Price
              </span>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-xl font-bold text-foreground">
              {formatCurrency(
                subscription.pricePerMonth,
                subscription.currency,
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">per month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Billing
              </span>
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-xl font-bold text-foreground capitalize">
              {subscription.billingCycle}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {subscription.paymentProvider
                ? `via ${subscription.paymentProvider}`
                : "No provider set"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Days Left
              </span>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <div
              className={`text-xl font-bold ${
                daysLeft < 7
                  ? "text-destructive"
                  : daysLeft < 30
                    ? "text-amber-600"
                    : "text-foreground"
              }`}
            >
              {daysLeft > 0 ? daysLeft : 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ends {format(periodEnd, "MMM d, yyyy")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Events
              </span>
              <History className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-xl font-bold text-foreground">
              {history.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              total recorded
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent
          value="overview"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Subscription info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" /> Subscription
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <InfoRow
                  label="Plan"
                  value={
                    <Badge className={tierColors[tierName] ?? "bg-muted"}>
                      {tierName}
                    </Badge>
                  }
                />
                <InfoRow
                  label="Status"
                  value={
                    <Badge variant={statusInfo.variant}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  }
                />
                <InfoRow
                  label="Billing Cycle"
                  value={
                    <span className="capitalize">
                      {subscription.billingCycle}
                    </span>
                  }
                />
                <InfoRow label="Currency" value={subscription.currency} />
                <InfoRow
                  label="Created"
                  value={format(
                    new Date(subscription.createdAt),
                    "MMM d, yyyy",
                  )}
                />
                <InfoRow
                  label="Last Updated"
                  value={format(
                    new Date(subscription.updatedAt),
                    "MMM d, yyyy",
                  )}
                />
              </CardContent>
            </Card>

            {/* Period + Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Current Period
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <InfoRow
                  label="Period Start"
                  value={format(periodStart, "MMM d, yyyy")}
                />
                <InfoRow
                  label="Period End"
                  value={format(periodEnd, "MMM d, yyyy")}
                />
                <InfoRow
                  label="Time Remaining"
                  value={
                    <span
                      className={
                        daysLeft < 7
                          ? "text-destructive font-semibold"
                          : statusInfo.color
                      }
                    >
                      {daysLeft > 0
                        ? formatDistanceToNow(periodEnd, { addSuffix: true })
                        : "Ended"}
                    </span>
                  }
                />
                {/* Period Progress */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Period progress</span>
                    <span>{periodProgress}%</span>
                  </div>
                  <Progress value={periodProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{format(periodStart, "MMM d")}</span>
                    <span>{format(periodEnd, "MMM d")}</span>
                  </div>
                </div>
                {subscription.cancelAtPeriodEnd && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
                    <Ban className="w-4 h-4" />
                    <span>Cancels at period end</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tenant quick-link */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Tenant
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{subscription.tenant.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {subscription.tenantId}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/tenants/${subscription.tenantId}`}>
                    <ExternalLink className="w-4 h-4 mr-1.5" /> Open Tenant
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation block */}
          {subscription.canceledAt && (
            <Card className="border-destructive/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <Ban className="w-4 h-4" /> Cancellation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <InfoRow
                  label="Canceled At"
                  value={format(
                    new Date(subscription.canceledAt),
                    "MMM d, yyyy HH:mm",
                  )}
                />
                {subscription.cancelReason && (
                  <div className="mt-3 p-3 rounded-lg bg-muted/60 text-sm text-muted-foreground">
                    {subscription.cancelReason}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Billing ── */}
        <TabsContent
          value="billing"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pricing */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" /> Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {/* Big price display */}
                <div className="text-center py-4 mb-4 rounded-xl bg-primary/5 border border-border">
                  <div className="text-3xl font-bold text-foreground">
                    {formatCurrency(
                      subscription.pricePerMonth,
                      subscription.currency,
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    per month
                  </div>
                </div>
                <InfoRow
                  label="Monthly Price"
                  value={
                    <span className="font-semibold">
                      {formatCurrency(
                        subscription.pricePerMonth,
                        subscription.currency,
                      )}
                    </span>
                  }
                />
                <InfoRow
                  label="Yearly Price"
                  value={
                    <span className="font-semibold">
                      {subscription.pricePerYear ? (
                        formatCurrency(
                          subscription.pricePerYear,
                          subscription.currency,
                        )
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </span>
                  }
                />
                {subscription.pricePerYear && (
                  <InfoRow
                    label="Yearly Savings"
                    value={
                      <span className="font-semibold text-green-600">
                        {formatCurrency(
                          subscription.pricePerMonth * 12 -
                            subscription.pricePerYear,
                          subscription.currency,
                        )}
                      </span>
                    }
                  />
                )}
                <InfoRow label="Currency" value={subscription.currency} />
                <InfoRow
                  label="Billing Cycle"
                  value={
                    <span className="capitalize">
                      {subscription.billingCycle}
                    </span>
                  }
                />
              </CardContent>
            </Card>

            {/* Payment Provider */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-primary" /> Payment Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {subscription.paymentProvider ? (
                  <>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border mb-4">
                      <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold capitalize">
                          {subscription.paymentProvider}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Active payment method
                        </p>
                      </div>
                      <div className="ml-auto">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                          Connected
                        </Badge>
                      </div>
                    </div>
                    <InfoRow
                      label="Provider"
                      value={
                        <span className="capitalize font-semibold">
                          {subscription.paymentProvider}
                        </span>
                      }
                    />
                    <InfoRow
                      label="External ID"
                      value={
                        <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                          {subscription.externalId ?? "N/A"}
                        </span>
                      }
                    />
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No payment provider set
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This is a manual or free subscription
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Revenue projection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Revenue
                Projection
              </CardTitle>
              <CardDescription>
                Estimated contribution based on current plan
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Monthly", amount: subscription.pricePerMonth },
                  {
                    label: "Quarterly",
                    amount: subscription.pricePerMonth * 3,
                  },
                  {
                    label: "Bi-Annual",
                    amount: subscription.pricePerMonth * 6,
                  },
                  {
                    label: "Annual",
                    amount:
                      subscription.pricePerYear ??
                      subscription.pricePerMonth * 12,
                  },
                ].map(({ label, amount }) => (
                  <div
                    key={label}
                    className="text-center p-3 rounded-xl bg-muted/50 border border-border"
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {label}
                    </p>
                    <p className="font-bold text-foreground">
                      {formatCurrency(amount, subscription.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── History ── */}
        <TabsContent
          value="history"
          className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-primary" /> Subscription
                History
              </CardTitle>
              <CardDescription>
                {history.length} events recorded
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>No history events yet</p>
                </div>
              ) : (
                <div className="relative space-y-1">
                  {/* Vertical timeline line */}
                  <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border" />

                  {history.map((event: SubscriptionHistoryEntry) => {
                    const eventType = resolveEventType(event.event);
                    const cfg = eventConfig[eventType];
                    const EventIcon = cfg.icon;

                    return (
                      <div key={event.id} className="relative flex gap-4 group">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1 z-10">
                          <div className="w-10 h-10 rounded-full border-2 border-background bg-card flex items-center justify-center shadow-sm ring-1 ring-border">
                            <EventIcon className={`w-4 h-4 ${cfg.color}`} />
                          </div>
                        </div>

                        {/* Card */}
                        <div className="flex-1 mb-4 rounded-xl border border-border bg-card p-4 transition-colors group-hover:border-primary/30">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                            <span
                              className={`font-semibold text-sm ${cfg.color}`}
                            >
                              {cfg.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(
                                new Date(event.createdAt),
                                "MMM d, yyyy · HH:mm",
                              )}
                            </span>
                          </div>

                          {event.reason && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {event.reason}
                            </p>
                          )}

                          {/* Changes chips */}
                          <div className="flex flex-wrap gap-2">
                            {event.fromStatus && event.toStatus && (
                              <div className="flex items-center gap-1.5 text-xs bg-muted rounded-full px-3 py-1">
                                <span className="text-muted-foreground">
                                  Status:
                                </span>
                                <span className="line-through opacity-60">
                                  {event.fromStatus}
                                </span>
                                <span>→</span>
                                <span className="font-medium">
                                  {event.toStatus}
                                </span>
                              </div>
                            )}
                            {event.fromPlanId && event.toPlanId && (
                              <div className="flex items-center gap-1.5 text-xs bg-muted rounded-full px-3 py-1">
                                <span className="text-muted-foreground">
                                  Plan changed
                                </span>
                              </div>
                            )}
                            {event.createdBy && (
                              <div className="flex items-center gap-1.5 text-xs bg-muted/60 rounded-full px-3 py-1 text-muted-foreground">
                                <User className="w-3 h-3" /> {event.createdBy}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
