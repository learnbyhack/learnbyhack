import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from '@/firebase/config';
import { AppUser } from '@/types';
import { createUserProfile, getUserProfile, touchLastLogin } from '@/services/userService';

interface RegisterInput {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  firebaseUser: User | null;
  profile: AppUser | null;
  loading: boolean;
  register: (input: RegisterInput) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string, user?: User) => {
    let p = await getUserProfile(uid);
    if (!p) {
      // Auth account exists but no Firestore profile doc — this happens if
      // the account was created directly in the Firebase Console, or if the
      // profile write failed at registration time. Create one now so the
      // person isn't stuck "logged in" but treated as logged out everywhere.
      const u = user ?? auth.currentUser;
      await createUserProfile({
        uid,
        name: u?.displayName || u?.email?.split('@')[0] || 'New user',
        username: u?.email?.split('@')[0] || `user${uid.slice(0, 6)}`,
        email: u?.email || '',
      });
      p = await getUserProfile(uid);
    }
    setProfile(p);
    return p;
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await loadProfile(user.uid, user);
        touchLastLogin(user.uid).catch(() => {});
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [loadProfile]);

  const register = useCallback(async ({ name, username, email, password }: RegisterInput) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await createUserProfile({ uid: cred.user.uid, name, username, email });
    await loadProfile(cred.user.uid);
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await loadProfile(cred.user.uid);
  }, [loadProfile]);

  const logout = useCallback(async () => {
    await fbSignOut(auth);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (firebaseUser) await loadProfile(firebaseUser.uid);
  }, [firebaseUser, loadProfile]);

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, loading, register, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
