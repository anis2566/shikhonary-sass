"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { cn } from "@workspace/ui/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  selectedIds?: string[];
  setSelectedIds?: (ids: string[]) => void;
}

function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  selectedIds = [],
  setSelectedIds,
}: DataTableProps<T>) {
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds?.([]);
    } else {
      setSelectedIds?.(data.map((item) => item.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds?.(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds?.([...selectedIds, id]);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {setSelectedIds && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    "font-semibold text-foreground",
                    column.hideOnMobile && "hidden sm:table-cell",
                    column.className,
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (setSelectedIds ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                    selectedIds.includes(item.id) && "bg-muted/30",
                  )}
                >
                  {setSelectedIds && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => handleSelectRow(item.id)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={`${item.id}-${String(column.key)}`}
                      className={cn(
                        column.hideOnMobile && "hidden sm:table-cell",
                        column.className,
                      )}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DataTable;

export const StatusBadge: React.FC<{ active: boolean }> = ({ active }) => (
  <Badge
    variant={active ? "default" : "secondary"}
    className={cn(
      active
        ? "bg-green-100 text-green-700 hover:bg-green-100"
        : "bg-muted text-muted-foreground",
    )}
  >
    {active ? "Active" : "Inactive"}
  </Badge>
);

export const SubscriptionBadge: React.FC<{ tier: string; status: string }> = ({
  tier,
  status,
}) => {
  const tierColors: Record<string, string> = {
    FREE: "bg-muted text-muted-foreground",
    BASIC: "bg-blue-100 text-blue-700",
    PRO: "bg-purple-100 text-purple-700",
    ENTERPRISE: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="flex flex-col gap-1">
      <Badge className={cn("hover:opacity-90 text-xs", tierColors[tier])}>
        {tier}
      </Badge>
      {status === "TRIAL" && (
        <span className="text-xs text-amber-600">Trial</span>
      )}
    </div>
  );
};

export const TenantTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const typeColors: Record<string, string> = {
    SCHOOL: "bg-blue-100 text-blue-700",
    COACHING_CENTER: "bg-green-100 text-green-700",
    INDIVIDUAL: "bg-purple-100 text-purple-700",
    TRAINING_CENTER: "bg-amber-100 text-amber-700",
    UNIVERSITY: "bg-indigo-100 text-indigo-700",
    OTHER: "bg-muted text-muted-foreground",
  };

  return (
    <Badge
      className={cn(
        "hover:opacity-90",
        typeColors[type] || "bg-muted text-muted-foreground",
      )}
    >
      {type.replace("_", " ")}
    </Badge>
  );
};
