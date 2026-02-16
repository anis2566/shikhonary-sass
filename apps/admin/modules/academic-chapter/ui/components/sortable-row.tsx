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
        "group transition-all duration-200 border-b border-border/40",
        isSelected && "bg-primary/[0.03]",
        isDragging &&
          "bg-background/80 backdrop-blur-xl opacity-50 shadow-glow relative z-50",
        !isDragging && "hover:bg-muted/40",
      )}
      {...attributes}
    >
      <td className="px-3 py-4 w-10">
        <button
          {...listeners}
          className={cn(
            "p-1.5 rounded-lg transition-all duration-200",
            !disabled &&
              "hover:bg-primary/10 hover:text-primary cursor-grab active:cursor-grabbing text-muted-foreground/60 group-hover:text-muted-foreground",
            disabled && "opacity-20 cursor-not-allowed text-muted-foreground",
          )}
          disabled={disabled}
        >
          <GripVertical className="h-4 w-4 stroke-[2.5]" />
        </button>
      </td>
      {children}
    </tr>
  );
};
