import { enumToOptions } from "../enum-utils.js";

/**
 * Types of structured exams
 */
export enum EXAM_TYPE {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  TERM = "TERM",
  MOCK = "MOCK",
  PRACTICE = "PRACTICE",
}

/**
 * Admin lifecycle status of an exam
 */
export enum EXAM_STATUS {
  PENDING = "PENDING",
  PUBLISHED = "PUBLISHED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

/**
 * User attempt lifecycle status
 */
export enum EXAM_ATTEMPT_STATUS {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  AUTO_SUBMITTED = "AUTO_SUBMITTED",
  ABANDONED = "ABANDONED",
}

/**
 * Trigger source for exam submission
 */
export enum SUBMISSION_TYPE {
  MANUAL = "MANUAL",
  AUTO_TIMEUP = "AUTO_TIMEUP",
  AUTO_TAB_SWITCH = "AUTO_TAB_SWITCH",
}

export const examTypeOptions = enumToOptions(EXAM_TYPE);
export const examStatusOptions = enumToOptions(EXAM_STATUS);
export const attemptStatusOptions = enumToOptions(EXAM_ATTEMPT_STATUS);
export const submissionTypeOptions = enumToOptions(SUBMISSION_TYPE);
