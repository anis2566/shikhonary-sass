"use client";

import { useTenantById } from "@workspace/api-client";
import { ArrowLeft, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

import { TENANT_INVITATION_STATUS } from "@workspace/utils";

import { TenantDetailsHeader } from "../components/tenant-details-header";
import { TenantDetailsHeaderCard } from "../components/tenant-details-header-card";
import { TenantDetailsOverview } from "../components/tenant-details-overview";
import { TenantDetailsUsage } from "../components/tenant-details-usage";
import { TenantDetailsSubscription } from "../components/tenant-details-subscription";
import { TenantDetailsInvitations } from "../components/tenant-details-invitations";
import { TenantDetailsDatabase } from "../components/tenant-details-database";

interface TenantViewProps {
  tenantId: string;
}

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const TenantView = ({ tenantId }: TenantViewProps) => {
  const { data: tenant } = useTenantById(tenantId);
  const router = useRouter();

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="size-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto border border-border/50">
            <XCircle className="size-8 text-muted-foreground/50" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Tenant not found</h2>
            <p className="text-sm text-muted-foreground">
              The tenant you are looking for does not exist or has been removed.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={() => router.push("/tenants")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tenants
          </Button>
        </motion.div>
      </div>
    );
  }

  const pendingCount = tenant.invitations.filter(
    (invitation) => invitation.status === TENANT_INVITATION_STATUS.PENDING,
  ).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 lg:p-6 space-y-8"
    >
      <motion.div variants={itemVariants}>
        <TenantDetailsHeader
          isSuspended={tenant.isSuspended}
          tenantId={tenant.id}
          tenantName={tenant.name}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TenantDetailsHeaderCard tenant={tenant} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-muted/50 p-1.5 rounded-2xl border border-border/50 backdrop-blur-md h-auto inline-flex overflow-x-auto max-w-full">
            <TabsTrigger
              value="overview"
              className="rounded-xl px-5 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              className="rounded-xl px-5 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              Usage & Limits
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="rounded-xl px-5 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              Subscription
            </TabsTrigger>
            <TabsTrigger
              value="invitations"
              className="rounded-xl px-5 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all gap-2"
            >
              <span>Invitations</span>
              {pendingCount > 0 && (
                <span className="flex items-center justify-center bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="database"
              className="rounded-xl px-5 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all"
            >
              Database
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent
              value="overview"
              className="mt-0 focus-visible:outline-none"
            >
              <TenantDetailsOverview tenant={tenant} />
            </TabsContent>

            <TabsContent
              value="usage"
              className="mt-0 focus-visible:outline-none"
            >
              <TenantDetailsUsage tenant={tenant} />
            </TabsContent>

            <TabsContent
              value="subscription"
              className="mt-0 focus-visible:outline-none"
            >
              <TenantDetailsSubscription tenant={tenant} />
            </TabsContent>

            <TabsContent
              value="invitations"
              className="mt-0 focus-visible:outline-none"
            >
              <TenantDetailsInvitations
                invitations={tenant.invitations}
                tenant={tenant}
              />
            </TabsContent>

            <TabsContent
              value="database"
              className="mt-0 focus-visible:outline-none"
            >
              <TenantDetailsDatabase tenant={tenant} />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};
