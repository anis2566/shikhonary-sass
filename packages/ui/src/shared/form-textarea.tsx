import { useFormContext, type FieldValues, type Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../components/form";
import { Textarea } from "../components/textarea";
import { cn } from "../lib/utils";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  hideLabel?: boolean;
  rows?: number;
  description?: string;
  onChange?: (value: string) => void;
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
  className,
  required = false,
  hideLabel = false,
  rows = 3,
  description,
  onChange,
}: FormInputProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && !hideLabel && (
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Textarea
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e.target.value);
                }}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                className={cn("input-auth", className)}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
