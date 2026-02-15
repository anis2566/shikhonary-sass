"use client";

import {
  ArrowUpDown,
  Download,
  FilterIcon,
  GripVertical,
  Layers,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import { cn } from "@workspace/ui/lib/utils";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";

import { useAcademicClassFilters } from "@workspace/api-client";

import {
  ACADEMIC_LEVEL,
  ACTIVE_STATUS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  SORT_WITH_POSITION,
} from "@workspace/utils/constants";

import { enumToOptions } from "@workspace/utils";

interface FilterProps {
  reorderMode: boolean;
  setReorderMode: Dispatch<SetStateAction<boolean>>;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  isLoading: boolean;
}

export const Filter = ({
  reorderMode,
  setReorderMode,
  setSelectedIds,
  isLoading,
}: FilterProps) => {
  const [search, setSearch] = useState("");

  const debounceValue = useDebounce(search, 500);

  const [filters, setFilters] = useAcademicClassFilters();

  useEffect(() => {
    setFilters({
      search: debounceValue,
    });
    setReorderMode(false);
    setSelectedIds([]);
  }, [debounceValue, setFilters, setReorderMode, setSelectedIds]);

  const handleReorderModeChange = (checked: boolean) => {
    setReorderMode(checked);
  };

  const handleFilterStatusChange = (value: ACTIVE_STATUS) => {
    setFilters({
      ...filters,
      isActive: value,
    });
    setReorderMode(false);
    setSelectedIds([]);
  };

  const handleFilterLevelChange = (value: ACADEMIC_LEVEL) => {
    setFilters({
      ...filters,
      level: value,
    });
    setReorderMode(false);
    setSelectedIds([]);
  };

  const handleSortChange = (value: SORT_WITH_POSITION) => {
    setFilters({
      ...filters,
      sort: value,
    });
    setReorderMode(false);
    setSelectedIds([]);
  };

  const hasActiveFilters =
    !!filters.isActive ||
    !!filters.level ||
    !!filters.sort ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sort: null,
      isActive: null,
      level: null,
    });
    setReorderMode(false);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative w-full md:max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="pl-9 max-full"
            disabled={isLoading}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Select
            value={filters.isActive || ""}
            onValueChange={(v) => {
              handleFilterStatusChange(v as ACTIVE_STATUS);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full sm:w-32">
              <FilterIcon className="h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {enumToOptions(ACTIVE_STATUS).map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.level || ""}
            onValueChange={(v) => {
              handleFilterLevelChange(v as ACADEMIC_LEVEL);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full sm:w-32">
              <Layers className="h-4 w-4" />
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {enumToOptions(ACADEMIC_LEVEL).map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.sort || ""}
            onValueChange={(v) => {
              handleSortChange(v as SORT_WITH_POSITION);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full sm:w-32">
              <ArrowUpDown className="h-4 w-4" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {enumToOptions(SORT_WITH_POSITION).map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="outline"
              className="hidden sm:flex text-red-500 hover:text-red-500 hover:bg-red-500/10 rounded-full bg-red-500/5"
              onClick={handleResetFilters}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="reorder-mode" className="text-sm cursor-pointer">
            Reorder
          </Label>
          <Switch
            id="reorder-mode"
            checked={reorderMode}
            onCheckedChange={(checked) => {
              handleReorderModeChange(checked);
            }}
            disabled={isLoading}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="hidden sm:flex"
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden sm:flex"
          disabled={isLoading}
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button asChild disabled={isLoading}>
          <Link
            href="/classes/new"
            className={cn(
              "",
              isLoading && "cursor-not-allowed opacity-50 pointer-events-none",
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Link>
        </Button>
      </div>
    </div>
  );
};
