"use client";

import {
  ArrowUpDown,
  Download,
  FilterIcon,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import {
  TENANT_TYPE,
  ACTIVE_STATUS,
  activeStatusOptions,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE,
  tenantTypeOptions,
} from "@workspace/utils";
import { useTenantFilters } from "@workspace/api-client";

import { useDebounce } from "@workspace/ui/hooks/use-debounce";

interface FilterProps {
  isLoading: boolean;
}

export const Filter = ({ isLoading }: FilterProps) => {
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useTenantFilters();

  const debounceValue = useDebounce(search, 500);

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

  const handleSortChange = (value: string) => {
    // Parse the sort value (e.g., "name-asc" or "createdAt-desc")
    const [sortBy, sortOrder] = value.split("-") as [string, "asc" | "desc"];
    setFilters({
      ...filters,
      sortBy,
      sortOrder,
    });
  };

  const handleFilterTypeChange = (value: TENANT_TYPE) => {
    setFilters({
      ...filters,
      type: value,
    });
  };

  const currentSort =
    filters.sortBy && filters.sortOrder
      ? `${filters.sortBy}-${filters.sortOrder}`
      : "";

  const hasActiveFilters =
    !!filters.isActive ||
    !!filters.sortBy ||
    !!filters.type ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      sortOrder: null,
      isActive: null,
      type: null,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full md:max-w-[320px] group">
            <Input
              placeholder="Search tenants..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10 h-11 w-full bg-background/50 backdrop-blur-sm border-border/50 rounded-2xl focus:bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-soft placeholder:text-muted-foreground/50 font-medium"
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
            {/* Type Filter */}
            <Select
              value={filters.type || ""}
              onValueChange={(v) => handleFilterTypeChange(v as TENANT_TYPE)}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 min-w-[120px] bg-background/50 backdrop-blur-sm border-border/50 rounded-2xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <FilterIcon className="h-4 w-4 mr-2 text-primary/70" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl">
                {tenantTypeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-xl font-bold p-2.5 focus:bg-primary/10 focus:text-primary"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.isActive || ""}
              onValueChange={(v) =>
                handleFilterStatusChange(v as ACTIVE_STATUS)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 min-w-[120px] bg-background/50 backdrop-blur-sm border-border/50 rounded-2xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <FilterIcon className="h-4 w-4 mr-2 text-primary/70" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl">
                {activeStatusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    className="rounded-xl font-bold p-2.5 focus:bg-primary/10 focus:text-primary"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select
              value={currentSort}
              onValueChange={(v) => handleSortChange(v)}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 min-w-[130px] bg-background/50 backdrop-blur-sm border-border/50 rounded-2xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <ArrowUpDown className="h-4 w-4 mr-2 text-primary/70" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl"
              >
                <SelectItem
                  value="name-asc"
                  className="rounded-xl font-bold p-2.5 focus:bg-primary/10 focus:text-primary"
                >
                  Name (A-Z)
                </SelectItem>
                <SelectItem
                  value="name-desc"
                  className="rounded-xl font-bold p-2.5 focus:bg-primary/10 focus:text-primary"
                >
                  Name (Z-A)
                </SelectItem>
                <SelectItem
                  value="createdAt-desc"
                  className="rounded-xl font-bold p-2.5 focus:bg-primary/10 focus:text-primary"
                >
                  Newest First
                </SelectItem>
                <SelectItem
                  value="createdAt-asc"
                  className="rounded-xl font-bold p-2.5 focus:bg-primary/10 focus:text-primary"
                >
                  Oldest First
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                disabled={isLoading}
                className="h-11 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-2xl transition-all font-bold border border-transparent hover:border-destructive/20"
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 border-border/50 bg-background/50 backdrop-blur-sm rounded-2xl hover:bg-muted transition-all shadow-soft"
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 border-border/50 bg-background/50 backdrop-blur-sm rounded-2xl hover:bg-muted transition-all shadow-soft"
            disabled={isLoading}
          >
            <Upload className="h-4 w-4" />
          </Button>

          <Button
            asChild
            disabled={isLoading}
            className="h-11 px-5 bg-primary text-primary-foreground rounded-2xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
          >
            <Link href="/tenants/new">
              <Plus className="h-4 w-4 mr-2 stroke-[3]" />
              Add Tenant
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
