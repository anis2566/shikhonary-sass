import { AlertCircle, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import {
  TENANT_SUBSCRIPTION_PLAN,
  TENANT_SUBSCRIPTION_STATUS,
} from "@workspace/utils";

import { Subscription, SubscriptionPlan, Tenant } from "@workspace/db";

interface SubscriptionWithPlan extends Subscription {
  plan: SubscriptionPlan;
}

interface TenantWithRelation extends Tenant {
  subscription: SubscriptionWithPlan | null;
}

interface TenantDetailsSubscriptionProps {
  tenant: TenantWithRelation;
}

export const TenantDetailsSubscription = ({
  tenant,
}: TenantDetailsSubscriptionProps) => {
  const tierColors: Record<TENANT_SUBSCRIPTION_PLAN, string> = {
    FREE: "bg-muted text-muted-foreground",
    STARTER: "bg-blue-100 text-blue-700",
    PRO: "bg-purple-100 text-purple-700",
    ENTERPRISE: "bg-amber-100 text-amber-700",
  };

  const statusColors: Record<
    TENANT_SUBSCRIPTION_STATUS,
    { bg: string; text: string; icon: React.ReactNode }
  > = {
    TRIAL: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    ACTIVE: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    PAST_DUE: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    CANCELED: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      icon: <XCircle className="w-4 h-4" />,
    },
    EXPIRED: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <XCircle className="w-4 h-4" />,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Subscription Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Tier</p>
            <Badge
              className={cn(
                "mt-1",
                tierColors[
                  tenant.subscription?.plan?.name as TENANT_SUBSCRIPTION_PLAN
                ],
              )}
            >
              {tenant.subscription?.plan?.name}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge
              className={cn(
                "mt-1 flex items-center gap-1 w-fit",
                statusColors[
                  tenant.subscription?.status as TENANT_SUBSCRIPTION_STATUS
                ].bg,
                statusColors[
                  tenant.subscription?.status as TENANT_SUBSCRIPTION_STATUS
                ].text,
              )}
            >
              {
                statusColors[
                  tenant.subscription?.status as TENANT_SUBSCRIPTION_STATUS
                ].icon
              }
              {tenant.subscription?.status.replace("_", " ")}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Price</p>
            <p className="text-lg font-semibold mt-1">
              ৳{tenant.subscription?.pricePerMonth.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Yearly Price</p>
            <p className="text-lg font-semibold mt-1">
              ৳{tenant.subscription?.pricePerYear?.toLocaleString()}
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tenant.subscription?.trialEndsAt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Trial Ends</p>
                <p className="font-medium">
                  {format(new Date(tenant.subscription.trialEndsAt), "PPP")}
                </p>
              </div>
            </div>
          )}
          {tenant.subscription?.currentPeriodEnd && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Subscription Ends
                </p>
                <p className="font-medium">
                  {format(
                    new Date(tenant.subscription.currentPeriodEnd),
                    "PPP",
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
