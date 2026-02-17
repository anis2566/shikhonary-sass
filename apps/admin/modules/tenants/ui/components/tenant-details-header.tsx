"use client";

import { ArrowLeft, Edit, Mail, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { cn } from "@workspace/ui/lib/utils";

import { useInvitationModal } from "@workspace/ui/hooks/use-invitation-modal";

interface TenantDetailsHeaderProps {
  isSuspended: boolean;
  tenantId: string;
  tenantName: string;
}

export const TenantDetailsHeader = ({
  isSuspended,
  tenantId,
  tenantName,
}: TenantDetailsHeaderProps) => {
  const router = useRouter();
  const { onOpen } = useInvitationModal();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all group font-bold px-0 pr-4"
        onClick={() => router.push("/tenants")}
      >
        <div className="size-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        </div>
        Back to Tenants
      </Button>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button
          variant="default"
          size="sm"
          className="h-10 gap-2 bg-primary text-primary-foreground rounded-2xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all font-bold px-5"
          onClick={() => onOpen(tenantId, tenantName)}
        >
          <Mail className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Invite Admin</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-2 border-border/50 bg-background/50 backdrop-blur-sm rounded-2xl hover:bg-muted transition-all shadow-soft font-bold px-5"
          asChild
        >
          <Link href={`/tenants/edit/${tenantId}`}>
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Configure</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-border/50 bg-background/50 backdrop-blur-sm rounded-2xl hover:bg-muted transition-all shadow-soft"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-card/90 backdrop-blur-xl border border-border/50 shadow-2xl z-50 rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-200"
          >
            <DropdownMenuItem className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary">
              Manage Subscription
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary">
              View Staff Members
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary">
              Security Logs
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50 my-1.5" />
            <DropdownMenuItem
              className={cn(
                "cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors",
                isSuspended
                  ? "text-green-500 focus:bg-green-500/10 focus:text-green-600"
                  : "text-destructive focus:bg-destructive/10 focus:text-destructive",
              )}
            >
              {isSuspended ? "Unsuspend Tenant" : "Suspend Operations"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
