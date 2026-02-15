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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";

import { cn } from "../lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  required?: boolean;
  hideLabel?: boolean;
  description?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
  className,
  icon: Icon,
  iconPosition = "left",
  required = false,
  hideLabel = false,
  description,
  options,
  onChange,
}: FormSelectProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && !hideLabel && (
            <FormLabel>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              {Icon && iconPosition === "left" && (
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              )}
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onChange?.(value);
                }}
                value={field.value}
                disabled={disabled}
              >
                <SelectTrigger
                  className={cn(
                    "input-auth",
                    Icon && iconPosition === "left" ? "pl-12" : "",
                    Icon && iconPosition === "right" ? "pr-12" : "",
                    className,
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {Icon && iconPosition === "right" && (
                <Icon className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
