import { Metadata } from "next";

export const metadata: Metadata = {
  title: "통계 | MyLink",
  description: "내 링크들의 클릭 통계를 한눈에 확인하세요.",
  openGraph: {
    title: "통계 | MyLink",
    description: "내 링크들의 클릭 통계를 한눈에 확인하세요.",
  },
  robots: {
    index: false, // 통계 페이지는 개인 정보이므로 검색 엔진 인덱싱 방지
    follow: false,
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
