/**
 * Utility for retrying async operations with backoff
 */

interface RetryOptions {
  attempts?: number;
  delay?: number;
  factor?: number;
}

/**
 * Retries a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { attempts = 3, delay = 1000, factor = 2 } = options;

  let currentDelay = delay;
  let lastError: any;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= factor;
      }
    }
  }

  throw lastError;
}
