"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Edit,
  Eye,
  GripVertical,
  Layers,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Plus,
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

import { AcademicChapter } from "@workspace/db";
import { cn } from "@workspace/ui/lib/utils";

import { SortableRow } from "./sortable-row";
import { useAcademicChapters } from "@workspace/api-client";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  hideOnMobile?: boolean;
  render?: (item: T) => React.ReactNode;
}

const columns: Column<
  AcademicChapter & { subject?: { displayName: string } }
>[] = [
  {
    key: "displayName",
    header: "Chapter",
    render: (chapter) => (
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold text-foreground tracking-tight">
          {chapter.displayName}
        </p>
        <div className="flex items-center gap-1.5">
          <code className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-widest">
            {chapter.name}
          </code>
        </div>
      </div>
    ),
  },
  {
    key: "subject",
    header: "Subject",
    render: (chapter) => (
      <Badge
        variant="outline"
        className="text-[11px] font-bold bg-primary/5 text-primary border-primary/20 rounded-lg px-2 py-0.5"
      >
        {chapter.subject?.displayName || "N/A"}
      </Badge>
    ),
  },
  {
    key: "position",
    header: "Position",
    render: (chapter) => (
      <div className="flex items-center justify-center size-6 bg-muted/50 rounded-lg border border-border/50 shadow-soft">
        <span className="text-[10px] font-bold text-muted-foreground">
          {chapter.position}
        </span>
      </div>
    ),
    hideOnMobile: true,
  },
  {
    key: "isActive",
    header: "Status",
    render: (chapter) => <StatusBadge active={chapter.isActive} />,
  },
];

interface ChapterListProps {
  onReorder: (items: AcademicChapter[]) => void;
  disableReorder?: boolean;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  onActive: (id: string) => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
  isLoading: boolean;
  handleDelete: (id: string, name: string) => void;
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      className={cn(
        "text-[11px] font-bold px-2 py-0.5 rounded-full transition-all",
        active
          ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
          : "bg-muted text-muted-foreground border-transparent",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full mr-1.5 animate-pulse",
          active ? "bg-primary" : "bg-muted-foreground",
        )}
      />
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

export function ChapterList({
  onReorder,
  disableReorder,
  selectedIds,
  setSelectedIds,
  onActive,
  onDeactivate,
  isLoading,
  handleDelete,
}: ChapterListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const { data } = useAcademicChapters();

  const chapters = data?.items || [];
  const allSelected =
    chapters.length > 0 && selectedIds.length === chapters.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < chapters.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(chapters.map((item) => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = chapters.findIndex((item) => item.id === active.id);
      const newIndex = chapters.findIndex((item) => item.id === over.id);
      const newData = arrayMove(chapters, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          position: index,
        }),
      );
      onReorder(newData);
    }
  };

  if (chapters.length === 0) {
    return (
      <div className="bg-card/50 backdrop-blur-md rounded-3xl border border-border/50 p-12 text-center shadow-medium animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <Layers className="size-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No chapters found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          It seems like you haven&apos;t added any chapters yet. Start by
          creating your first chapter.
        </p>
        <Button asChild className="mt-6 rounded-xl font-bold shadow-glow">
          <Link href="/chapters/new">
            <Plus className="size-4 mr-2 stroke-[3]" />
            Create First Chapter
          </Link>
        </Button>
      </div>
    );
  }

  const activeItem = activeId
    ? chapters.find((item) => item.id === activeId)
    : null;

  const handleToggleActiveStatus = (id: string, isActive: boolean) => {
    if (isActive) {
      onDeactivate(id);
    } else {
      onActive(id);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-card/30 backdrop-blur-xl rounded-3xl border border-border/50 overflow-hidden shadow-medium">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="w-10 px-3 py-4">
                  <span className="sr-only">Reorder</span>
                </th>
                <th className="w-12 px-4 py-4">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={cn(
                      "rounded-md border-border/50 data-[state=checked]:bg-primary transition-all",
                      someSelected && "data-[state=checked]:bg-primary/60",
                    )}
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      "text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] px-4 py-4",
                      column.hideOnMobile && "hidden md:table-cell",
                    )}
                  >
                    {column.header}
                  </th>
                ))}
                <th className="w-12 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] px-4 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              <SortableContext
                items={chapters.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {chapters.map((item) => (
                  <SortableRow
                    key={item.id}
                    id={item.id}
                    isSelected={selectedIds.includes(item.id)}
                    disabled={disableReorder}
                  >
                    <td className="px-4 py-4 text-sm">
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        aria-label={`Select item ${item.id}`}
                        className="rounded-md border-border/50 data-[state=checked]:bg-primary transition-all"
                      />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          "px-4 py-4 text-sm text-foreground",
                          column.hideOnMobile && "hidden md:table-cell",
                        )}
                      >
                        {column.render ? column.render(item) : ""}
                      </td>
                    ))}
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-muted/80 text-muted-foreground"
                            disabled={isLoading}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 backdrop-blur-xl bg-background/95 border-border shadow-medium z-50 rounded-xl p-1"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer font-medium p-2 rounded-lg"
                            asChild
                          >
                            <Link href={`/chapters/${item.id}`}>
                              <Eye className="h-4 w-4 mr-2 opacity-70" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer font-medium p-2 rounded-lg"
                            asChild
                          >
                            <Link href={`/chapters/edit/${item.id}`}>
                              <Edit className="h-4 w-4 mr-2 opacity-70" />
                              Edit Chapter
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border/50 mx-1" />
                          <DropdownMenuItem
                            className="cursor-pointer font-medium p-2 rounded-lg"
                            onClick={() =>
                              handleToggleActiveStatus(item.id, item.isActive)
                            }
                          >
                            {item.isActive ? (
                              <>
                                <ToggleLeft className="h-4 w-4 mr-2 text-amber-500 opacity-70" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ToggleRight className="h-4 w-4 mr-2 text-green-500 opacity-70" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border/50 mx-1" />
                          <DropdownMenuItem
                            className="cursor-pointer font-medium p-2 rounded-lg text-destructive focus:bg-destructive/5 focus:text-destructive"
                            onClick={() =>
                              handleDelete(item.id, item.displayName)
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-2 opacity-70" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </SortableRow>
                ))}
              </SortableContext>
            </tbody>
          </table>
        </div>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="bg-background/80 backdrop-blur-xl border border-primary/30 rounded-xl shadow-glow p-4 flex items-center justify-between min-w-[300px] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <GripVertical className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {activeItem.displayName}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Position {activeItem.position}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-bold tracking-widest border-primary/20 bg-primary/10 text-primary"
            >
              Dragging
            </Badge>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
