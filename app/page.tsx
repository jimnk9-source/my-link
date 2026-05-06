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
  const isDark = resolvedTheme === "dark";

  const features = [
    {
      emoji: "🔗",
      title: "하나의 링크로 전부",
      desc: "SNS, 블로그, 쇼핑몰, 포트폴리오까지 흩어진 모든 링크를 단 하나의 페이지에 정리하세요.",
      color: "#7c3aed",
    },
    {
      emoji: "📊",
      title: "클릭 통계 한눈에",
      desc: "방문자가 어떤 링크를 가장 많이 클릭하는지 실시간으로 확인하고 인사이트를 얻으세요.",
      color: "#2563eb",
    },
    {
      emoji: "⚡",
      title: "즉시 편집, 즉시 반영",
      desc: "클릭 한 번으로 이름, 소개글, 링크를 수정하면 공개 페이지에 즉시 반영됩니다.",
      color: "#059669",
    },
  ];

  const steps = [
    { num: "01", title: "Google로 가입", desc: "별도 회원가입 없이 Google 계정 하나로 시작하세요." },
    { num: "02", title: "링크 추가", desc: "공유하고 싶은 링크의 제목과 URL을 입력하세요." },
    { num: "03", title: "공유", desc: "mylink.app/@내이름 주소를 바이오링크로 공유하세요." },
  ];

  const mockLinks = [
    { title: "Instagram", domain: "instagram.com", emoji: "📷" },
    { title: "YouTube 채널", domain: "youtube.com", emoji: "🎬" },
    { title: "포트폴리오", domain: "notion.so", emoji: "📝" },
  ];

  return (
    <main className="flex flex-col items-center w-full overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center gap-8">

        {/* 배지 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
          </span>
          지금 바로 무료로 시작
        </div>

        {/* 타이틀 */}
        <div className="flex flex-col items-center gap-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-center">
            {/* 첫 줄: 그라데이션 텍스트 */}
            <span
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #ffffff 0%, #c4b5fd 40%, #93c5fd 100%)"
                  : "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 50%, #2563eb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              나만의 링크 페이지,
            </span>
            <br />
            {/* 둘째 줄: 5초 (밑줄) + 나머지 */}
            <span className="relative inline-block" style={{ color: isDark ? "#c4b5fd" : "#7c3aed" }}>
              5초
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                style={{ height: "8px" }}
              >
                <path
                  d="M0 6 Q25 2 50 5 Q75 8 100 4"
                  stroke="#7c3aed"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </span>
            <span
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #c4b5fd 0%, #93c5fd 100%)"
                  : "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >&nbsp;만에 만드세요</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
            Google 계정으로 로그인하고, 링크를 추가하면 끝.<br className="hidden sm:block" />
            나만의 프로필 페이지를 지금 바로 공유하세요.
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            onClick={signInWithGoogle}
            size="lg"
            className="h-14 px-10 text-base font-bold rounded-2xl border-0 transition-all duration-300 hover:scale-[1.05] active:scale-95 shadow-2xl shadow-violet-500/30 text-white w-full sm:w-auto"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google로 무료 시작하기
          </Button>
          <p className="text-xs text-muted-foreground/60">신용카드 필요 없음 · 영구 무료</p>
        </div>

        {/* 미리보기 모형 */}
        <div className="relative w-full max-w-[320px] mt-4">
          {/* 뒷 글로우 */}
          <div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-20"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
          />
          {/* 카드 */}
          <div className="relative rounded-3xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-2xl backdrop-blur-xl p-6 flex flex-col items-center gap-4">
            {/* 프로필 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
              >
                M
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-foreground">MyLink 사용자</p>
                <p className="text-xs text-muted-foreground/60 font-mono">@mylink</p>
              </div>
            </div>
            {/* 링크 목록 */}
            <div className="w-full flex flex-col gap-2">
              {mockLinks.map((link, i) => (
                <div
                  key={i}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/80 dark:bg-white/10 flex items-center justify-center text-sm shadow-sm shrink-0">
                    {link.emoji}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-foreground truncate">{link.title}</span>
                    <span className="text-[10px] text-muted-foreground/40 font-mono">{link.domain}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* 배지 */}
            <p className="text-[10px] text-muted-foreground/40 font-black tracking-widest uppercase">Powered by MyLink</p>
          </div>
          {/* 떠다니는 통계 뱃지 */}
          <div className="absolute -right-4 top-8 flex items-center gap-1.5 bg-white dark:bg-zinc-800 border border-border/40 shadow-xl rounded-2xl px-3 py-2 text-xs font-bold">
            <span className="text-base">📊</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground/60">총 클릭</span>
              <span className="font-black text-foreground tabular-nums">1,234</span>
            </div>
          </div>
          <div className="absolute -left-4 bottom-12 flex items-center gap-1.5 bg-white dark:bg-zinc-800 border border-border/40 shadow-xl rounded-2xl px-3 py-2 text-xs font-bold">
            <span className="text-base">⚡</span>
            <span className="text-foreground">즉시 반영!</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          기능 소개
      ══════════════════════════════════════ */}
      <section className="w-full max-w-5xl px-4 py-20 flex flex-col items-center gap-12">
        <div className="text-center flex flex-col gap-3">
          <p className="text-xs font-black tracking-widest uppercase text-violet-500">Features</p>
          <h2
            className="text-2xl sm:text-3xl font-black tracking-tight"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #ffffff, #a78bfa)"
                : "linear-gradient(135deg, #1e1b4b, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            필요한 기능만, 딱 맞게
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            복잡한 설정 없이, 링크 공유에 집중할 수 있도록 설계했어요.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative rounded-3xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-sm backdrop-blur-md p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* 호버 글로우 */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl"
                style={{ background: f.color }}
              />
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md relative z-10"
                style={{ background: `${f.color}22`, border: `1px solid ${f.color}33` }}
              >
                {f.emoji}
              </div>
              <div className="flex flex-col gap-1.5 relative z-10">
                <h3 className="text-base font-black text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          사용 방법
      ══════════════════════════════════════ */}
      <section className="w-full max-w-5xl px-4 py-20 flex flex-col items-center gap-12">
        <div className="text-center flex flex-col gap-3">
          <p className="text-xs font-black tracking-widest uppercase text-blue-500">How it works</p>
          <h2
            className="text-2xl sm:text-3xl font-black tracking-tight"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #ffffff, #93c5fd)"
                : "linear-gradient(135deg, #1e1b4b, #2563eb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            딱 3단계면 끝나요
          </h2>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          {/* 연결선 (데스크탑) */}
          <div className="hidden sm:block absolute top-8 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-violet-500/40 via-violet-500/20 to-violet-500/40" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center sm:items-center text-center gap-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white shadow-xl relative z-10"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
              >
                {step.num}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-black text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          하단 CTA
      ══════════════════════════════════════ */}
      <section className="w-full px-4 py-20 flex justify-center">
        <div
          className="w-full max-w-3xl rounded-3xl p-10 sm:p-16 flex flex-col items-center gap-6 text-center text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            boxShadow: "0 20px 60px -10px rgba(124,58,237,0.4)",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 30%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 80%, #fff 0%, transparent 40%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <p className="text-sm font-bold text-white/70 tracking-widest uppercase relative z-10">
            지금 시작하기
          </p>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight relative z-10">
            내 링크를 하나로 묶을 시간 🔗
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-md relative z-10">
            무료로 시작하고, 언제든지 수정하세요.<br />
            지금 바로 나만의 페이지를 만들어 보세요.
          </p>
          <Button
            onClick={signInWithGoogle}
            size="lg"
            className="h-14 px-10 text-base font-bold rounded-2xl border-0 bg-white text-violet-600 hover:bg-white/90 active:scale-95 shadow-xl transition-all duration-300 hover:scale-[1.03] relative z-10 w-full sm:w-auto"
          >
            Google로 시작하기 →
          </Button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="w-full flex flex-col items-center gap-1 py-8">
        <p className="text-[10px] text-muted-foreground/30 font-black tracking-widest uppercase">
          Powered by
        </p>
        <span className="text-sm font-black tracking-tight bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
          MyLink
        </span>
      </footer>

    </main>
  );
}

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
