"use client";

import {
  ArrowUpDown,
  Book,
  BookOpen,
  Download,
  FilterIcon,
  GripVertical,
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
import { useDebounce } from "@workspace/ui/hooks/use-debounce";

import {
  useAcademicTopicFilters,
  useAcademicClassesForSelection,
  useAcademicSubjectByClassId,
  useAcademicChaptersForSelection,
} from "@workspace/api-client";

import {
  ACTIVE_STATUS,
  activeStatusOptions,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  SORT_WITH_POSITION,
  sortWithPositionOptions,
} from "@workspace/utils/constants";

interface FilterProps {
  reorderMode: boolean;
  setReorderMode: Dispatch<SetStateAction<boolean>>;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  isLoading: boolean;
  showReorderMode: boolean;
}

export const Filter = ({
  reorderMode,
  setReorderMode,
  setSelectedIds,
  isLoading,
  showReorderMode,
}: FilterProps) => {
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const debounceValue = useDebounce(search, 500);

  const [filters, setFilters] = useAcademicTopicFilters();
  const { data: classes } = useAcademicClassesForSelection();
  const { data: subjects } = useAcademicSubjectByClassId(
    classId || filters.classId || "",
  );
  const { data: chapters } = useAcademicChaptersForSelection(
    subjectId || filters.subjectId || "",
  );

  useEffect(() => {
    setFilters({
      search: debounceValue,
    });
    setReorderMode(false);
    setSelectedIds([]);
  }, [debounceValue, setFilters, setReorderMode, setSelectedIds]);

  const CLASS_OPTIONS =
    classes?.map((c) => ({
      value: c.id,
      label: c.displayName,
    })) || [];

  const SUBJECT_OPTIONS =
    subjects?.map((s) => ({
      value: s.id,
      label: s.displayName,
    })) || [];

  const CHAPTER_OPTIONS =
    chapters?.map((c) => ({
      value: c.id,
      label: c.displayName,
    })) || [];

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

  const handleSortChange = (value: SORT_WITH_POSITION) => {
    setFilters({
      ...filters,
      sort: value,
    });
    setReorderMode(false);
    setSelectedIds([]);
  };

  const handleClassIdChange = (value: string) => {
    setFilters({
      ...filters,
      classId: value,
      subjectId: null,
      chapterId: null,
    });
    setReorderMode(false);
    setSelectedIds([]);
  };

  const handleSubjectIdChange = (value: string) => {
    setFilters({
      ...filters,
      subjectId: value,
      chapterId: null,
    });
    setReorderMode(false);
    setSelectedIds([]);
  };

  const handleChapterIdChange = (value: string) => {
    setFilters({
      ...filters,
      chapterId: value,
    });
    setReorderMode(false);
    setSelectedIds([]);
  };

  const hasActiveFilters =
    !!filters.isActive ||
    !!filters.subjectId ||
    !!filters.sort ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE ||
    !!filters.classId ||
    !!filters.chapterId;

  const handleResetFilters = () => {
    setSearch("");
    setClassId("");
    setSubjectId("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sort: null,
      isActive: null,
      subjectId: null,
      classId: null,
      chapterId: null,
    });
    setReorderMode(false);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative w-full md:max-w-[320px] group">
            <Input
              placeholder="Search topics..."
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
            {/* Class Filter */}
            <Select
              value={filters.classId || ""}
              onValueChange={(v) => {
                handleClassIdChange(v);
                setClassId(v);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 min-w-[120px] bg-background/50 backdrop-blur-sm border-border/50 rounded-xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <BookOpen className="h-3.5 w-3.5 mr-2 text-primary/70" />
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {CLASS_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Subject Filter */}
            <Select
              value={filters.subjectId || ""}
              onValueChange={(v) => {
                handleSubjectIdChange(v);
                setSubjectId(v);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 min-w-[140px] bg-background/50 backdrop-blur-sm border-border/50 rounded-xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <Book className="h-3.5 w-3.5 mr-2 text-primary/70" />
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Chapter Filter */}
            <Select
              value={filters.chapterId || ""}
              onValueChange={(v) => {
                handleChapterIdChange(v);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 min-w-[140px] bg-background/50 backdrop-blur-sm border-border/50 rounded-xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <Book className="h-3.5 w-3.5 mr-2 text-primary/70" />
                <SelectValue placeholder="Chapter" />
              </SelectTrigger>
              <SelectContent>
                {CHAPTER_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.isActive || ""}
              onValueChange={(v) => {
                handleFilterStatusChange(v as ACTIVE_STATUS);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 min-w-[110px] bg-background/50 backdrop-blur-sm border-border/50 rounded-xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <FilterIcon className="h-3.5 w-3.5 mr-2 text-primary/70" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {activeStatusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select
              value={filters.sort || ""}
              onValueChange={(v) => {
                handleSortChange(v as SORT_WITH_POSITION);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 min-w-[110px] bg-background/50 backdrop-blur-sm border-border/50 rounded-xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <ArrowUpDown className="h-3.5 w-3.5 mr-2 text-primary/70" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent align="end">
                {sortWithPositionOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
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
          {/* Reorder Mode Toggle */}
          {showReorderMode && (
            <div className="flex items-center gap-3 px-4 h-10 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-soft">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Label
                htmlFor="reorder-mode"
                className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 cursor-pointer"
              >
                Reorder
              </Label>
              <Switch
                id="reorder-mode"
                checked={reorderMode}
                onCheckedChange={handleReorderModeChange}
                disabled={isLoading}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-border/50 bg-background/50 backdrop-blur-sm rounded-xl hover:bg-muted transition-all shadow-soft"
              disabled={isLoading}
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-border/50 bg-background/50 backdrop-blur-sm rounded-xl hover:bg-muted transition-all shadow-soft"
              disabled={isLoading}
            >
              <Upload className="h-4 w-4" />
            </Button>

            <Button
              asChild
              disabled={isLoading}
              className="h-10 px-4 bg-primary text-primary-foreground rounded-xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
            >
              <Link href="/topics/new">
                <Plus className="h-4 w-4 mr-2 stroke-[3]" />
                Add Topic
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
