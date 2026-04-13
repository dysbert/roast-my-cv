import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { RoastStyle } from '@/lib/types';
import { buildPrompt, getRandomStyle } from '@/lib/prompts';
import { getRedis } from '@/lib/redis';

function getToday() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    console.warn('[roast] Redis not configured — skipping rate limit');
    return true;
  }
  try {
    const key = `ratelimit:${ip}:${getToday()}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 86400);
    return count <= 3;
  } catch (e) {
    console.warn('[roast] Redis rate limit check failed, allowing request:', e);
    return true;
  }
}

async function recordRoast() {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.incr('stats:totalRoasts');
  } catch (e) {
    console.warn('[roast] Redis stat recording failed (non-critical):', e);
  }
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

    if (file.size > 500 * 1024) {
      return NextResponse.json(
        { error: 'FILE_TOO_LARGE', message: 'Your CV is too large to process. Please try a compressed version under 500KB — a CV doesn\'t need to be that heavy either. 🔪' },
        { status: 400 }
      );
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = (forwarded ? forwarded.split(',')[0].trim() : null) ?? request.ip ?? '127.0.0.1';

    if (!isAdminIp(ip)) {
      if (!(await checkRateLimit(ip))) {
        return NextResponse.json(
          {
            error: 'RATE_LIMITED',
            message: "You've used your free roasts for today. Come back tomorrow — or upgrade for unlimited roasts. :)",
          },
          { status: 429 }
        );
      }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    console.log('[roast] base64 length:', base64.length);

    const resolvedStyle: Exclude<RoastStyle, 'random'> =
      style === 'random' ? getRandomStyle() : style;

    const prompt = buildPrompt(resolvedStyle);
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 6000,
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
      console.log('[roast] Raw response first 200 chars:', responseText.substring(0, 200));

      let cleanJson = responseText.trim();
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error('No JSON object found in response');
      }
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
      console.log('[roast] Clean JSON length:', cleanJson.length);
      console.log('[roast] Clean JSON last 200:', cleanJson.substring(cleanJson.length - 200));
      roastResult = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('[roast] Failed to parse Claude response:', responseText.slice(0, 500));
      console.error('[roast] Parse error:', parseError);
      return NextResponse.json(
        { error: 'PARSE_ERROR', message: 'Unexpected response format from AI.' },
        { status: 500 }
      );
    }

    if (roastResult.error === 'UNREADABLE') {
      return NextResponse.json(roastResult, { status: 422 });
    }

    await recordRoast();
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
