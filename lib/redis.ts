import { Redis } from '@upstash/redis';

let _redis: Redis | null = null;

export function getRedis(): Redis | null {
  // Support both Upstash-direct names and Vercel KV names (same Upstash instance)
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!(url && token)) return null;

  if (!_redis) {
    _redis = new Redis({ url, token });
  }
  return _redis;
}
