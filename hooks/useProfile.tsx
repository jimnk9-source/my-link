"use client";

import { useState, useEffect } from "react";
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  updateDoc,
  runTransaction
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string; // User name (URL 슬러그)
  email: string | null;
  bio?: string;
  updatedAt: number;
}

export function useProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const getProfileRef = (userId: string) => doc(db, "users", userId, "profile", "data");
  const getDisplayNameRef = (slug: string) => doc(db, "displayNames", slug.toLowerCase().trim());

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const docRef = getProfileRef(uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  /** User name 중복 체크 (인덱스 필요 없는 방식) */
  const checkDisplayNameUnique = async (newDisplayName: string, currentUid: string) => {
    const nameRef = getDisplayNameRef(newDisplayName);
    const nameSnap = await getDoc(nameRef);
    
    if (!nameSnap.exists()) return true;
    return nameSnap.data().uid === currentUid;
  };

  /** 프로필 업데이트 (트랜잭션 사용으로 데이터 일관성 보장) */
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!uid || !profile) return;

    await runTransaction(db, async (transaction) => {
      const profileRef = getProfileRef(uid);
      
      // 1. displayName 변경 시 중복 체크 및 구버전 삭제
      if (data.displayName && data.displayName !== profile.displayName) {
        const newNameRef = getDisplayNameRef(data.displayName);
        const newNameSnap = await transaction.get(newNameRef);
        
        if (newNameSnap.exists() && newNameSnap.data().uid !== uid) {
          throw new Error("이미 사용 중인 User name입니다.");
        }

        // 새 이름 선점 및 이전 이름 삭제
        transaction.delete(getDisplayNameRef(profile.displayName));
        transaction.set(newNameRef, { uid });
      }

      // 2. 프로필 정보 업데이트
      transaction.set(profileRef, {
        ...profile,
        ...data,
        updatedAt: Date.now(),
      }, { merge: true });
    });
  };

  /** 초기 프로필 생성 */
  const createInitialProfile = async (initialData: Omit<UserProfile, "updatedAt">) => {
    const profileRef = getProfileRef(initialData.uid);
    const nameRef = getDisplayNameRef(initialData.displayName);
    
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      await runTransaction(db, async (transaction) => {
        transaction.set(profileRef, {
          ...initialData,
          updatedAt: Date.now(),
        });
        transaction.set(nameRef, { uid: initialData.uid });
      });
    }
  };

  return { 
    profile, 
    loading, 
    updateProfile, 
    checkDisplayNameUnique,
    createInitialProfile 
  };
}
