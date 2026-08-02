import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { LeaderboardEntry } from '@/types';

export async function fetchLeaderboard(top = 50): Promise<LeaderboardEntry[]> {
  const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(top));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      name: data.name ?? 'Anonymous',
      username: data.username ?? 'anonymous',
      profileImage: data.profileImage ?? '',
      xp: data.xp ?? 0,
      coins: data.coins ?? 0,
      completedLabs: (data.completedLabs ?? []).length,
      level: data.level ?? 1,
    };
  });
}
