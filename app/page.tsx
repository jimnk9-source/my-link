"use client";

import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { LinkList } from "@/components/LinkList";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────
   배경 컴포넌트 (공통)
───────────────────────────────────────────── */
function Background() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a0f]">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, #7c3aed55 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, #2563eb33 0%, transparent 60%)",
        }}
      />
      {/* 미세 그리드 패턴 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      <div className="w-full max-w-[440px] flex flex-col items-center gap-10 text-center">

        {/* 아이콘 */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl"
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
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 60%, #60a5fa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            나만의 링크 페이지를<br />지금 바로 만들어보세요
          </h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-[320px] mx-auto">
            SNS, 블로그, 포트폴리오 등 모든 링크를 하나의 페이지에서 관리하고 공유하세요.
            로그인 후 즉시 사용할 수 있습니다.
          </p>
        </div>

        {/* 기능 소개 카드 */}
        <div className="w-full grid grid-cols-1 gap-3">
          {[
            { emoji: "✏️", title: "인라인 편집", desc: "클릭 한 번으로 바로 수정, 자동 저장" },
            { emoji: "📊", title: "클릭 통계", desc: "링크별 방문자 수를 실시간으로 확인" },
            { emoji: "🌐", title: "파비콘 자동 표시", desc: "URL 입력만 하면 로고가 자동으로 표시" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl p-4 text-left"
              style={{
                background: "rgba(255,255,255,0.03)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "rgba(124,58,237,0.2)" }}
              >
                {item.emoji}
              </span>
              <div>
                <p className="text-sm font-semibold text-white/90">{item.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Google 로그인 CTA */}
        <Button
          id="landing-google-signin-btn"
          onClick={signInWithGoogle}
          className="w-full h-13 flex items-center justify-center gap-3 font-semibold text-base rounded-2xl border-0 transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            boxShadow: "0 4px 32px rgba(124,58,237,0.45)",
          }}
        >
          {/* Google SVG 아이콘 */}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#ffffffcc" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#ffffffaa" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google로 무료 시작하기
        </Button>

        {/* 푸터 */}
        <p className="text-xs text-white/20">로그인 즉시 나만의 링크 페이지가 생성됩니다</p>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   로그인 후 마이페이지
───────────────────────────────────────────── */
function MyPage({ uid, displayName, email }: { uid: string; displayName: string; email: string | null }) {
  // 이름 첫 글자 (아바타용)
  const initial = displayName.charAt(0).toUpperCase();
  // 이메일 @ 앞부분을 displayName 슬러그로 사용
  const slug = email ? email.split("@")[0] : null;

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-24 pb-16">
      <div className="w-full max-w-[420px] flex flex-col items-center gap-8">

        {/* ── 프로필 섹션 ── */}
        <section className="flex flex-col items-center gap-4 text-center">
          {/* 아바타 */}
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                boxShadow: "0 0 40px #7c3aed55, 0 0 80px #2563eb22",
              }}
            >
              {initial}
            </div>
            {/* 활성화 배지 */}
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#0a0a0f]" />
          </div>

          {/* 이름 & displayName */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {displayName}
            </h1>
            {slug && (
              <p className="text-sm text-white/40 font-mono tracking-wider">
                @{slug}
              </p>
            )}
          </div>
        </section>

        {/* ── 구분선 ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── 링크 목록 (클라이언트 컴포넌트) ── */}
        <LinkList uid={uid} />

        {/* ── 브랜딩 푸터 ── */}
        <footer className="mt-4 flex flex-col items-center gap-1">
          <p className="text-xs text-white/20 tracking-widest uppercase">
            Powered by
          </p>
          <span
            className="text-sm font-bold tracking-tight"
            style={{
              background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
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
        /* 초기 인증 확인 중 스피너 */
        <div className="flex min-h-screen items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-white/10 border-t-violet-400 animate-spin"
            aria-label="로딩 중"
          />
        </div>
      ) : user ? (
        /* 로그인 → 마이페이지 */
        <MyPage
          uid={user.uid}
          displayName={user.displayName ?? user.email ?? "사용자"}
          email={user.email}
        />
      ) : (
        /* 미로그인 → 랜딩 화면 */
        <LandingScreen />
      )}
    </>
  );
}
