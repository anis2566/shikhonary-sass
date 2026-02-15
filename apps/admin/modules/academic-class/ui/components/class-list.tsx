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

import { AcademicClass } from "@workspace/db";
import { cn } from "@workspace/ui/lib/utils";
import { ACADEMIC_LEVEL } from "@workspace/utils/constants";

import { SortableRow } from "./sortable-row";
import { useAcademicClasses } from "@workspace/api-client";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  hideOnMobile?: boolean;
  render?: (item: T) => React.ReactNode;
}

const columns: Column<AcademicClass>[] = [
  {
    key: "displayName",
    header: "Class",
    render: (cls) => (
      <div>
        <p className="font-medium text-foreground">{cls.displayName}</p>
        <p className="text-xs text-muted-foreground">{cls.name}</p>
      </div>
    ),
  },
  {
    key: "level",
    header: "Level",
    render: (cls) => <LevelBadge level={cls.level as ACADEMIC_LEVEL} />,
  },
  {
    key: "position",
    header: "Position",
    render: (cls) => (
      <div className="flex items-center gap-2">
        <ListOrdered className="w-4 h-4" />
        <p className="text-xs">{cls.position}</p>
      </div>
    ),
    hideOnMobile: true,
  },
  {
    key: "isActive",
    header: "Status",
    render: (cls) => <StatusBadge active={cls.isActive} />,
  },
];

interface ClassListProps {
  onReorder: (items: AcademicClass[]) => void;
  disableReorder?: boolean;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  onActive: (id: string) => Promise<void>;
  handleDelete: (id: string, name: string) => void;
  onDeactivate: (id: string) => Promise<void>;
  isLoading: boolean;
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      className={cn(
        "text-xs",
        active
          ? "bg-green-100 text-green-700 hover:bg-green-100"
          : "bg-muted text-muted-foreground",
      )}
    >
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

function LevelBadge({ level }: { level: ACADEMIC_LEVEL }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        level === ACADEMIC_LEVEL.PRIMARY && "text-amber-700 hover",
        level === ACADEMIC_LEVEL.SECONDARY && "text-green-700 hover",
        level === ACADEMIC_LEVEL.HIGHER_SECONDARY && "text-blue-700 hover",
      )}
    >
      {level}
    </Badge>
  );
}

export function ClassList({
  onReorder,
  disableReorder,
  selectedIds,
  setSelectedIds,
  onActive,
  onDeactivate,
  isLoading,
  handleDelete,
}: ClassListProps) {
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

  const { data: classesData } = useAcademicClasses();

  const allSelected =
    (classesData?.items.length ?? 0) > 0 &&
    selectedIds.length === classesData?.items.length;
  const someSelected =
    selectedIds.length > 0 &&
    selectedIds.length < (classesData?.items.length ?? 0);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(classesData?.items.map((item) => item.id) ?? []);
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
      const oldIndex =
        classesData?.items.findIndex((item) => item.id === active.id) ?? 0;
      const newIndex =
        classesData?.items.findIndex((item) => item.id === over.id) ?? 0;
      const newData = arrayMove(
        classesData?.items ?? [],
        oldIndex,
        newIndex,
      ).map((item, index) => ({
        ...item,
        position: index,
      }));
      onReorder(newData);
    }
  };

  if (!classesData || classesData.items.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <p className="text-muted-foreground">No classes found</p>
      </div>
    );
  }

  const activeItem = activeId
    ? classesData?.items.find((item) => item.id === activeId)
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
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-10 px-2 py-3">
                  <span className="sr-only">Reorder</span>
                </th>
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={cn(
                      someSelected && "data-[state=checked]:bg-primary/50",
                    )}
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      "text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3",
                      column.hideOnMobile && "hidden md:table-cell",
                    )}
                  >
                    {column.header}
                  </th>
                ))}
                <th className="w-12 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <SortableContext
                items={classesData?.items.map((item) => item.id) ?? []}
                strategy={verticalListSortingStrategy}
              >
                {classesData?.items.map((item) => (
                  <SortableRow
                    key={item.id}
                    id={item.id}
                    isSelected={selectedIds.includes(item.id)}
                    disabled={disableReorder}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        aria-label={`Select item ${item.id}`}
                      />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          "px-4 py-3 text-sm",
                          column.hideOnMobile && "hidden md:table-cell",
                        )}
                      >
                        {column.render ? column.render(item) : ""}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={isLoading}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-white border border-border shadow-lg z-50"
                        >
                          <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href={`/classes/${item.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              <span>View</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href={`/classes/edit/${item.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              handleToggleActiveStatus(item.id, item.isActive)
                            }
                          >
                            {item.isActive ? (
                              <>
                                <ToggleLeft className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ToggleRight className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => handleDelete(item.id, item.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
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
          <div className="bg-card border border-primary/50 rounded-lg shadow-xl p-3 flex items-center gap-3">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {activeItem.displayName}
            </span>
            <p className="text-xs">{activeItem.position}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
