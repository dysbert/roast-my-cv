import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, comment, style, anonymousId } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    const entry = {
      rating,
      comment: typeof comment === 'string' ? comment.slice(0, 1000) : '',
      style: style ?? 'unknown',
      anonymousId: typeof anonymousId === 'string' ? anonymousId.slice(0, 64) : '',
      timestamp: new Date().toISOString(),
    };

    if (!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)) {
      console.warn('[feedback] KV not configured — feedback not persisted');
      return NextResponse.json({ ok: true });
    }

    try {
      const { kv } = await import('@vercel/kv');
      await kv.lpush('feedback', JSON.stringify(entry));
    } catch (e) {
      console.warn('[feedback] KV write failed (non-critical):', e);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
