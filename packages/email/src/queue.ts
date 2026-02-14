import { Queue, Worker, Job } from "bullmq";
import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const EMAIL_QUEUE_NAME = "email-queue";

export interface EmailJobData {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export const emailQueue = new Queue<EmailJobData>(EMAIL_QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const addEmailToQueue = async (data: EmailJobData) => {
  return await emailQueue.add(`send-email-${Date.now()}`, data);
};
