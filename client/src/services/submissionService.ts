import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '@/firebase/config';

const functions = getFunctions(app);

export interface SubmitFlagResult {
  correct: boolean;
  alreadySolved: boolean;
  xpAwarded: number;
  newXp: number;
  newCoins: number;
  unlockedAchievements: string[];
}

/**
 * Flags are never present in client code or Firestore documents readable by
 * the client. Validation happens inside the `submitFlag` Cloud Function
 * (see /functions/src/submitFlag.ts), which is the only thing with read
 * access to the `labFlags` collection. This call just relays the guess.
 */
export async function submitFlag(labId: string, flag: string): Promise<SubmitFlagResult> {
  const callable = httpsCallable<{ labId: string; flag: string }, SubmitFlagResult>(functions, 'submitFlag');
  const res = await callable({ labId, flag: flag.trim() });
  return res.data;
}
