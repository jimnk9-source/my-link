"use client";

import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { LinkList } from "@/components/LinkList";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

/* ─────────────────────────────────────────────
   배경 컴포넌트 (공통)
───────────────────────────────────────────── */
function Background() {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="fixed inset-0 -z-10 bg-[#fefaf2] dark:bg-background transition-colors duration-500">
      {/* 다크 모드용 그라데이션 */}
      <div
        className="absolute inset-0 opacity-60 dark:block hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, #7c3aed55 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, #2563eb33 0%, transparent 60%)",
        }}
      />
      {/* 라이트 모드용 따뜻한 파스텔 그라데이션 (연노란색 무드) */}
      <div
        className="absolute inset-0 opacity-40 dark:hidden block"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, #fbbf2415 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, #f59e0b10 0%, transparent 60%)",
        }}
      />
      {/* 미세 그리드 패턴 */}
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

        {/* 아이콘 */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl animate-bounce-slow"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            boxShadow: "0 0 60px #7c3aed44, 0 0 120px #2563eb22",
          }}
        >
          🔗
        </div>

        {/* 헤드라인 */}
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

        {/* 시작하기 버튼 */}
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
   로그인 후 마이페이지
───────────────────────────────────────────── */
function MyPage({
  uid,
  displayName,
  email,
}: {
  uid: string;
  displayName: string;
  email: string | null;
}) {
  const initial = displayName.charAt(0).toUpperCase();
  const slug = email ? email.split("@")[0] : null;

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

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              {displayName}
            </h1>
            {slug && (
              <p className="text-sm text-muted-foreground font-mono font-semibold tracking-tight">
                @{slug}
              </p>
            )}
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <LinkList uid={uid} />

        <footer className="mt-10 flex flex-col items-center gap-1">
          <p className="text-[10px] text-muted-foreground/30 font-black tracking-widest uppercase">
            Powered by
          </p>
          <span
            className="text-sm font-black tracking-tight bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent"
          >
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
  const { user, loading } = useAuth();

  return (
    <>
      <Background />
      <Header />

      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border-4 border-accent border-t-violet-500 animate-spin"
            aria-label="로딩 중"
          />
        </div>
      ) : user ? (
        <MyPage
          uid={user.uid}
          displayName={user.displayName ?? user.email ?? "사용자"}
          email={user.email}
        />
      ) : (
        <LandingScreen />
      )}
    </>
  );
}
