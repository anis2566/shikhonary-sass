import { CalendarIcon, type LucideIcon } from "lucide-react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { format } from "date-fns";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../components/form";
import { Button } from "../components/button";
import { Calendar } from "../components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { cn } from "../lib/utils";

interface FormCalendarProps<T extends FieldValues> {
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
  onChange?: (value: Date | undefined) => void;
  dateFormat?: string;
  disabledDates?: (date: Date) => boolean;
  fromDate?: Date;
  toDate?: Date;
}

export function FormCalendar<T extends FieldValues>({
  name,
  label,
  placeholder = "Pick a date",
  disabled = false,
  className,
  icon: Icon,
  iconPosition = "left",
  required = false,
  hideLabel = false,
  description,
  onChange,
  dateFormat = "PPP",
  disabledDates,
  fromDate,
  toDate,
}: FormCalendarProps<T>) {
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                    Icon && iconPosition === "left" ? "pl-12" : "",
                    Icon && iconPosition === "right" ? "pr-12" : "",
                    className,
                  )}
                >
                  {Icon && iconPosition === "left" && (
                    <Icon className="absolute left-4 w-5 h-5 text-muted-foreground" />
                  )}
                  {!Icon && iconPosition === "left" && (
                    <CalendarIcon className="mr-2 h-4 w-4" />
                  )}
                  {field.value ? (
                    format(new Date(field.value), dateFormat)
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  {Icon && iconPosition === "right" && (
                    <Icon className="absolute right-4 w-5 h-5 text-muted-foreground" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date ? date.toISOString() : null);
                    onChange?.(date);
                  }}
                  disabled={disabledDates}
                  fromDate={fromDate}
                  toDate={toDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
