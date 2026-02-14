/**
 * Currency and data formatting helpers
 */

/**
 * Formats a number/string into a currency string (BDT/USD/etc).
 * @param amount Amount in paisa/cents (integer)
 * @param currency Currency code (default: BDT)
 */
export const formatCurrency = (
  amount: number | string,
  currency: "BDT" | "USD" = "BDT",
  locale: string = "en-BD",
) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  // Assuming amount is in lowest unit (paisa/cents)
  const mainUnitAmount = numericAmount / 100;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(mainUnitAmount);
};

/**
 * Standard date formatter
 */
export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";
  return new Intl.DateTimeFormat("en-GB", options).format(d);
};

/**
 * Truncates text with an ellipsis
 */
export const truncate = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};
