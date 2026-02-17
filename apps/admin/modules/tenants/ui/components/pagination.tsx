"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { useTenantFilters } from "@workspace/api-client";

interface PaginationProps {
  totalItem: number;
}

export const Pagination = ({ totalItem }: PaginationProps) => {
  const [filters, setFilters] = useTenantFilters();

  const totalPages = Math.ceil(totalItem / filters.limit);
  const currentPage = filters.page;

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleLimitChange = (limit: string) => {
    setFilters({ limit: parseInt(limit), page: 1 });
  };

  if (totalItem === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Items per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Items per page:</span>
        <Select
          value={filters.limit.toString()}
          onValueChange={handleLimitChange}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Page info and navigation */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages} ({totalItem} total)
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
