"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
  orderBy,
  writeBatch,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LinkType } from "@/data/links";
import { Header } from "@/components/Header";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

/* ─────────────────────────────────────────────
   배경 컴포넌트
───────────────────────────────────────────── */
function Background() {
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
   정렬 타입
───────────────────────────────────────────── */
type SortType = "clicks" | "name";

/* ─────────────────────────────────────────────
   차트 설정
───────────────────────────────────────────── */
const chartConfig = {
  clickCount: {
    label: "클릭 수",
    color: "#7c3aed",
  },
} satisfies ChartConfig;

/* ─────────────────────────────────────────────
   통계 페이지
───────────────────────────────────────────── */
/* 정답 비밀번호 */
const RESET_PASSWORD = "mandoo0219!";

export default function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sortType, setSortType] = useState<SortType>("clicks");

  // 초기화 다이얼로그 상태
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /** 다이얼로그 열기 */
  const openDialog = () => {
    setPwInput("");
    setPwError("");
    setResetDone(false);
    setDialogOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  /** 다이얼로그 닫기 */
  const closeDialog = () => {
    if (resetting) return;
    setDialogOpen(false);
  };

  /** 초기화 실행 */
  const handleReset = async () => {
    if (pwInput !== RESET_PASSWORD) {
      setPwError("비밀번호가 틀렸습니다.");
      inputRef.current?.focus();
      return;
    }
    if (!user?.uid) return;

    setResetting(true);
    setPwError("");

    try {
      // 모든 링크 가져오기
      const snapshot = await getDocs(
        collection(db, "users", user.uid, "links")
      );

      // Firestore 배치 업데이트로 clickCount 일괄 초기화
      const batch = writeBatch(db);
      snapshot.forEach((docSnap) => {
        batch.update(doc(db, "users", user.uid, "links", docSnap.id), {
          clickCount: 0,
        });
      });
      await batch.commit();

      // TanStack Query 캐시 무효화 → 목록 자동 갱신
      await queryClient.invalidateQueries({ queryKey: ["links-stats"] });
      await queryClient.invalidateQueries({ queryKey: ["links"] });

      setResetDone(true);
    } catch (err) {
      console.error(err);
      setPwError("초기화 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setResetting(false);
    }
  };

  // 링크 목록 조회 (클릭 수 내림차순)
  const { data: links = [], isLoading: linksLoading } = useQuery({
    queryKey: ["links-stats", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const q = query(
        collection(db, "users", user.uid, "links"),
        orderBy("clickCount", "desc")
      );
      const snapshot = await getDocs(q);
      const fetched: LinkType[] = [];
      snapshot.forEach((docSnap) => {
        fetched.push(docSnap.data() as LinkType);
      });
      return fetched;
    },
    enabled: !!user?.uid,
  });

  // 로딩 중
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-accent border-t-violet-500 animate-spin" />
      </div>
    );
  }

  // 비로그인 → 홈으로 리다이렉트
  if (!user) {
    router.replace("/");
    return null;
  }

  const totalClicks = links.reduce((sum, l) => sum + (l.clickCount ?? 0), 0);

  const sortedLinks = [...links].sort((a, b) => {
    if (sortType === "clicks") {
      return (b.clickCount ?? 0) - (a.clickCount ?? 0);
    }
    return a.title.localeCompare(b.title, "ko");
  });

  // 차트 데이터 (클릭 순 상위 최대 10개, 항상 클릭 많은 순)
  const chartData = [...links]
    .sort((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0))
    .slice(0, 10)
    .map((link) => ({
      title: link.title.length > 8 ? link.title.slice(0, 8) + "…" : link.title,
      fullTitle: link.title,
      clickCount: link.clickCount ?? 0,
    }));

  const hostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  };

  // 막대 색상 (1~3위 강조)
  const BAR_COLORS = ["#f59e0b", "#a1a1aa", "#f97316"];

  return (
    <>
      <Background />
      <Header />

      <main className="flex min-h-screen flex-col items-center px-4 pt-24 pb-16 overflow-x-hidden">
        <div className="w-full max-w-[560px] flex flex-col gap-8">

          {/* ── 페이지 제목 ── */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                📊 통계
              </h1>
              <p className="text-sm text-muted-foreground/70">
                링크별 클릭 수를 확인하세요.
              </p>
            </div>
            <button
              id="reset-stats-btn"
              onClick={openDialog}
              className="shrink-0 mt-1 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-300/60 dark:border-red-500/30 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-200 active:scale-95"
            >
              🗑 통계 초기화
            </button>
          </div>

          {/* ── 총 클릭 수 카드 ── */}
          <div
            className="w-full rounded-3xl p-6 flex flex-col gap-2 text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              boxShadow: "0 8px 40px -10px rgba(124,58,237,0.5)",
            }}
          >
            {/* 배경 장식 */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)",
              }}
            />
            <p className="text-sm font-bold text-white/70 tracking-widest uppercase relative z-10">
              Total Clicks
            </p>
            <div className="flex items-end gap-3 relative z-10">
              <span className="text-5xl font-black tabular-nums">
                {linksLoading ? "—" : totalClicks.toLocaleString()}
              </span>
              <span className="text-white/60 text-sm font-bold mb-2">클릭</span>
            </div>
            <p className="text-xs text-white/50 relative z-10 mt-1">
              총 {links.length}개 링크 합산
            </p>
          </div>

          {/* ── 차트 섹션 ── */}
          {!linksLoading && links.length > 0 && (
            <div className="w-full rounded-3xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm backdrop-blur-md p-6 flex flex-col gap-4">
              <h2 className="text-base font-black text-foreground">
                클릭 수 차트
                {links.length > 10 && (
                  <span className="text-xs font-normal text-muted-foreground/60 ml-2">
                    (상위 10개)
                  </span>
                )}
              </h2>
              <ChartContainer
                config={chartConfig}
                className="w-full"
                style={{ height: 220 }}
              >
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="currentColor"
                    strokeOpacity={0.06}
                  />
                  <XAxis
                    dataKey="title"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fontWeight: 700 }}
                    interval={0}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
                    content={
                      <ChartTooltipContent
                        labelKey="fullTitle"
                        nameKey="clickCount"
                        formatter={(value) => [
                          <span key="v" className="font-black tabular-nums">
                            {Number(value).toLocaleString()} 클릭
                          </span>,
                        ]}
                      />
                    }
                  />
                  <Bar dataKey="clickCount" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          i < 3
                            ? BAR_COLORS[i]
                            : "#7c3aed"
                        }
                        fillOpacity={i < 3 ? 1 : 0.75}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          )}

          {/* ── 링크별 클릭 수 ── */}
          <div className="flex flex-col gap-4">
            {/* 헤더 + 정렬 버튼 */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-foreground">
                링크별 클릭 수
              </h2>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm">
                <button
                  id="sort-by-clicks"
                  onClick={() => setSortType("clicks")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${sortType === "clicks"
                    ? "bg-violet-600 dark:bg-violet-500 text-white shadow-lg shadow-violet-500/25 scale-[1.02]"
                    : "text-muted-foreground dark:text-muted-foreground/50 hover:text-foreground dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                >
                  클릭 순
                </button>
                <button
                  id="sort-by-name"
                  onClick={() => setSortType("name")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${sortType === "name"
                    ? "bg-violet-600 dark:bg-violet-500 text-white shadow-lg shadow-violet-500/25 scale-[1.02]"
                    : "text-muted-foreground dark:text-muted-foreground/50 hover:text-foreground dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                >
                  이름 순
                </button>
              </div>
            </div>

            {/* 링크 목록 */}
            {linksLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 rounded-full border-4 border-accent border-t-violet-500 animate-spin" />
              </div>
            ) : links.length === 0 ? (
              <div className="w-full rounded-3xl flex flex-col items-center justify-center py-16 gap-3 bg-white/40 dark:bg-white/5 border border-dashed border-border/60 backdrop-blur-sm">
                <span className="text-4xl">🔗</span>
                <p className="text-sm text-muted-foreground font-medium">
                  등록된 링크가 없습니다.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sortedLinks.map((link, index) => {
                  const clicks = link.clickCount ?? 0;
                  const host = hostname(link.url);

                  return (
                    <div
                      key={link.id}
                      className="group w-full rounded-2xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm backdrop-blur-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-violet-500/20"
                    >
                      <div className="flex items-center gap-4 p-4">
                        {/* 순위 */}
                        <span
                          className={`text-xs font-black w-6 text-center shrink-0 ${index === 0
                            ? "text-amber-500"
                            : index === 1
                              ? "text-zinc-400"
                              : index === 2
                                ? "text-orange-400"
                                : "text-muted-foreground/40"
                            }`}
                        >
                          {index + 1}
                        </span>

                        {/* 파비콘 */}
                        <div className="w-9 h-9 rounded-xl bg-accent/50 dark:bg-white/5 flex items-center justify-center shrink-0 border border-border/10">
                          {host ? (
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${host}&sz=32`}
                              alt={link.title}
                              width={18}
                              height={18}
                              className="rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://www.google.com/s2/favicons?domain=example.com&sz=32";
                              }}
                            />
                          ) : (
                            <span className="text-muted-foreground/40 text-xs">
                              🔗
                            </span>
                          )}
                        </div>

                        {/* 제목 + 도메인 */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-bold text-foreground/90 truncate">
                            {link.title}
                          </span>
                          <span className="text-[11px] text-muted-foreground/50 font-mono truncate">
                            {host}
                          </span>
                        </div>

                        {/* 클릭 수 */}
                        <div className="flex flex-col items-end shrink-0 gap-0.5">
                          <span className="text-lg font-black text-foreground tabular-nums">
                            {clicks.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-muted-foreground/50 font-bold">
                            클릭
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── 비밀번호 확인 다이얼로그 ── */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
          onClick={(e) => e.target === e.currentTarget && closeDialog()}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-white/20 dark:border-white/10 shadow-2xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200"
          >
            {resetDone ? (
              /* ── 완료 상태 ── */
              <div className="flex flex-col items-center gap-4 py-2">
                <span className="text-5xl">✅</span>
                <p className="text-base font-black text-foreground text-center">
                  통계가 초기화되었습니다!
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  모든 링크의 클릭 수가 0으로 리셋되었습니다.
                </p>
                <button
                  id="reset-done-close-btn"
                  onClick={closeDialog}
                  className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-all duration-200 active:scale-95"
                >
                  확인
                </button>
              </div>
            ) : (
              /* ── 비밀번호 입력 상태 ── */
              <>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-black text-foreground">🔒 통계 초기화</h2>
                  <p className="text-sm text-muted-foreground/70">
                    모든 링크의 클릭 수가 <span className="font-bold text-red-500">0</span>으로 초기화됩니다.
                    <br />계속하려면 비밀번호를 입력하세요.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    비밀번호
                  </label>
                  <input
                    id="reset-password-input"
                    ref={inputRef}
                    type="password"
                    value={pwInput}
                    onChange={(e) => {
                      setPwInput(e.target.value);
                      if (pwError) setPwError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && !resetting && handleReset()}
                    placeholder="비밀번호를 입력하세요"
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 dark:focus:border-violet-500/50 transition-all"
                    disabled={resetting}
                  />
                  {pwError && (
                    <p className="text-xs font-bold text-red-500 pl-1">{pwError}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    id="reset-cancel-btn"
                    onClick={closeDialog}
                    disabled={resetting}
                    className="flex-1 py-3 rounded-2xl border border-border/60 text-sm font-bold text-muted-foreground hover:bg-accent/50 transition-all duration-200 active:scale-95 disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    id="reset-confirm-btn"
                    onClick={handleReset}
                    disabled={resetting || !pwInput}
                    className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {resetting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        초기화 중…
                      </>
                    ) : (
                      "초기화"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
