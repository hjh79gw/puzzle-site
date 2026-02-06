import { NextRequest, NextResponse } from 'next/server';

interface LeaderboardEntry {
  nickname: string;
  time: number;
  moves: number;
  date: string;
}

// In-memory fallback when Vercel KV is not available
const memoryStore = new Map<string, LeaderboardEntry[]>();

async function getKV() {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return null;
    }
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch {
    return null;
  }
}

function makeKey(imageId: string, gridSize: number) {
  return `lb:${imageId}:${gridSize}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get('imageId');
  const gridSize = Number(searchParams.get('gridSize'));

  if (!imageId || !gridSize) {
    return NextResponse.json({ entries: [] });
  }

  const key = makeKey(imageId, gridSize);

  try {
    const kv = await getKV();
    if (kv) {
      const entries = (await kv.get<LeaderboardEntry[]>(key)) || [];
      return NextResponse.json({ entries: entries.slice(0, 20) });
    }
    // Fallback to memory
    const entries = memoryStore.get(key) || [];
    return NextResponse.json({ entries: entries.slice(0, 20) });
  } catch {
    return NextResponse.json({ entries: memoryStore.get(key)?.slice(0, 20) || [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageId, gridSize, nickname, time, moves } = body;

    // Validate
    if (!imageId || !gridSize || !nickname || time === undefined || moves === undefined) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const trimmedNickname = String(nickname).trim();
    if (trimmedNickname.length < 2 || trimmedNickname.length > 12) {
      return NextResponse.json({ error: 'Nickname must be 2-12 characters' }, { status: 400 });
    }

    if (typeof time !== 'number' || time < 5) {
      return NextResponse.json({ error: 'Invalid time' }, { status: 400 });
    }

    const entry: LeaderboardEntry = {
      nickname: trimmedNickname,
      time,
      moves,
      date: new Date().toISOString(),
    };

    const key = makeKey(imageId, gridSize);

    try {
      const kv = await getKV();
      if (kv) {
        const existing = (await kv.get<LeaderboardEntry[]>(key)) || [];
        existing.push(entry);
        existing.sort((a, b) => a.time - b.time);
        const trimmed = existing.slice(0, 100);
        await kv.set(key, trimmed);
        return NextResponse.json({ success: true, rank: trimmed.findIndex(e => e === entry) + 1 });
      }
    } catch {
      // Fall through to memory store
    }

    // Memory fallback
    const existing = memoryStore.get(key) || [];
    existing.push(entry);
    existing.sort((a, b) => a.time - b.time);
    const trimmed = existing.slice(0, 100);
    memoryStore.set(key, trimmed);

    const rank = trimmed.findIndex(
      (e) => e.nickname === entry.nickname && e.time === entry.time && e.date === entry.date
    ) + 1;

    return NextResponse.json({ success: true, rank });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
