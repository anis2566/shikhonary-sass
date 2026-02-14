import { z } from "zod";
import { MCQ_TYPE, MCQ_IS_MATH } from "@workspace/utils/constants";
import { uuidSchema } from "./shared/fields.js";

/**
 * MCQ (Multiple Choice Question) Schema
 */

export const mcqFormSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  chapterId: uuidSchema.or(z.string().min(1, "Chapter is required")),
  subjectId: uuidSchema.or(z.string().min(1, "Subject is required")),
  topicId: uuidSchema.optional().or(z.literal("")),
  subTopicId: uuidSchema.optional().or(z.literal("")),
  options: z
    .array(z.string().min(1, "Option content is required"))
    .min(2, "At least 2 options are required"),
  type: z.nativeEnum(MCQ_TYPE).default(MCQ_TYPE.SINGLE),
  isMath: z.boolean().default(false),
  reference: z.array(z.string()).optional().default([]),
  explanation: z.string().optional().or(z.literal("")),
  context: z.string().optional().or(z.literal("")),
  statements: z.array(z.string()).optional().default([]),
  session: z.coerce
    .number()
    .int()
    .min(1900, "Invalid session")
    .max(2100, "Invalid session")
    .default(new Date().getFullYear()),
  source: z.string().optional().or(z.literal("")),
});

export type MCQFormValues = z.infer<typeof mcqFormSchema>;

export const defaultMCQValues: MCQFormValues = {
  question: "",
  answer: "",
  chapterId: "",
  subjectId: "",
  topicId: "",
  subTopicId: "",
  options: ["", "", "", ""],
  type: MCQ_TYPE.SINGLE,
  isMath: false,
  reference: [],
  explanation: "",
  context: "",
  statements: [],
  session: new Date().getFullYear(),
  source: "",
};

export const updateMCQSchema = mcqFormSchema.partial();

export const mcqSchema = mcqFormSchema.extend({
  id: uuidSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MCQ = z.infer<typeof mcqSchema>;
