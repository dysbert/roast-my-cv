import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const totalRoasts = (await kv.get<number>('totalRoasts')) ?? 0;
    return NextResponse.json({ totalRoasts });
  } catch {
    return NextResponse.json({ totalRoasts: 0 });
  }
}
