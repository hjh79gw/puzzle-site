import { challengeImages } from '@/data/challenge-images';

interface LeaderboardEntry {
  nickname: string;
  time: number;
  moves: number;
  date: string;
}

const GRID_SIZES = [3, 4, 5] as const;

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

export async function getLeaderboardEntries(
  imageId: string,
  gridSize: number,
  limit = 5
): Promise<LeaderboardEntry[]> {
  const key = makeKey(imageId, gridSize);
  try {
    const kv = await getKV();
    if (kv) {
      const entries = (await kv.get<LeaderboardEntry[]>(key)) || [];
      return entries.slice(0, limit);
    }
  } catch {
    // fall through
  }
  return [];
}

export interface LeaderboardStats {
  totalGames: number;
  averageTime: number;
  bestTime: number;
  bestPlayer: string;
}

export async function getAllLeaderboards(): Promise<
  Record<string, Record<number, LeaderboardEntry[]>>
> {
  const result: Record<string, Record<number, LeaderboardEntry[]>> = {};

  for (const img of challengeImages) {
    result[img.id] = {};
    for (const size of GRID_SIZES) {
      result[img.id][size] = await getLeaderboardEntries(img.id, size, 5);
    }
  }

  return result;
}

export function computeStats(
  allBoards: Record<string, Record<number, LeaderboardEntry[]>>
): LeaderboardStats {
  let totalGames = 0;
  let totalTime = 0;
  let bestTime = Infinity;
  let bestPlayer = '';

  for (const imageId of Object.keys(allBoards)) {
    for (const size of Object.keys(allBoards[imageId])) {
      const entries = allBoards[imageId][Number(size)];
      totalGames += entries.length;
      for (const entry of entries) {
        totalTime += entry.time;
        if (entry.time < bestTime) {
          bestTime = entry.time;
          bestPlayer = entry.nickname;
        }
      }
    }
  }

  return {
    totalGames,
    averageTime: totalGames > 0 ? Math.round(totalTime / totalGames) : 0,
    bestTime: bestTime === Infinity ? 0 : bestTime,
    bestPlayer,
  };
}
