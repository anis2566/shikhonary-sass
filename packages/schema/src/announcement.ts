import { z } from "zod";
import { ANNOUNCEMENT_TARGET } from "@workspace/utils/constants";
import { nameSchema, uuidSchema } from "./shared/fields.js";

/**
 * Announcement Schema
 */

export const announcementFormSchema = z.object({
  title: nameSchema,
  content: z.string().min(1, "Content is required").max(2000),
  target: z.nativeEnum(ANNOUNCEMENT_TARGET),

  // Conditional targets
  academicClassId: uuidSchema.optional().nullable(),
  batchId: uuidSchema.optional().nullable(),
  recipientId: uuidSchema.optional().nullable(), // For individual targeting

  expiresAt: z.coerce.date().optional().nullable(),
  isPriority: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export const defaultAnnouncementValues: Partial<AnnouncementFormValues> = {
  title: "",
  content: "",
  target: ANNOUNCEMENT_TARGET.ALL,
  isPriority: false,
  isActive: true,
};

export const updateAnnouncementSchema = announcementFormSchema.partial();
