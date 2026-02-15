import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../components/form";
import { Input } from "../components/input";
import { cn } from "../lib/utils";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  type?: "text" | "number" | "email" | "password";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  required?: boolean;
  hideLabel?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  showPasswordToggle?: boolean;
  description?: string;
  onChange?: (value: string) => void;
  suffix?: string;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  className,
  icon: Icon,
  iconPosition = "left",
  required = false,
  hideLabel = false,
  minLength,
  maxLength,
  min,
  max,
  showPasswordToggle = false,
  description,
  onChange,
  suffix,
}: FormInputProps<T>) {
  const { control } = useFormContext<T>();
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType =
    isPasswordField && showPasswordToggle && showPassword ? "text" : type;

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
              {suffix ? (
                <div className="flex items-center">
                  {Icon && iconPosition === "left" && (
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                  )}
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onChange?.(e.target.value);
                    }}
                    type={inputType}
                    placeholder={placeholder}
                    disabled={disabled}
                    minLength={minLength}
                    maxLength={maxLength}
                    min={min}
                    max={max}
                    className={cn(
                      "input-auth rounded-r-none",
                      Icon && iconPosition === "left" ? "pl-12" : "",
                      className,
                    )}
                  />
                  <span className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm text-muted-foreground whitespace-nowrap">
                    {suffix}
                  </span>
                </div>
              ) : (
                <>
                  {Icon && iconPosition === "left" && (
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  )}
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onChange?.(e.target.value);
                    }}
                    type={inputType}
                    placeholder={placeholder}
                    disabled={disabled}
                    minLength={minLength}
                    maxLength={maxLength}
                    min={min}
                    max={max}
                    className={cn(
                      "input-auth",
                      Icon && iconPosition === "left" ? "pl-12" : "",
                      Icon && iconPosition === "right" ? "pr-12" : "",
                      isPasswordField && showPasswordToggle ? "pr-12" : "",
                      className,
                    )}
                  />
                  {Icon && iconPosition === "right" && !isPasswordField && (
                    <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  )}
                  {isPasswordField && showPasswordToggle && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </>
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
