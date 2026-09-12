// Minimal in-memory rate limiter, good enough for a single-instance MVP deploy.
// For production on serverless/multi-instance hosting, swap this for a durable
// store (e.g. Upstash Redis) so limits are shared across instances.

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 8;

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - bucket.count };
}
