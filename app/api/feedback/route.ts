import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, comment, style, anonymousId } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    const entry = JSON.stringify({
      rating,
      comment: typeof comment === 'string' ? comment.slice(0, 1000) : '',
      style: style ?? 'unknown',
      anonymousId: typeof anonymousId === 'string' ? anonymousId.slice(0, 64) : '',
      timestamp: Date.now(),
    });

    const redis = getRedis();
    if (!redis) {
      console.warn('[feedback] Redis not configured — feedback not persisted');
      return NextResponse.json({ ok: true });
    }

    try {
      await redis.lpush('feedback', entry);
    } catch (e) {
      console.warn('[feedback] Redis write failed (non-critical):', e);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
