"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  doc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy,
  updateDoc,
  increment
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound, useParams } from "next/navigation";
import { UserProfile } from "@/hooks/useProfile";
import { LinkType } from "@/data/links";
import { useTheme } from "next-themes";
import { Header } from "@/components/Header";

/* ─────────────────────────────────────────────
   배경 컴포넌트
   (app/page.tsx의 디자인을 계승)
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
   공개 프로필 페이지
───────────────────────────────────────────── */
export default function PublicProfilePage() {
  const params = useParams();
  const displayname = params.displayname as string;

  // 1. displayname으로 UID 조회
  const { data: uid, isLoading: uidLoading, isError: uidError } = useQuery({
    queryKey: ["uid", displayname],
    queryFn: async () => {
      const nameRef = doc(db, "displayNames", displayname.toLowerCase().trim());
      const nameSnap = await getDoc(nameRef);
      if (!nameSnap.exists()) return null;
      return nameSnap.data().uid as string;
    },
  });

  // 2. UID로 프로필 및 링크 조회
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", uid],
    queryFn: async () => {
      if (!uid) return null;
      const docRef = doc(db, "users", uid, "profile", "data");
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
    },
    enabled: !!uid,
  });

  const { data: links = [], isLoading: linksLoading } = useQuery({
    queryKey: ["links", uid],
    queryFn: async () => {
      if (!uid) return [];
      const q = query(
        collection(db, "users", uid, "links"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const fetchedLinks: LinkType[] = [];
      snapshot.forEach((docSnap) => {
        fetchedLinks.push(docSnap.data() as LinkType);
      });
      return fetchedLinks;
    },
    enabled: !!uid,
  });

  const handleLinkClick = async (linkId: string) => {
    if (!uid) return;
    try {
      const linkRef = doc(db, "users", uid, "links", linkId);
      await updateDoc(linkRef, {
        clickCount: increment(1)
      });
    } catch (error) {
      console.error("Failed to increment click count:", error);
    }
  };

  // 로딩 상태 처리
  if (uidLoading || profileLoading || linksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-accent border-t-violet-500 animate-spin" />
      </div>
    );
  }

  // 존재하지 않는 displayname 처리
  if (!uid || uidError) {
    notFound();
  }

  const initial = profile?.username?.charAt(0).toUpperCase() ?? "?";

  return (
    <>
      <Background />
      <Header />

      <main className="flex min-h-screen flex-col items-center px-4 pt-24 pb-12 overflow-x-hidden">
        <div className="w-full max-w-[500px] flex flex-col gap-10">
          
          {/* ── 프로필 섹션 ── */}
          <section className="flex flex-col items-center gap-4 text-center">
            <div className="relative group">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl transition-transform duration-500 group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                  boxShadow: "0 10px 40px -10px rgba(124,58,237,0.5)",
                }}
              >
                {initial}
              </div>
              <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="flex flex-col gap-1.5 items-center w-full max-w-[320px]">
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                {profile?.username}
              </h1>
              <p className="text-sm text-muted-foreground font-mono font-semibold tracking-tight opacity-70">
                @{displayname}
              </p>
              {profile?.bio && (
                <p className="text-sm text-muted-foreground/80 mt-2 max-w-[280px] leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </section>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

          {/* ── 링크 목록 ── */}
          <section className="w-full flex flex-col gap-4">
            {links.length === 0 ? (
              <div className="w-full rounded-3xl flex flex-col items-center justify-center py-16 gap-3 bg-white/40 dark:bg-white/5 border border-dashed border-border/60 backdrop-blur-sm">
                <span className="text-4xl">✨</span>
                <p className="text-sm text-muted-foreground font-medium">아직 등록된 링크가 없습니다.</p>
              </div>
            ) : (
              links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link.id)}
                  className="group relative w-full flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-xl hover:shadow-violet-500/10 active:scale-[0.98] backdrop-blur-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/50 dark:bg-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-violet-500/10 transition-colors">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                      alt={link.title}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?domain=example.com&sz=64";
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-base font-bold text-foreground truncate group-hover:text-violet-500 transition-colors">
                      {link.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground/60 truncate font-mono">
                      {new URL(link.url).hostname}
                    </span>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-violet-500">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </a>
              ))
            )}
          </section>

          <footer className="mt-16 flex flex-col items-center gap-1 opacity-50">
            <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">
              Powered by
            </p>
            <span className="text-sm font-black tracking-tight bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
              MyLink
            </span>
          </footer>
        </div>
      </main>
    </>
  );
}
