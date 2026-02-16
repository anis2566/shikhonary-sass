"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { useAcademicTopicFilters } from "@workspace/api-client";

interface PaginationProps {
  totalItem: number;
}

export const Pagination = ({ totalItem }: PaginationProps) => {
  const [filters, setFilters] = useAcademicTopicFilters();
  const totalPages = Math.ceil(totalItem / filters.limit);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Show
          </span>
          <Select
            value={String(filters.limit)}
            onValueChange={(value) =>
              setFilters({ ...filters, limit: Number(value) })
            }
          >
            <SelectTrigger className="w-16 h-7 border-none bg-transparent hover:bg-muted/50 rounded-lg transition-all focus:ring-0 px-2 font-black text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="5" className="rounded-lg">
                5
              </SelectItem>
              <SelectItem value="10" className="rounded-lg">
                10
              </SelectItem>
              <SelectItem value="20" className="rounded-lg">
                20
              </SelectItem>
              <SelectItem value="50" className="rounded-lg">
                50
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">
          Showing {totalItem > 0 ? (filters.page - 1) * filters.limit + 1 : 0} -{" "}
          {Math.min(totalItem, filters.page * filters.limit)} of {totalItem}{" "}
          Topics
        </div>
      </div>

      <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border/50 p-1 rounded-2xl shadow-soft">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
          onClick={() => setFilters({ ...filters, page: 1 })}
          disabled={filters.page === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          disabled={filters.page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center px-4">
          <span className="text-xs font-black tracking-tight text-foreground">
            Page {filters.page}{" "}
            <span className="text-muted-foreground font-medium mx-1">of</span>{" "}
            {totalPages || 1}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          disabled={filters.page >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
          onClick={() =>
            setFilters({
              ...filters,
              page: totalPages,
            })
          }
          disabled={filters.page >= totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
