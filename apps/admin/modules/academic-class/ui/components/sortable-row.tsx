"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

interface SortableRowProps {
  id: string;
  children: React.ReactNode;
  isSelected?: boolean;
  disabled?: boolean;
}

export const SortableRow = ({
  id,
  children,
  isSelected,
  disabled,
}: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/row border-b border-border/50 last:border-0 transition-all duration-200",
        "hover:bg-muted/40",
        isSelected && "bg-primary/[0.03] hover:bg-primary/[0.05]",
        isDragging && "bg-muted/80 opacity-50 shadow-medium z-50",
      )}
      {...attributes}
    >
      <td className="px-2 py-3 w-10">
        <button
          {...listeners}
          className={cn(
            "p-1.5 rounded-lg border border-transparent transition-all",
            "hover:bg-background hover:border-border hover:shadow-soft",
            "cursor-grab active:cursor-grabbing",
            disabled && "opacity-30 cursor-not-allowed",
          )}
          disabled={disabled}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground group-hover/row:text-primary transition-colors" />
        </button>
      </td>
      {children}
    </tr>
  );
};
