import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

const statsPath = path.join(process.cwd(), 'data', 'stats.json');

export async function GET() {
  try {
    const raw = readFileSync(statsPath, 'utf-8');
    const stats = JSON.parse(raw);
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ totalRoasts: 0 });
  }
}
