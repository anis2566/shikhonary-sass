"use client";

import { FilterIcon, Plus, Search, X } from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";

import { useSubscriptionPlanFilters } from "@workspace/api-client";

import {
  ACTIVE_STATUS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@workspace/utils/constants";

import { enumToOptions } from "@workspace/utils";

interface FilterProps {
  isLoading: boolean;
}

export const Filter = ({ isLoading }: FilterProps) => {
  const [search, setSearch] = useState("");

  const debounceValue = useDebounce(search, 500);

  const [filters, setFilters] = useSubscriptionPlanFilters();

  useEffect(() => {
    setFilters({
      search: debounceValue,
    });
  }, [debounceValue, setFilters]);

  const handleFilterStatusChange = (value: ACTIVE_STATUS) => {
    setFilters({
      ...filters,
      isActive: value,
    });
  };

  const hasActiveFilters =
    !!filters.isActive ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      isActive: null,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative w-full md:max-w-[320px] group">
            <Input
              placeholder="Search subscription plans..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10 h-10 w-full bg-background/50 backdrop-blur-sm border-border/50 rounded-xl focus:bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-soft placeholder:text-muted-foreground/50 font-medium"
              disabled={isLoading}
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
              <Search className="h-4 w-4 text-primary/70 group-focus-within:text-primary transition-colors" />
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md text-muted-foreground transition-all z-10"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <Select
              value={filters.isActive || ""}
              onValueChange={(v) =>
                handleFilterStatusChange(v as ACTIVE_STATUS)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 min-w-[110px] bg-background/50 backdrop-blur-sm border-border/50 rounded-xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <FilterIcon className="h-3.5 w-3.5 mr-2 text-primary/70" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {enumToOptions(ACTIVE_STATUS).map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                disabled={isLoading}
                className="h-10 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all font-semibold border border-transparent hover:border-destructive/20"
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              disabled={isLoading}
              className="h-10 px-4 bg-primary text-primary-foreground rounded-xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
            >
              <Link href="/subscription-plans/new">
                <Plus className="h-4 w-4 mr-2 stroke-[3]" />
                Add Plan
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
