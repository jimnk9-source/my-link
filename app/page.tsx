import { dummyLinks } from "@/data/links";
import { LinkList } from "@/components/LinkList";

/* ─────────────────────────────────────────────
   더미 프로필 데이터 (추후 DB 연동 예정)
───────────────────────────────────────────── */
const profile = {
  displayName: "jiminkyu",
  username: "지민규",
  bio: "크리에이터 · 개발자 · 디자이너 | 나만의 이야기를 공유합니다 ✨",
};

export default function Page() {
  return (
    <>
      {/* 배경: 다크 메시 그라데이션 */}
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

      <main className="flex min-h-screen flex-col items-center px-4 py-16">
        <div className="w-full max-w-[420px] flex flex-col items-center gap-8">

          {/* ── 프로필 섹션 ── */}
          <section className="flex flex-col items-center gap-4 text-center">
            {/* 아바타 */}
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                  boxShadow: "0 0 40px #7c3aed55, 0 0 80px #2563eb22",
                }}
              >
                {profile.username.charAt(0)}
              </div>
              {/* 활성화 배지 */}
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#0a0a0f]" />
            </div>

            {/* 이름 & 슬러그 */}
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {profile.username}
              </h1>
              <p className="text-sm text-white/40 font-mono tracking-wider">
                @{profile.displayName}
              </p>
            </div>

            {/* Bio */}
            <p className="text-sm text-white/60 leading-relaxed max-w-[300px]">
              {profile.bio}
            </p>
          </section>

          {/* ── 구분선 ── */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* ── 링크 목록 + 추가 버튼 (클라이언트 컴포넌트) ── */}
          <LinkList initialLinks={dummyLinks} />

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
    </>
  );
}
