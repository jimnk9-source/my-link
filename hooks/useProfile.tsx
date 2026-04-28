"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  doc, 
  getDoc, 
  setDoc, 
  runTransaction,
  collectionGroup,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string | null;
  bio?: string;
  updatedAt: number;
}

export function useProfile(uid: string | undefined) {
  const queryClient = useQueryClient();

  const getProfileRef = (userId: string) => doc(db, "users", userId, "profile", "data");
  const getDisplayNameRef = (slug: string) => doc(db, "displayNames", slug.toLowerCase().trim());

  // 1. 프로필 조회 (useQuery)
  const profileQuery = useQuery({
    queryKey: ["profile", uid],
    queryFn: async () => {
      if (!uid) return null;
      const docRef = getProfileRef(uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
    },
    enabled: !!uid,
  });

  /** User name 중복 체크 */
  const checkDisplayNameUnique = async (newDisplayName: string, currentUid: string) => {
    const nameRef = getDisplayNameRef(newDisplayName);
    const nameSnap = await getDoc(nameRef);
    if (!nameSnap.exists()) return true;
    return nameSnap.data().uid === currentUid;
  };

  // 2. 프로필 업데이트 (useMutation + 낙관적 업데이트)
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      if (!uid || !profileQuery.data) throw new Error("인증 정보가 없습니다.");

      const currentProfile = profileQuery.data;

      await runTransaction(db, async (transaction) => {
        const profileRef = getProfileRef(uid);
        transaction.set(profileRef, {
          ...currentProfile,
          ...data,
          updatedAt: Date.now(),
        }, { merge: true });
      });
    },
    // 낙관적 업데이트 설정
    onMutate: async (newData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["profile", uid] });

      // 이전 상태 스냅샷
      const previousProfile = queryClient.getQueryData<UserProfile>(["profile", uid]);

      // 새 값으로 캐시 업데이트
      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(["profile", uid], {
          ...previousProfile,
          ...newData,
        });
      }

      return { previousProfile };
    },
    // 에러 발생 시 롤백
    onError: (err, newData, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(["profile", uid], context.previousProfile);
      }
    },
    // 성공/실패 여부와 관계없이 refetch
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", uid] });
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ["profile", uid] });
    }
  };

  return { 
    profile: profileQuery.data, 
    loading: profileQuery.isLoading, 
    updateProfile: updateMutation.mutateAsync, 
    checkDisplayNameUnique,
    createInitialProfile 
  };
}
