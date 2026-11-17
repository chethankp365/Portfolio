import { Redis } from "@upstash/redis";

interface RateLimitResult {
  success: boolean;
  remainingMinute: number;
  remainingHour: number;
  retryAfterSeconds?: number;
}

// In-memory sliding window store (per-instance fallback)
interface MemoryRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, MemoryRecord>();

// Cleanup stale timestamps every 5 minutes to avoid memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, rec] of memoryStore.entries()) {
      rec.timestamps = rec.timestamps.filter((t) => now - t < 3600_000);
      if (rec.timestamps.length === 0) {
        memoryStore.delete(ip);
      }
    }
  }, 300_000);
}

/**
 * Checks rate limits for a given client IP:
 * - 12 requests per minute (60,000 ms)
 * - 60 requests per hour (3,600,000 ms)
 *
 * Uses Upstash Redis if UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
 * Otherwise, seamlessly falls back to the in-memory limiter (per-instance only).
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const redis = new Redis({
        url: upstashUrl,
        token: upstashToken
      });

      const minKey = `rl:min:${ip}`;
      const hrKey = `rl:hr:${ip}`;

      // Increment counters
      const [minCount, hrCount] = await Promise.all([
        redis.incr(minKey),
        redis.incr(hrKey)
      ]);

      if (minCount === 1) await redis.expire(minKey, 60);
      if (hrCount === 1) await redis.expire(hrKey, 3600);

      const success = minCount <= 12 && hrCount <= 60;
      let retryAfter = 0;

      if (!success) {
        if (minCount > 12) {
          const ttl = await redis.ttl(minKey);
          retryAfter = Math.max(1, ttl);
        } else {
          const ttl = await redis.ttl(hrKey);
          retryAfter = Math.max(1, ttl);
        }
      }

      return {
        success,
        remainingMinute: Math.max(0, 12 - minCount),
        remainingHour: Math.max(0, 60 - hrCount),
        retryAfterSeconds: retryAfter > 0 ? retryAfter : undefined
      };
    } catch (err) {
      console.warn("[RateLimit Upstash Error, falling back to in-memory]:", err);
    }
  }

  // In-memory sliding window fallback
  const now = Date.now();
  const oneMinuteAgo = now - 60_000;
  const oneHourAgo = now - 3600_000;

  let record = memoryStore.get(ip);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(ip, record);
  }

  // Filter to timestamps in last hour
  record.timestamps = record.timestamps.filter((t) => t > oneHourAgo);

  const lastMinuteCount = record.timestamps.filter((t) => t > oneMinuteAgo).length;
  const lastHourCount = record.timestamps.length;

  if (lastMinuteCount >= 12) {
    return {
      success: false,
      remainingMinute: 0,
      remainingHour: Math.max(0, 60 - lastHourCount),
      retryAfterSeconds: 60
    };
  }

  if (lastHourCount >= 60) {
    return {
      success: false,
      remainingMinute: Math.max(0, 12 - lastMinuteCount),
      remainingHour: 0,
      retryAfterSeconds: 3600
    };
  }

  // Record this request
  record.timestamps.push(now);

  return {
    success: true,
    remainingMinute: 12 - (lastMinuteCount + 1),
    remainingHour: 60 - (lastHourCount + 1)
  };
}

