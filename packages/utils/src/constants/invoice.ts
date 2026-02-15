import { enumToOptions } from "../enum-utils";

/**
 * Payment status for invoices
 */
export enum INVOICE_STATUS {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export const invoiceStatusOptions = enumToOptions(INVOICE_STATUS);
