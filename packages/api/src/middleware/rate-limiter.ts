import { TRPCError } from "@trpc/server";

// Simple in-memory rate limiter
// In production, this should use Redis (ioredis) or a similar distributed store
const rates = new Map<string, { count: number; lastReset: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_MUTATIONS_PER_MINUTE = 20;

/**
 * Basic rate limiter middleware logic
 */
export function rateLimit(
  identifier: string,
  limit: number = MAX_MUTATIONS_PER_MINUTE,
) {
  const now = Date.now();
  const rate = rates.get(identifier) || { count: 0, lastReset: now };

  // Reset if window has passed
  if (now - rate.lastReset > WINDOW_MS) {
    rate.count = 0;
    rate.lastReset = now;
  }

  rate.count++;
  rates.set(identifier, rate);

  if (rate.count > limit) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Too many requests. Limit is ${limit} per minute.`,
    });
  }
}
