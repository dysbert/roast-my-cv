import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const feedbackPath = path.join(process.cwd(), 'data', 'feedback.json');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, comment, style, anonymousId } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    let entries: unknown[] = [];
    try {
      entries = JSON.parse(readFileSync(feedbackPath, 'utf-8'));
    } catch {
      entries = [];
    }

    entries.push({
      rating,
      comment: typeof comment === 'string' ? comment.slice(0, 1000) : '',
      style: style ?? 'unknown',
      anonymousId: typeof anonymousId === 'string' ? anonymousId.slice(0, 64) : '',
      timestamp: new Date().toISOString(),
    });

    writeFileSync(feedbackPath, JSON.stringify(entries, null, 2));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
