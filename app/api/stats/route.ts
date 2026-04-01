import { NextResponse } from 'next/server';

export async function GET() {
  if (!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)) {
    console.warn('[stats] KV not configured — returning 0');
    return NextResponse.json({ totalRoasts: 0 });
  }
  try {
    const { kv } = await import('@vercel/kv');
    const totalRoasts = (await kv.get<number>('totalRoasts')) ?? 0;
    return NextResponse.json({ totalRoasts });
  } catch (e) {
    console.warn('[stats] KV read failed:', e);
    return NextResponse.json({ totalRoasts: 0 });
  }
}
