import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    console.warn('[stats] Redis not configured — returning 0');
    return NextResponse.json({ totalRoasts: 0 });
  }
  try {
    const total = await redis.get<number>('stats:totalRoasts');
    return NextResponse.json({ totalRoasts: total ?? 0 });
  } catch (e) {
    console.warn('[stats] Redis read failed:', e);
    return NextResponse.json({ totalRoasts: 0 });
  }
}
