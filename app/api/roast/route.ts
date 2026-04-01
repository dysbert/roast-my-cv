import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { RoastStyle } from '@/lib/types';
import { buildPrompt, getRandomStyle } from '@/lib/prompts';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const statsPath = path.join(process.cwd(), 'data', 'stats.json');

function readStats() {
  try {
    return JSON.parse(readFileSync(statsPath, 'utf-8'));
  } catch {
    return { totalRoasts: 0, ipLimits: {} };
  }
}

function writeStats(stats: Record<string, unknown>) {
  writeFileSync(statsPath, JSON.stringify(stats));
}

function getToday() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function checkRateLimit(ip: string): boolean {
  // Returns true if the IP is allowed (under limit), false if blocked
  const stats = readStats();
  const ipLimits = stats.ipLimits ?? {};
  const today = getToday();
  const record = ipLimits[ip];

  if (!record || record.date !== today) {
    return true; // no record today → allowed
  }
  return record.count < 1;
}

function recordRoastForIp(ip: string) {
  const stats = readStats();
  const ipLimits = stats.ipLimits ?? {};
  const today = getToday();
  const record = ipLimits[ip];

  if (!record || record.date !== today) {
    ipLimits[ip] = { count: 1, date: today };
  } else {
    ipLimits[ip] = { count: record.count + 1, date: today };
  }

  stats.ipLimits = ipLimits;
  stats.totalRoasts = (stats.totalRoasts || 0) + 1;
  writeStats(stats);
}

function isAdminIp(ip: string): boolean {
  const raw = process.env.ADMIN_IPS ?? '';
  if (!raw.trim()) return false;
  return raw.split(',').map((s) => s.trim()).includes(ip);
}

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const style = formData.get('style') as RoastStyle | null;

    console.log('[roast] file:', file ? `${file.name} (${file.size} bytes)` : 'null');
    console.log('[roast] style:', style);

    if (!file || !style) {
      return NextResponse.json({ error: 'Missing file or style' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'FILE_TOO_LARGE', message: 'PDF must be under 10MB.' }, { status: 400 });
    }

    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = (forwarded ? forwarded.split(',')[0].trim() : null) ?? request.ip ?? '127.0.0.1';

    if (!isAdminIp(ip)) {
      if (!checkRateLimit(ip)) {
        return NextResponse.json(
          {
            error: 'RATE_LIMITED',
            message: "You've used your free roast for today. Come back tomorrow — or upgrade for unlimited roasts. :)",
          },
          { status: 429 }
        );
      }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Convert PDF to base64 — let Claude read it natively
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    console.log('[roast] base64 length:', base64.length);

    const resolvedStyle: Exclude<RoastStyle, 'random'> =
      style === 'random' ? getRandomStyle() : style;

    const prompt = buildPrompt(resolvedStyle);

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    console.log('[roast] Claude response length:', responseText.length);

    let roastResult;
    try {
      const cleaned = responseText.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
      roastResult = JSON.parse(cleaned);
    } catch {
      console.error('[roast] Failed to parse Claude response:', responseText.slice(0, 500));
      return NextResponse.json(
        { error: 'PARSE_ERROR', message: 'Unexpected response format from AI.' },
        { status: 500 }
      );
    }

    if (roastResult.error === 'UNREADABLE') {
      return NextResponse.json(roastResult, { status: 422 });
    }

    recordRoastForIp(ip);
    return NextResponse.json({ ...roastResult, resolvedStyle });
  } catch (error) {
    const e = error as Error;
    console.error('[roast] API error:', e.message);
    console.error('[roast] API error stack:', e.stack);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
