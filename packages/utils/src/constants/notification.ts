import { enumToOptions } from "../enum-utils";

/**
 * System notification categories
 */
export enum NOTIFICATION_TYPE {
  EXAM_SCHEDULED = "EXAM_SCHEDULED",
  RESULT_PUBLISHED = "RESULT_PUBLISHED",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  REMINDER = "REMINDER",
  BILLING = "BILLING",
}

/**
 * Urgency levels for notifications
 */
export enum NOTIFICATION_PRIORITY {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

/**
 * Target audience for announcements
 */
export enum ANNOUNCEMENT_TARGET {
  ALL = "ALL",
  CLASS = "CLASS",
  BATCH = "BATCH",
  INDIVIDUAL = "INDIVIDUAL",
}

export const notificationTypeOptions = enumToOptions(NOTIFICATION_TYPE);
export const notificationPriorityOptions = enumToOptions(NOTIFICATION_PRIORITY);
export const announcementTargetOptions = enumToOptions(ANNOUNCEMENT_TARGET);
