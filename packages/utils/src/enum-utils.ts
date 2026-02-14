/**
 * Utility function to convert a TypeScript enum into an array of options
 * for UI components (e.g., Select, RadioGroup).
 *
 * @example
 * enum ROLE { ADMIN = "ADMIN", USER = "USER" }
 * const options = enumToOptions(ROLE);
 * // => [{ value: "ADMIN", label: "Admin" }, { value: "USER", label: "User" }]
 */
export function enumToOptions<T extends Record<string, string | number>>(
  enumObj: T,
  labelOverrides: Partial<Record<keyof T, string>> = {},
): readonly { value: string | number; label: string }[] {
  return Object.entries(enumObj)
    .filter(([key]) => isNaN(Number(key))) // Filter out numeric keys from numeric enums
    .map(([key, value]) => ({
      value,
      label: labelOverrides[key as keyof T] || formatEnumKey(key),
    }));
}

/**
 * Formats an enum key into a human-readable label.
 * "SUPER_ADMIN" => "Super Admin"
 */
function formatEnumKey(key: string): string {
  return key
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
