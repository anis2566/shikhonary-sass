"use client";

import React, { useState } from "react";
import { format, formatDistanceToNow, differenceInHours } from "date-fns";
import {
  MoreHorizontal,
  RotateCw,
  XCircle,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { cn } from "@workspace/ui/lib/utils";

import { TenantInvitation } from "@workspace/db";
import { TENANT_INVITATION_STATUS } from "@workspace/utils/constants";

interface TenantDetailsInvitationsProps {
  invitations: TenantInvitation[];
}

const statusConfig: Record<
  TENANT_INVITATION_STATUS,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
    colorClass: string;
  }
> = {
  PENDING: {
    label: "Pending",
    variant: "outline",
    icon: <Clock className="h-3 w-3" />,
    colorClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  ACCEPTED: {
    label: "Accepted",
    variant: "default",
    icon: <CheckCircle2 className="h-3 w-3" />,
    colorClass: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  REJECTED: {
    label: "Rejected",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
    colorClass: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  EXPIRED: {
    label: "Expired",
    variant: "secondary",
    icon: <Clock className="h-3 w-3 opacity-50" />,
    colorClass: "bg-muted text-muted-foreground border-transparent opacity-60",
  },
};

export const TenantDetailsInvitationsTable = ({
  invitations,
}: TenantDetailsInvitationsProps) => {
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] =
    useState<TenantInvitation | null>(null);

  const handleResend = async () => {};

  const handleRevoke = async () => {};

  const isExpiringSoon = (expiresAt: Date) => {
    return differenceInHours(new Date(expiresAt), new Date()) < 24;
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 border-b border-border/50 hover:bg-muted/30">
            <TableHead className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 pl-8">
              Admin Details
            </TableHead>
            <TableHead className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
              Role
            </TableHead>
            <TableHead className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 font-black">
              Status
            </TableHead>
            <TableHead className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
              Sent By
            </TableHead>
            <TableHead className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
              Expiry Condition
            </TableHead>
            <TableHead className="py-4 text-right pr-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => {
            const status =
              statusConfig[invitation.status as TENANT_INVITATION_STATUS] ||
              statusConfig.PENDING;
            const expiringSoon =
              invitation.status === "PENDING" &&
              isExpiringSoon(invitation.expiresAt);

            return (
              <TableRow
                key={invitation.id}
                className="group border-b border-border/40 hover:bg-primary/[0.02] transition-colors duration-300"
              >
                <TableCell className="py-5 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs shadow-soft transition-transform group-hover:scale-110">
                      {invitation.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-sm tracking-tight">
                        {invitation.email}
                      </span>
                      {invitation?.name && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 leading-none mt-0.5">
                          {invitation.name}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-5">
                  <Badge
                    variant="outline"
                    className="px-2.5 py-0.5 rounded-lg border-border/50 bg-background/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:border-primary/20 group-hover:text-primary transition-colors"
                  >
                    {invitation.role.replace("_", " ").toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="py-5">
                  <Badge
                    className={cn(
                      "gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      status.colorClass,
                    )}
                  >
                    {status.icon}
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="py-5">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-muted border border-border/50 flex items-center justify-center text-[8px] font-black">
                      SA
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                      Super Admin
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-5 font-mono text-[11px]">
                  <div className="flex flex-col gap-0.5">
                    {invitation.status === "PENDING" ? (
                      <>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "font-black tracking-tighter",
                              expiringSoon
                                ? "text-amber-500 anim-pulse"
                                : "text-muted-foreground",
                            )}
                          >
                            {formatDistanceToNow(
                              new Date(invitation.expiresAt),
                              {
                                addSuffix: true,
                              },
                            )}
                          </span>
                          {expiringSoon && (
                            <AlertTriangle className="size-3 text-amber-500" />
                          )}
                        </div>
                        <span className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                          Expires:{" "}
                          {format(
                            new Date(invitation.expiresAt),
                            "MMM d, hh:mm a",
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground/40 font-bold">
                        Processed:{" "}
                        {format(
                          new Date(
                            invitation.updatedAt || invitation.createdAt,
                          ),
                          "MMM d, yyyy",
                        )}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-5 pr-8 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-xl transition-all shadow-soft group-hover:border-primary/20"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-52 bg-card/90 backdrop-blur-xl border border-border/50 shadow-2xl z-50 rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-200"
                    >
                      {invitation.status === "PENDING" && (
                        <>
                          <DropdownMenuItem
                            className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                            onClick={() => {
                              setSelectedInvitation(invitation);
                              setResendDialogOpen(true);
                            }}
                          >
                            <RotateCw className="h-4 w-4 text-primary" />
                            Resend Invitation
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border/50 my-1.5" />
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-destructive/10"
                            onClick={() => {
                              setSelectedInvitation(invitation);
                              setRevokeDialogOpen(true);
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                            Revoke Invitation
                          </DropdownMenuItem>
                        </>
                      )}
                      {invitation.status !== "PENDING" && (
                        <DropdownMenuItem className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary">
                          <Eye className="h-4 w-4" />
                          Audit Record
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AlertDialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black tracking-tight">
              Resend Invitation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
              This will send a fresh invitation email to{" "}
              <span className="text-primary font-bold">
                {selectedInvitation?.email}
              </span>
              . The previous session will remain active but the new link will
              take precedence.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-xl font-bold border-border/50">
              Keep Previous
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResend}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-glow"
            >
              Confirm Resend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black tracking-tight text-destructive">
              Revoke Security Link?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
              Are you sure you want to invalidate the invitation for{" "}
              <span className="text-foreground font-bold">
                {selectedInvitation?.email}
              </span>
              ? This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-xl font-bold border-border/50">
              Keep Active
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold rounded-xl shadow-soft"
            >
              Revoke Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
