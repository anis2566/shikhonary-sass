import { z } from "zod";
import {
  EXAM_TYPE,
  EXAM_STATUS,
  SUBMISSION_TYPE,
} from "@workspace/utils/constants";
import { nameSchema, uuidSchema } from "./shared/fields";

/**
 * Exam Schema
 */

const baseExamFormSchema = z.object({
  title: nameSchema,
  description: z.string().max(500).optional().or(z.literal("")),
  type: z.nativeEnum(EXAM_TYPE),
  status: z.nativeEnum(EXAM_STATUS).default(EXAM_STATUS.PENDING),

  // Academic Relations
  academicClassId: uuidSchema.or(z.string().min(1, "Please select a class")),
  subjectId: uuidSchema.or(z.string().min(1, "Please select a subject")),
  chapterIds: z
    .array(z.string())
    .min(1, "Select at least one chapter")
    .optional(),
  batchIds: z.array(z.string()).min(1, "Select at least one batch"),

  // Timing
  startTime: z.coerce.date({
    errorMap: () => ({ message: "Start time is required" }),
  }),
  endTime: z.coerce.date({
    errorMap: () => ({ message: "End time is required" }),
  }),
  duration: z.coerce
    .number()
    .int()
    .min(1, "Duration must be at least 1 minute"),

  // Marks
  totalMarks: z.coerce.number().min(1, "Total marks must be at least 1"),
  passingMarks: z.coerce.number().min(0),

  // Configuration
  isStrict: z.boolean().default(true),
  submissionType: z.nativeEnum(SUBMISSION_TYPE).default(SUBMISSION_TYPE.MANUAL),
  allowLateSubmission: z.boolean().default(false),
  showResultImmediately: z.boolean().default(true),

  // Questions (for simple exams)
  questionIds: z.array(z.string()).optional(),

  isActive: z.boolean().default(true),
});

export const examFormSchema = baseExamFormSchema
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine((data) => data.passingMarks <= data.totalMarks, {
    message: "Passing marks cannot exceed total marks",
    path: ["passingMarks"],
  });

export type ExamFormValues = z.infer<typeof examFormSchema>;

export const defaultExamValues: Partial<ExamFormValues> = {
  title: "",
  description: "",
  type: EXAM_TYPE.PRACTICE,
  status: EXAM_STATUS.PENDING,
  academicClassId: "",
  subjectId: "",
  batchIds: [],
  duration: 60,
  totalMarks: 100,
  passingMarks: 33,
  isStrict: true,
  submissionType: SUBMISSION_TYPE.MANUAL,
  allowLateSubmission: false,
  showResultImmediately: true,
  isActive: true,
};

export const updateExamSchema = baseExamFormSchema.partial();
