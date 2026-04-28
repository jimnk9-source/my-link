"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

/* ─────────────────────────────────────────────
   타입 정의
───────────────────────────────────────────── */
interface AuthContextType {
  /** 현재 로그인된 사용자 (null = 미로그인) */
  user: User | null;
  /** 인증 상태 초기 로딩 중 여부 */
  loading: boolean;
  /** Google 팝업 로그인 */
  signInWithGoogle: () => Promise<void>;
  /** 로그아웃 */
  signOut: () => Promise<void>;
}

/* ─────────────────────────────────────────────
   Context 생성
───────────────────────────────────────────── */
const AuthContext = createContext<AuthContextType | null>(null);

/* ─────────────────────────────────────────────
   Provider
───────────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // onAuthStateChanged로 로그인 상태 실시간 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /** Google 팝업으로 로그인 */
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  /** 로그아웃 */
  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ─────────────────────────────────────────────
   커스텀 훅
───────────────────────────────────────────── */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용해야 합니다.");
  }
  return ctx;
}
