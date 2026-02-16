import { enumToOptions } from "../enum-utils";

/**
 * Active status
 */
export enum ACTIVE_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

/**
 * Standardized academic levels.
 * FIXED: Removed space in "HIGHER SECONDARY" value.
 *
 */
export enum ACADEMIC_LEVEL {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  HIGHER_SECONDARY = "HIGHER_SECONDARY",
}

/**
 * Simple sort directions
 */
export enum SORT {
  ASC = "ASC",
  DESC = "DESC",
}

/**
 * Sort options including positional sorting
 */
export enum SORT_WITH_POSITION {
  ASC = "ASC",
  DESC = "DESC",
  POSITION_ASC = "POSITION_ASC",
  POSITION_DESC = "POSITION_DESC",
}

/**
 * Academic groups
 */
export enum ACADEMIC_GROUP {
  SCIENCE = "SCIENCE",
  BUSINESS_STUDIES = "BUSINESS_STUDIES",
  HUMANITIES = "HUMANITIES",
}

/**
 * Class shifts
 */
export enum SHIFT {
  MORNING = "MORNING",
  DAY = "DAY",
  EVENING = "EVENING",
  NIGHT = "NIGHT",
}

export const academicLevelOptions = [
  { value: ACADEMIC_LEVEL.PRIMARY, label: "Primary" },
  { value: ACADEMIC_LEVEL.SECONDARY, label: "Secondary" },
  { value: ACADEMIC_LEVEL.HIGHER_SECONDARY, label: "Higher Secondary" },
] as const;

export const sortOptions = enumToOptions(SORT);
export const sortWithPositionOptions = enumToOptions(SORT_WITH_POSITION);
export const groupOptions = enumToOptions(ACADEMIC_GROUP);
export const activeStatusOptions = enumToOptions(ACTIVE_STATUS);
export const shiftOptions = enumToOptions(SHIFT);
