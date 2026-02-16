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
  BookOpen,
  Edit,
  Eye,
  GripVertical,
  Layers3,
  ListOrdered,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Trash2,
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
import { AcademicTopic } from "@workspace/db";
import { cn } from "@workspace/ui/lib/utils";

import { SortableRow } from "./sortable-row";
import { useAcademicTopics } from "@workspace/api-client";

interface AcademicTopicWithRelation extends AcademicTopic {
  chapter: {
    id: string;
    displayName: string;
    subject: {
      id: string;
      displayName: string;
    };
  };
}

export interface Column<T> {
  key: keyof T | string;
  header: string;
  hideOnMobile?: boolean;
  render?: (item: T) => React.ReactNode;
}

const columns: Column<AcademicTopicWithRelation>[] = [
  {
    key: "displayName",
    header: "Topic Details",
    render: (topic) => (
      <div className="flex flex-col gap-0.5">
        <p className="font-bold text-foreground tracking-tight text-sm">
          {topic.displayName}
        </p>
        <p className="text-[10px] font-mono text-muted-foreground/60">
          {topic.name}
        </p>
      </div>
    ),
  },
  {
    key: "subject",
    header: "Subject",
    render: (topic) => (
      <div className="flex items-center gap-2">
        <BookOpen className="w-3.5 h-3.5 text-primary/70" />
        <p className="text-xs font-medium text-foreground/80">
          {topic.chapter.subject.displayName}
        </p>
      </div>
    ),
  },
  {
    key: "chapter",
    header: "Chapter",
    render: (topic) => (
      <div className="flex items-center gap-2">
        <Layers3 className="w-3.5 h-3.5 text-primary/70" />
        <p className="text-xs font-medium text-foreground/80">
          {topic.chapter.displayName}
        </p>
      </div>
    ),
  },
  {
    key: "position",
    header: "Order",
    render: (topic) => (
      <div className="flex items-center gap-1.5 bg-muted/30 w-fit px-2 py-0.5 rounded-lg border border-border/50">
        <ListOrdered className="w-3 h-3 text-primary" />
        <p className="text-[11px] font-bold text-foreground">
          {topic.position}
        </p>
      </div>
    ),
    hideOnMobile: true,
  },
  {
    key: "isActive",
    header: "Visibility",
    render: (topic) => <StatusBadge active={topic.isActive} />,
  },
];

interface TopicListProps {
  onReorder: (items: AcademicTopic[]) => void;
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
        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg transition-all",
        active
          ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
          : "bg-muted text-muted-foreground border-transparent",
      )}
    >
      <span
        className={cn(
          "size-1 rounded-full mr-1.5",
          active ? "bg-primary animate-pulse" : "bg-muted-foreground",
        )}
      />
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

export function TopicList({
  onReorder,
  disableReorder,
  selectedIds,
  setSelectedIds,
  onActive,
  onDeactivate,
  isLoading,
  handleDelete,
}: TopicListProps) {
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
  const { data } = useAcademicTopics();
  const topics = (data?.items as AcademicTopicWithRelation[]) || [];

  const allSelected = topics.length > 0 && selectedIds.length === topics.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < topics.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(topics.map((item) => item.id));
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
      const oldIndex = topics.findIndex((item) => item.id === active.id);
      const newIndex = topics.findIndex((item) => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newData = arrayMove(topics, oldIndex, newIndex).map(
          (item, index) => ({
            ...item,
            position: index + 1,
          }),
        );
        onReorder(newData);
      }
    }
  };

  if (!data?.items || data.items.length === 0) {
    return (
      <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-dashed border-border/50 p-12 text-center shadow-soft">
        <div className="size-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
          <Eye className="size-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No Topics Found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          We couldn&apos;t find any topics matching your criteria. Try adjusting
          your filters.
        </p>
      </div>
    );
  }

  const activeItem = activeId
    ? topics.find((item) => item.id === activeId)
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
      <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/50 overflow-hidden shadow-medium transition-all group/table">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="w-10 px-4 py-4">
                  <span className="sr-only">Reorder</span>
                </th>
                <th className="w-12 px-2 py-4 text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      className={cn(
                        "rounded-md border-border/50 transition-all",
                        someSelected && "data-[state=checked]:bg-primary/50",
                      )}
                    />
                  </div>
                </th>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      "text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-4 py-4",
                      column.hideOnMobile && "hidden md:table-cell",
                    )}
                  >
                    {column.header}
                  </th>
                ))}
                <th className="w-20 px-4 py-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <SortableContext
                items={topics.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {topics.map((item) => (
                  <SortableRow
                    key={item.id}
                    id={item.id}
                    isSelected={selectedIds.includes(item.id)}
                    disabled={disableReorder}
                  >
                    <td className="px-2 py-3 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={() => handleSelectItem(item.id)}
                          aria-label={`Select item ${item.id}`}
                          className="rounded-md border-border/50 transition-all"
                        />
                      </div>
                    </td>
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          "px-4 py-3 align-middle",
                          column.hideOnMobile && "hidden md:table-cell",
                        )}
                      >
                        {column.render ? column.render(item) : ""}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
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
                            <Link href={`/topics/${item.id}`}>
                              <Eye className="h-4 w-4 text-primary" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer rounded-xl font-semibold gap-2"
                            asChild
                          >
                            <Link href={`/topics/edit/${item.id}`}>
                              <Edit className="h-4 w-4 text-primary" />
                              <span>Edit Topic</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border/50 my-1" />
                          <DropdownMenuItem
                            className="cursor-pointer rounded-xl font-semibold gap-2"
                            onClick={() =>
                              handleToggleActiveStatus(item.id, item.isActive)
                            }
                          >
                            {item.isActive ? (
                              <>
                                <ToggleLeft className="h-4 w-4 text-amber-500" />
                                <span>Deactivate Topic</span>
                              </>
                            ) : (
                              <>
                                <ToggleRight className="h-4 w-4 text-green-500" />
                                <span>Activate Topic</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border/50 my-1" />
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive rounded-xl font-semibold gap-2 focus:bg-destructive/10"
                            onClick={() =>
                              handleDelete(item.id, item.displayName)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Permanently</span>
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
          <div className="bg-card/90 backdrop-blur-xl border border-primary/50 rounded-2xl shadow-2xl p-4 flex items-center gap-4 min-w-[300px]">
            <div className="p-2 bg-primary/10 rounded-xl">
              <GripVertical className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {activeItem.displayName}
              </p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                Position: {activeItem.position}
              </p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
