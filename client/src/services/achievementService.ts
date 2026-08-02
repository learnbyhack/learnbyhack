import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function grantAchievement(uid: string, achievementId: string): Promise<void> {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { achievements: arrayUnion(achievementId) });
}
