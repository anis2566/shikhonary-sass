"use client";

import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle2,
  BookOpen,
  FileText,
  Hash,
  Calendar,
  Link2,
  Tag,
  Layers,
  MessageSquare,
  ExternalLink,
  Image as ImageIcon,
  Calculator,
  ToggleLeft,
  ToggleRight,
  Copy,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

export interface McqCardItem {
  id: string;
  question: string;
  options: string[];
  statements?: string[] | null;
  answer: string;
  type: string;
  reference?: string[] | null;
  explanation?: string | null;
  isMath: boolean;
  session: number;
  source?: string | null;
  questionUrl?: string | null;
  context?: string | null;
  contextUrl?: string | null;
  subjectId: string;
  chapterId: string;
  topicId?: string | null;
  subTopicId?: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Resolved relations from backend
  subject?: { displayName: string } | null;
  chapter?: { displayName: string } | null;
  topic?: { displayName: string } | null;
  subtopic?: { displayName: string } | null;
}

interface McqCardProps {
  mcq: McqCardItem;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
  onDuplicate?: () => void;
  isLoading?: boolean;
}

function TypeBadge({ type }: { type: string }) {
  const typeColors: Record<string, string> = {
    SINGLE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    MULTIPLE:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    CONTEXTUAL:
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  };

  const typeLabels: Record<string, string> = {
    SINGLE: "Single",
    MULTIPLE: "Multiple",
    CONTEXTUAL: "Contextual",
  };

  return (
    <Badge
      className={cn(
        "text-xs capitalize",
        typeColors[type] || "bg-muted text-muted-foreground",
      )}
    >
      {typeLabels[type] || type}
    </Badge>
  );
}

function OptionItem({
  option,
  index,
  isCorrect,
}: {
  option: string;
  index: number;
  isCorrect: boolean;
}) {
  const letter = String.fromCharCode(65 + index); // A, B, C, D...

  return (
    <div
      className={cn(
        "flex items-start gap-2 p-2 rounded-md text-sm transition-colors",
        isCorrect
          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          : "bg-muted/50",
      )}
    >
      <span
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
          isCorrect
            ? "bg-green-500 text-white"
            : "bg-muted-foreground/20 text-muted-foreground",
        )}
      >
        {letter}
      </span>
      <span
        className={cn(
          "flex-1 text-sm",
          isCorrect && "font-medium text-green-700 dark:text-green-400",
        )}
      >
        {option}
      </span>
      {isCorrect && (
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
      )}
    </div>
  );
}

