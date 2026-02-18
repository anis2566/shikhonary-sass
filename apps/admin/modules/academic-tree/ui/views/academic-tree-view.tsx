"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  GraduationCap,
  BookText,
  FileText,
  Hash,
  Layers,
  Circle,
  ExternalLink,
  Search,
  Expand,
  Shrink,
  X,
  BookOpen,
  Network,
} from "lucide-react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

import { useAcademicCounts, useAcademicHierarchy } from "@workspace/api-client";

// ============================================================================
// Stat Card (matches academic-class StatsCard design)
// ============================================================================

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-primary",
  bgColor = "bg-primary/10",
}: StatCardProps) => (
  <div
    className={cn(
      "bg-card/50 backdrop-blur-md rounded-2xl border border-border/50 p-5 lg:p-6 transition-all duration-300",
      "hover:shadow-glow hover:border-primary/20",
    )}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
          {title}
        </p>
        <p className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
          {value}
        </p>
      </div>
      <div className={cn("p-3 rounded-xl shadow-soft", bgColor, color)}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

// ============================================================================
// Tree Node
// ============================================================================

interface TreeNodeProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  level: number;
  isActive: boolean;
  children?: React.ReactNode;
  count?: number;
  defaultOpen?: boolean;
  searchMatch?: boolean;
  href?: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  label,
  icon,
  iconBg,
  iconBorder,
  level,
  isActive,
  children,
  count,
  defaultOpen = false,
  searchMatch = false,
  href,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2.5 py-2 px-3 rounded-xl cursor-pointer transition-all duration-200 group",
          "hover:bg-muted/60",
          searchMatch && "bg-primary/[0.07] ring-1 ring-primary/20",
          !isActive && "opacity-50",
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
      >
        {/* Expand/Collapse toggle */}
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          {hasChildren ? (
            <div className="p-0.5 hover:bg-muted rounded-md transition-colors">
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
          ) : (
            <Circle className="h-1.5 w-1.5 text-muted-foreground/40" />
          )}
        </div>

        {/* Icon */}
        <div
          className={cn(
            "p-1.5 rounded-lg border-l-2 shrink-0 transition-all",
            iconBg,
            iconBorder,
          )}
        >
          {icon}
        </div>

        {/* Label */}
        <span
          className={cn(
            "flex-1 text-sm font-medium truncate",
            searchMatch && "text-primary font-semibold",
          )}
        >
          {label}
        </span>

        {/* Child count badge */}
        {count !== undefined && count > 0 && (
          <Badge
            variant="secondary"
            className="text-[10px] font-bold px-1.5 py-0 h-4 bg-muted/80 text-muted-foreground border-0 shrink-0"
          >
            {count}
          </Badge>
        )}

        {/* Active status */}
        <Badge
          className={cn(
            "text-[10px] font-black uppercase tracking-wider px-2 py-0 h-4 border shrink-0",
            isActive
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-muted/50 text-muted-foreground border-transparent",
          )}
        >
          {isActive ? "Active" : "Off"}
        </Badge>

        {/* External link */}
        {href && (
          <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-primary/10 hover:text-primary rounded-lg"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        )}
      </div>

      {/* Children */}
      {hasChildren && isOpen && (
        <div className="relative ml-[22px] border-l border-border/40 pl-2">
          {children}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Skeleton loader
// ============================================================================

const TreeSkeleton = () => (
  <div className="space-y-2 p-2">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-1.5">
        <Skeleton
          className="h-10 rounded-xl"
          style={{ width: `${100 - i * 5}%` }}
        />
        {i < 2 && (
          <div className="ml-8 space-y-1.5">
            {[...Array(2)].map((_, j) => (
              <Skeleton
                key={j}
                className="h-9 rounded-xl"
                style={{ width: `${90 - j * 5}%` }}
              />
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

// ============================================================================
// Legend item
// ============================================================================

const LegendItem = ({
  icon,
  label,
  bg,
  border,
}: {
  icon: React.ReactNode;
  label: string;
  bg: string;
  border: string;
}) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <div className={cn("p-1 rounded-md border-l-2", bg, border)}>{icon}</div>
    <span className="font-medium">{label}</span>
  </div>
);

// ============================================================================
// Main View
// ============================================================================

export const AcademicTreeView = () => {
  const [search, setSearch] = useState("");
  const [expandAll, setExpandAll] = useState(false);

  const { data, isLoading } = useAcademicHierarchy({
    search: search.length > 2 ? search : undefined,
  });
  const { hierarchy = [], summary } = data || {};

  const { data: counts } = useAcademicCounts();

  const matchesSearch = (text: string) => {
    if (!search || search.length <= 2) return false;
    return text.toLowerCase().includes(search.toLowerCase());
  };

  return (
    <div className="min-h-screen p-4 space-y-6 animate-in fade-in duration-300">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Classes"
          value={counts?.classes ?? 0}
          icon={GraduationCap}
        />
        <StatCard
          title="Subjects"
          value={counts?.subjects ?? 0}
          icon={BookText}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          title="Chapters"
          value={counts?.chapters ?? 0}
          icon={FileText}
          color="text-green-500"
          bgColor="bg-green-500/10"
        />
        <StatCard
          title="Topics"
          value={counts?.topics ?? 0}
          icon={Hash}
          color="text-yellow-500"
          bgColor="bg-yellow-500/10"
        />
        <StatCard
          title="Sub-Topics"
          value={counts?.subtopics ?? 0}
          icon={Layers}
          color="text-orange-500"
          bgColor="bg-orange-500/10"
        />
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm group">
          <Input
            placeholder="Search hierarchy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10 h-11 bg-background/50 backdrop-blur-sm border-border/50 rounded-2xl focus:bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-soft placeholder:text-muted-foreground/50 font-medium"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
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

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandAll(true)}
            className="h-11 px-4 border-border/50 bg-background/50 backdrop-blur-sm rounded-2xl hover:bg-muted transition-all shadow-soft font-semibold"
          >
            <Expand className="h-4 w-4 mr-2" />
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandAll(false)}
            className="h-11 px-4 border-border/50 bg-background/50 backdrop-blur-sm rounded-2xl hover:bg-muted transition-all shadow-soft font-semibold"
          >
            <Shrink className="h-4 w-4 mr-2" />
            Collapse
          </Button>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-4 px-4 py-3 bg-muted/30 backdrop-blur-sm rounded-2xl border border-border/50">
        <LegendItem
          icon={<GraduationCap className="h-3 w-3 text-primary" />}
          label="Class"
          bg="bg-primary/10"
          border="border-l-primary"
        />
        <LegendItem
          icon={<BookText className="h-3 w-3 text-blue-500" />}
          label="Subject"
          bg="bg-blue-500/10"
          border="border-l-blue-500"
        />
        <LegendItem
          icon={<FileText className="h-3 w-3 text-green-500" />}
          label="Chapter"
          bg="bg-green-500/10"
          border="border-l-green-500"
        />
        <LegendItem
          icon={<Hash className="h-3 w-3 text-yellow-500" />}
          label="Topic"
          bg="bg-yellow-500/10"
          border="border-l-yellow-500"
        />
        <LegendItem
          icon={<Layers className="h-3 w-3 text-orange-500" />}
          label="Sub-Topic"
          bg="bg-orange-500/10"
          border="border-l-orange-500"
        />
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <ExternalLink className="h-3 w-3" />
          <span className="font-medium">Hover a row to navigate</span>
        </div>
      </div>

      {/* ── Tree ── */}
      <div className="bg-card/50 backdrop-blur-md rounded-2xl border border-border/50 shadow-soft overflow-hidden">
        {/* Tree header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold">Academic Hierarchy</p>
            <p className="text-xs text-muted-foreground">
              {summary
                ? `${summary.totalClasses} classes · ${summary.totalSubjects} subjects · ${summary.totalChapters} chapters`
                : "Full nested structure"}
            </p>
          </div>
          {search.length > 2 && (
            <Badge className="ml-auto text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-primary/10 text-primary border border-primary/20">
              Filtering
            </Badge>
          )}
        </div>

        {/* Tree body */}
        <div
          className="p-2 overflow-auto max-h-[calc(100vh-420px)]"
          key={expandAll ? "expanded" : "collapsed"}
        >
          {isLoading ? (
            <TreeSkeleton />
          ) : hierarchy.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-muted/50 rounded-2xl mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                {search.length > 2 ? "No results found" : "No classes yet"}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {search.length > 2
                  ? "Try a different search term"
                  : "Add classes to see the hierarchy"}
              </p>
            </div>
          ) : (
            hierarchy.map((cls) => (
              <TreeNode
                key={cls.id}
                id={cls.id}
                label={`${cls.displayName} (${cls.level})`}
                icon={<GraduationCap className="h-3.5 w-3.5 text-primary" />}
                iconBg="bg-primary/10"
                iconBorder="border-l-primary"
                level={0}
                isActive={cls.isActive}
                count={(cls as any).subjects?.length}
                defaultOpen={expandAll || matchesSearch(cls.displayName)}
                searchMatch={matchesSearch(cls.displayName)}
                href={`/classes/${cls.id}`}
              >
                {(cls as any).subjects?.map((subject: any) => (
                  <TreeNode
                    key={subject.id}
                    id={subject.id}
                    label={subject.displayName}
                    icon={<BookText className="h-3.5 w-3.5 text-blue-500" />}
                    iconBg="bg-blue-500/10"
                    iconBorder="border-l-blue-500"
                    level={1}
                    isActive={subject.isActive}
                    count={subject.chapters?.length}
                    defaultOpen={
                      expandAll || matchesSearch(subject.displayName)
                    }
                    searchMatch={matchesSearch(subject.displayName)}
                    href={`/subjects/${subject.id}`}
                  >
                    {subject.chapters?.map((chapter: any) => (
                      <TreeNode
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.displayName}
                        icon={
                          <FileText className="h-3.5 w-3.5 text-green-500" />
                        }
                        iconBg="bg-green-500/10"
                        iconBorder="border-l-green-500"
                        level={2}
                        isActive={chapter.isActive}
                        count={chapter.topics?.length}
                        defaultOpen={
                          expandAll || matchesSearch(chapter.displayName)
                        }
                        searchMatch={matchesSearch(chapter.displayName)}
                        href={`/chapters/${chapter.id}`}
                      >
                        {chapter.topics?.map((topic: any) => (
                          <TreeNode
                            key={topic.id}
                            id={topic.id}
                            label={topic.displayName}
                            icon={
                              <Hash className="h-3.5 w-3.5 text-yellow-500" />
                            }
                            iconBg="bg-yellow-500/10"
                            iconBorder="border-l-yellow-500"
                            level={3}
                            isActive={topic.isActive}
                            count={
                              topic.subTopics?.length ?? topic.subtopics?.length
                            }
                            defaultOpen={
                              expandAll || matchesSearch(topic.displayName)
                            }
                            searchMatch={matchesSearch(topic.displayName)}
                            href={`/topics/${topic.id}`}
                          >
                            {(topic.subTopics ?? topic.subtopics)?.map(
                              (subTopic: any) => (
                                <TreeNode
                                  key={subTopic.id}
                                  id={subTopic.id}
                                  label={subTopic.displayName}
                                  icon={
                                    <Layers className="h-3.5 w-3.5 text-orange-500" />
                                  }
                                  iconBg="bg-orange-500/10"
                                  iconBorder="border-l-orange-500"
                                  level={4}
                                  isActive={subTopic.isActive}
                                  searchMatch={matchesSearch(
                                    subTopic.displayName,
                                  )}
                                  href={`/subtopics/${subTopic.id}`}
                                />
                              ),
                            )}
                          </TreeNode>
                        ))}
                      </TreeNode>
                    ))}
                  </TreeNode>
                ))}
              </TreeNode>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
