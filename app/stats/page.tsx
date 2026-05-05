"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
  orderBy,
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
export default function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sortType, setSortType] = useState<SortType>("clicks");

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
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              📊 통계
            </h1>
            <p className="text-sm text-muted-foreground/70">
              링크별 클릭 수를 확인하세요.
            </p>
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
    </>
  );
}