export const McqCard = React.memo(function McqCard({
  mcq,
  selected = false,
  onSelect,
  onDelete,
  onToggleStatus,
  onDuplicate,
  isLoading,
}: McqCardProps) {
  const statements = mcq.statements ?? [];
  const options = mcq.options ?? [];
  const references = mcq.reference ?? [];

  return (
    <div
      className={cn(
        "bg-card/40 backdrop-blur-xl rounded-3xl border border-border/50 overflow-hidden shadow-soft transition-all hover:shadow-medium hover:border-primary/20 group",
        selected && "ring-2 ring-primary border-primary/40",
        !mcq.isActive && "opacity-60",
      )}
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-3">
          {onSelect && (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onSelect(mcq.id)}
              className="mt-1 rounded-md border-border/50 transition-all"
              aria-label={`Select MCQ ${mcq.id}`}
            />
          )}
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <TypeBadge type={mcq.type} />
              <Badge
                variant={mcq.isActive ? "default" : "secondary"}
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                  mcq.isActive
                    ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    : "bg-muted text-muted-foreground border-transparent",
                )}
              >
                <span
                  className={cn(
                    "size-1 rounded-full mr-1.5 inline-block",
                    mcq.isActive
                      ? "bg-primary animate-pulse"
                      : "bg-muted-foreground",
                  )}
                />
                {mcq.isActive ? "Active" : "Inactive"}
              </Badge>
              {mcq.isMath && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Calculator className="w-3 h-3" />
                  Math
                </Badge>
              )}
              <Badge variant="outline" className="text-xs gap-1">
                <Hash className="w-3 h-3" />
                {mcq.session}
              </Badge>
            </div>

            {/* Question */}
            <p className="font-semibold text-foreground leading-relaxed text-sm">
              {mcq.question}
            </p>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                disabled={isLoading}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl z-50 rounded-2xl p-1.5"
            >
              <DropdownMenuItem
                className="cursor-pointer rounded-xl font-semibold gap-2"
                asChild
              >
                <Link href={`/mcqs/${mcq.id}`}>
                  <Eye className="h-4 w-4 text-primary" />
                  <span>View Details</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-xl font-semibold gap-2"
                asChild
              >
                <Link href={`/mcqs/edit/${mcq.id}`}>
                  <Edit className="h-4 w-4 text-primary" />
                  <span>Edit MCQ</span>
                </Link>
              </DropdownMenuItem>
              {onDuplicate && (
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl font-semibold gap-2"
                  onClick={onDuplicate}
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-border/50 my-1" />
              {onToggleStatus && (
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl font-semibold gap-2"
                  onClick={onToggleStatus}
                >
                  {mcq.isActive ? (
                    <>
                      <ToggleLeft className="h-4 w-4 text-amber-500" />
                      <span>Deactivate</span>
                    </>
                  ) : (
                    <>
                      <ToggleRight className="h-4 w-4 text-green-500" />
                      <span>Activate</span>
                    </>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-border/50 my-1" />
              {onDelete && (
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive rounded-xl font-semibold gap-2 focus:bg-destructive/10"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 space-y-4">
        {/* Context */}
        {mcq.context && (
          <div className="p-3 bg-muted/50 rounded-xl border border-border/40">
            <div className="flex items-center gap-2 mb-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <FileText className="w-3 h-3" />
              Context
              {mcq.contextUrl && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={mcq.contextUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto hover:text-primary"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>View context image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{mcq.context}</p>
          </div>
        )}

        {/* Statements */}
        {statements.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <MessageSquare className="w-3 h-3" />
              Statements
            </div>
            <div className="space-y-1">
              {statements.map((statement, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm p-2 bg-muted/30 rounded-lg"
                >
                  <span className="font-bold text-muted-foreground">
                    {idx + 1}.
                  </span>
                  <span>{statement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Layers className="w-3 h-3" />
            Options
            {mcq.questionUrl && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={mcq.questionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto hover:text-primary"
                    >
                      <ImageIcon className="w-3 h-3" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>View question image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="grid gap-1.5">
            {options.map((option, idx) => (
              <OptionItem
                key={idx}
                option={option}
                index={idx}
                isCorrect={
                  option === mcq.answer ||
                  String.fromCharCode(65 + idx) === mcq.answer
                }
              />
            ))}
          </div>
        </div>

        {/* Explanation */}
        {mcq.explanation && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              <BookOpen className="w-3 h-3" />
              Explanation
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              {mcq.explanation}
            </p>
          </div>
        )}

        {/* References */}
        {references.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Link2 className="w-3 h-3" />
              Refs:
            </span>
            {references.map((ref, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {ref}
              </Badge>
            ))}
          </div>
        )}

        {/* Hierarchy tags */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/40">
          {mcq.subject?.displayName && (
            <Badge variant="secondary" className="text-xs">
              {mcq.subject.displayName}
            </Badge>
          )}
          {mcq.chapter?.displayName && (
            <Badge variant="outline" className="text-xs">
              {mcq.chapter.displayName}
            </Badge>
          )}
          {mcq.topic?.displayName && (
            <Badge variant="outline" className="text-xs bg-muted/50">
              {mcq.topic.displayName}
            </Badge>
          )}
          {mcq.subtopic?.displayName && (
            <Badge variant="outline" className="text-xs bg-muted/30">
              {mcq.subtopic.displayName}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          {mcq.source && (
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {mcq.source}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3" />
            {new Date(mcq.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
});
