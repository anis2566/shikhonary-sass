import { type LucideIcon } from "lucide-react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../components/form";
import { Checkbox } from "../components/checkbox";
import { cn } from "../lib/utils";

interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  className?: string;
  icon?: LucideIcon;
  required?: boolean;
  hideLabel?: boolean;
  description?: string;
  onChange?: (value: boolean) => void;
  labelClassName?: string;
  side?: "left" | "right";
}

export function FormCheckbox<T extends FieldValues>({
  name,
  label,
  disabled = false,
  className,
  icon: Icon,
  required = false,
  hideLabel = false,
  description,
  onChange,
  labelClassName,
  side = "right",
}: FormCheckboxProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start space-x-3 space-y-0",
            className,
          )}
        >
          {side === "left" && label && !hideLabel && (
            <div className="flex items-center gap-2 flex-1">
              {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
              <FormLabel
                className={cn("font-normal cursor-pointer", labelClassName)}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            </div>
          )}

          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                onChange?.(checked as boolean);
              }}
              disabled={disabled}
            />
          </FormControl>

          {side === "right" && (
            <div className="space-y-1 leading-none flex-1">
              {label && !hideLabel && (
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
                  <FormLabel
                    className={cn("font-normal cursor-pointer", labelClassName)}
                  >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                </div>
              )}
              {description && (
                <FormDescription className="text-xs">
                  {description}
                </FormDescription>
              )}
            </div>
          )}

          {side === "left" && description && (
            <FormDescription className="text-xs mt-2">
              {description}
            </FormDescription>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
