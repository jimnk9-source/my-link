"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { LinkList } from "@/components/LinkList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { useProfile, UserProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon } from "@hugeicons/core-free-icons";

/* ─────────────────────────────────────────────
   배경 컴포넌트 (공통)
───────────────────────────────────────────── */
function Background() {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="fixed inset-0 -z-10 bg-[#fefaf2] dark:bg-background transition-colors duration-500">
      <div
        className="absolute inset-0 opacity-60 dark:block hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, #7c3aed55 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, #2563eb33 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40 dark:hidden block"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, #fbbf2415 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, #f59e0b10 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   미로그인 랜딩 화면
───────────────────────────────────────────── */
function LandingScreen() {
  const { signInWithGoogle } = useAuth();
  const { resolvedTheme } = useTheme();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      <div className="w-full max-w-[440px] flex flex-col items-center gap-10 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl animate-bounce-slow"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            boxShadow: "0 0 60px #7c3aed44, 0 0 120px #2563eb22",
          }}
        >
          🔗
        </div>
        <div className="flex flex-col gap-3">
          <h1
            className="text-3xl sm:text-4xl font-black tracking-tight leading-tight"
            style={{
              background: resolvedTheme === "dark" 
                ? "linear-gradient(135deg, #ffffff 0%, #a78bfa 60%, #60a5fa 100%)"
                : "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 60%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            나만의 모든 링크를<br />단 하나의 페이지에
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-[320px] mx-auto">
            SNS, 블로그, 쇼핑몰 등 흩어져 있는 내 링크를<br />가장 세련된 방식으로 공유하세요.
          </p>
        </div>
        <Button
          onClick={signInWithGoogle}
          size="lg"
          className="h-14 px-10 text-base font-bold rounded-2xl border-0 transition-all duration-300 hover:scale-[1.05] active:scale-95 shadow-xl shadow-violet-500/25 text-white"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
          }}
        >
          Google로 시작하기
        </Button>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   로그인 후 마이페이지 (인라인 편집 포함)
───────────────────────────────────────────── */
function MyPage({
  profile,
  updateProfile,
  checkUnique,
}: {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  checkUnique: (name: string, uid: string) => Promise<boolean>;
}) {
  const initial = profile.username.charAt(0).toUpperCase();

  // 인라인 편집 상태 관리
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 편집 모드 진입
  const startEditing = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  // 저장 로직
  const handleSave = async () => {
    if (!editingField) return;
    const trimmedValue = tempValue.trim();

    // 값이 변하지 않았으면 저장하지 않고 종료
    const originalValue = profile[editingField as keyof UserProfile] as string;
    if (trimmedValue === originalValue) {
      setEditingField(null);
      return;
    }

    try {
      if (editingField === "username" && trimmedValue.length < 2) {
        throw new Error("이름은 2글자 이상이어야 합니다.");
      }

      await updateProfile({ [editingField]: trimmedValue });
      toast.success("변경사항이 저장되었습니다.");
    } catch (error: any) {
      toast.error(error.message || "저장에 실패했습니다.");
    } finally {
      setEditingField(null);
    }
  };

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editingField !== "bio") {
      handleSave();
    }
    if (e.key === "Escape") {
      setEditingField(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-24 pb-12 overflow-x-hidden">
      <div className="w-full max-w-[500px] flex flex-col gap-10">
        
        {/* ── 프로필 섹션 ── */}
        <section className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              }}
            >
              {initial}
            </div>
            <span className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-400 rounded-full border-4 border-background" />
          </div>

          <div className="flex flex-col gap-1.5 items-center w-full max-w-[320px]">
            {/* 이름 편집 */}
            {editingField === "username" ? (
              <Input
                ref={inputRef}
                autoFocus
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="text-2xl font-black text-center h-auto py-1 bg-transparent border-b-2 border-violet-500 rounded-none focus-visible:ring-0"
              />
            ) : (
              <h1 
                className="text-2xl font-black text-foreground tracking-tight cursor-pointer hover:text-violet-500 transition-colors"
                onClick={() => startEditing("username", profile.username)}
              >
                {profile.username}
              </h1>
            )}

            {/* 디스플레이 네임 (수정 불가) */}
            <p className="text-sm text-muted-foreground font-mono font-semibold tracking-tight opacity-70">
              @{profile.displayName}
            </p>

            {/* 소개글 편집 */}
            {editingField === "bio" ? (
              <Textarea
                ref={textareaRef}
                autoFocus
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="text-sm text-center min-h-[80px] bg-white/5 border-violet-500/30 rounded-xl focus-visible:ring-violet-500/20"
                placeholder="소개글을 입력하세요"
              />
            ) : (
              <p 
                className={`text-sm text-muted-foreground/70 mt-1 max-w-[280px] leading-relaxed cursor-pointer hover:text-violet-500 transition-colors ${!profile.bio && "italic text-muted-foreground/30"}`}
                onClick={() => startEditing("bio", profile.bio || "")}
              >
                {profile.bio || "소개글을 입력해 보세요."}
              </p>
            )}
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <LinkList uid={profile.uid} />

        <footer className="mt-10 flex flex-col items-center gap-1">
          <p className="text-[10px] text-muted-foreground/30 font-black tracking-widest uppercase">
            Powered by
          </p>
          <span className="text-sm font-black tracking-tight bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
            MyLink
          </span>
        </footer>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   루트 페이지 — 인증 상태에 따라 분기
───────────────────────────────────────────── */
export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, createInitialProfile, updateProfile, checkDisplayNameUnique } = useProfile(user?.uid);

  useEffect(() => {
    if (user && !profileLoading && !profile) {
      const emailId = user.email ? user.email.split("@")[0] : `user_${user.uid.slice(0, 5)}`;
      createInitialProfile({
        uid: user.uid,
        username: user.displayName ?? emailId,
        displayName: emailId,
        email: user.email,
        bio: "",
      });
    }
  }, [user, profile, profileLoading, createInitialProfile]);

  const loading = authLoading || (user && profileLoading);

  return (
    <>
      <Background />
      <Header />

      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-accent border-t-violet-500 animate-spin" />
        </div>
      ) : user && profile ? (
        <MyPage
          profile={profile}
          updateProfile={updateProfile}
          checkUnique={checkDisplayNameUnique}
        />
      ) : (
        <LandingScreen />
      )}
    </>
  );
}
