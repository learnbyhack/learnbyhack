import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { AppUser } from '@/types';

const usersCol = 'users';

export interface NewUserInput {
  uid: string;
  name: string;
  username: string;
  email: string;
}

export async function createUserProfile(input: NewUserInput): Promise<void> {
  const ref = doc(db, usersCol, input.uid);
  await setDoc(ref, {
    uid: input.uid,
    name: input.name,
    username: input.username,
    email: input.email,
    role: 'user',
    xp: 0,
    coins: 0,
    level: 1,
    streak: 0,
    completedLabs: [],
    completedRoadmaps: [],
    badges: [],
    achievements: ['first-login'],
    profileImage: '',
    bio: '',
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  });
}

function coerceUser(uid: string, data: any): AppUser {
  const toMillis = (v: any) => (v instanceof Timestamp ? v.toMillis() : typeof v === 'number' ? v : Date.now());
  return {
    uid,
    name: data.name ?? '',
    username: data.username ?? '',
    email: data.email ?? '',
    role: data.role ?? 'user',
    xp: data.xp ?? 0,
    coins: data.coins ?? 0,
    level: data.level ?? 1,
    streak: data.streak ?? 0,
    completedLabs: data.completedLabs ?? [],
    completedRoadmaps: data.completedRoadmaps ?? [],
    badges: data.badges ?? [],
    achievements: data.achievements ?? [],
    profileImage: data.profileImage ?? '',
    bio: data.bio ?? '',
    createdAt: toMillis(data.createdAt),
    lastLogin: toMillis(data.lastLogin),
  };
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const ref = doc(db, usersCol, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return coerceUser(uid, snap.data());
}

export async function touchLastLogin(uid: string): Promise<void> {
  const ref = doc(db, usersCol, uid);
  await updateDoc(ref, { lastLogin: serverTimestamp() });
}

export async function updateUserProfile(uid: string, patch: Partial<Pick<AppUser, 'name' | 'bio' | 'profileImage' | 'username'>>): Promise<void> {
  const ref = doc(db, usersCol, uid);
  await updateDoc(ref, patch);
}
