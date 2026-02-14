import { enumToOptions } from "../enum-utils.js";

/**
 * Question types for Question Bank
 * FIXED: Consistent UPPER_CASE values.
 */
export enum MCQ_TYPE {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE",
  CONTEXTUAL = "CONTEXTUAL",
}

/**
 * Boolean flag for math rendering
 */
export enum MCQ_IS_MATH {
  TRUE = "TRUE",
  FALSE = "FALSE",
}

export const mcqTypeOptions = [
  {
    value: MCQ_TYPE.SINGLE,
    label: "Single Choice",
    description: "One correct answer",
  },
  {
    value: MCQ_TYPE.MULTIPLE,
    label: "Multiple Choice",
    description: "One or more correct answers",
  },
  {
    value: MCQ_TYPE.CONTEXTUAL,
    label: "Contextual",
    description: "Based on a common passage or stem",
  },
] as const;

export const mcqIsMathOptions = enumToOptions(MCQ_IS_MATH);
