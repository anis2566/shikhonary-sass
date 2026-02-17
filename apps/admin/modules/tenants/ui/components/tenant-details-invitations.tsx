"use client";

import { Mail } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

import { Tenant, TenantInvitation } from "@workspace/db";
import { useInvitationModal } from "@workspace/ui/hooks/use-invitation-modal";

import { TenantDetailsInvitationsTable } from "./tenant-details-invitation-table";

interface TenantDetailsInvitationsProps {
  invitations: TenantInvitation[];
  tenant: Tenant;
}

export const TenantDetailsInvitations = ({
  invitations,
  tenant,
}: TenantDetailsInvitationsProps) => {
  const { onOpen } = useInvitationModal();
  return (
    <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl overflow-hidden shadow-soft group hover:shadow-medium transition-all duration-300">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
              <Mail className="w-4 h-4" />
            </div>
            Team Invitations
          </CardTitle>
          <CardDescription className="text-sm font-medium mt-1">
            Manage administrative access and pending invitations for{" "}
            {tenant.name}
          </CardDescription>
        </div>
        <Button
          variant="default"
          size="sm"
          className="h-10 gap-2 bg-primary text-primary-foreground rounded-xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all font-bold px-5"
          onClick={() => onOpen(tenant.id, tenant.name)}
        >
          <Mail className="w-4 h-4 stroke-[2.5]" />
          <span>Invite New Admin</span>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {invitations.length > 0 ? (
          <TenantDetailsInvitationsTable invitations={invitations} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl animate-pulse" />
              <div className="relative size-20 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center shadow-soft">
                <Mail className="h-10 w-10 text-muted-foreground/40" />
              </div>
            </div>
            <h3 className="text-lg font-black tracking-tight mb-2">
              No Active Invitations
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm text-sm font-medium">
              Start building your tenant administration team by sending your
              first invitation.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 border-border/50 bg-background/50 backdrop-blur-sm rounded-xl hover:bg-muted transition-all shadow-soft font-bold px-6"
              onClick={() => onOpen(tenant.id, tenant.name)}
            >
              <Mail className="w-4 h-4" />
              <span>Send First Invitation</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
