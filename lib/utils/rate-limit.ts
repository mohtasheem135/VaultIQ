import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Singleton Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Ingest: 10 uploads per user per minute
export const ingestRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "vaultiq:ingest",
});

// Search: 30 searches per user per minute
export const searchRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "vaultiq:search",
});

// Auth: 5 attempts per IP per 15 minutes
export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "vaultiq:auth",
});

// Helper — extracts a usable identifier from the request
export function getRateLimitIdentifier(
  request: Request,
  userId?: string
): string {
  if (userId) return userId;
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous"
  );
}
