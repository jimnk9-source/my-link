"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // 실제 프로필 정보를 가져와서 정확한 slug(displayName)를 확인
  const { profile } = useProfile(user?.uid);
  const slug = profile?.displayName ?? (user?.email ? user.email.split("@")[0] : null);
  const initial = profile?.username?.charAt(0)?.toUpperCase() ?? user?.displayName?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? "?";

  const handleCopyLink = async () => {
    if (!slug) return;
    const url = `${window.location.origin}/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("링크가 복사되었습니다");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("복사에 실패했습니다");
    }
  };

  const handleToggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleSignOut = () => {
    signOut().catch((err) => console.error("로그아웃 오류:", err));
  };

  const handleOpenPage = () => {
    if (slug) {
      window.open(`/${slug}`, "_blank");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 h-14 bg-background/80 backdrop-blur-xl border-b border-border/40 transition-colors duration-500">
      <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
        <span className="text-xl group-hover:rotate-12 transition-transform">🔗</span>
        <span className="text-base font-bold tracking-tight select-none bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
          MyLink
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {loading ? (
          <div className="w-5 h-5 rounded-full border-2 border-border border-t-violet-400 animate-spin" />
        ) : user ? (
          <>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-2 h-9 px-4 text-xs font-black rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-600 hover:bg-violet-500/10 active:scale-95 transition-all"
            >
              <Link href={`/${slug}`}>
                <span className="text-base">🔗</span>
                내 페이지
              </Link>
            </Button>

            <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 rounded-full px-1 py-1 pr-3 transition-all duration-300 hover:bg-violet-500/5 active:scale-95 focus:outline-none cursor-pointer text-foreground group border border-transparent hover:border-violet-500/20"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
              >
                {initial}
              </div>
              <span className="text-sm font-bold hidden sm:block text-foreground group-hover:text-violet-600 transition-colors">
                {user.displayName ?? user.email?.split("@")[0]}
              </span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-muted-foreground group-hover:text-violet-500 transition-all group-hover:translate-y-0.5"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-64 bg-popover/95 border-border/50 shadow-2xl z-[9999] rounded-2xl p-1.5 backdrop-blur-xl"
            >
              <div className="px-3 py-3 mb-1 border-b border-border/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0 shadow-inner"
                    style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
                  >
                    {initial}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-black text-foreground truncate">{user.displayName ?? "사용자"}</p>
                    <p className="text-[11px] text-muted-foreground/80 truncate font-mono">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="px-3 py-2 text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">바로가기</p>
                
                <DropdownMenuItem
                  asChild
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground/80 focus:bg-violet-600 focus:text-white cursor-pointer transition-all active:scale-[0.98] group/item"
                >
                  <Link href={`/${slug}`} className="flex w-full items-center gap-3">
                    <span className="text-lg group-focus:scale-110 transition-transform">🔗</span>
                    <span>내 페이지 보기</span>
                    <span className="ml-auto text-[10px] text-muted-foreground/40 group-focus:text-white/60 font-mono">@{slug}</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground/80 focus:bg-violet-600 focus:text-white cursor-pointer transition-all active:scale-[0.98] group/item"
                >
                  <Link href="/" className="flex w-full items-center gap-3">
                    <span className="text-lg group-focus:scale-110 transition-transform">⚙️</span>
                    <span>링크 관리</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground/80 focus:bg-violet-600 focus:text-white cursor-pointer transition-all active:scale-[0.98] group/item"
                  onPointerDown={handleCopyLink}
                >
                  <span className="text-lg group-focus:scale-110 transition-transform">{copied ? "✅" : "📋"}</span>
                  <span>내 페이지 링크 복사</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="my-2 bg-border/10" />

              <div className="space-y-0.5">
                <p className="px-3 py-2 text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">설정</p>
                <DropdownMenuItem
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground/80 focus:bg-violet-600 focus:text-white cursor-pointer transition-all active:scale-[0.98] group/item"
                  onPointerDown={handleToggleTheme}
                >
                  <span className="text-lg group-focus:scale-110 transition-transform">{resolvedTheme === "dark" ? "🌙" : "☀️"}</span>
                  <span>테마 전환</span>
                  <span className="ml-auto text-[10px] font-black bg-violet-500/10 px-2 py-0.5 rounded-md text-violet-600 group-focus:bg-white/20 group-focus:text-white transition-colors">
                    {resolvedTheme === "dark" ? "다크" : "라이트"}
                  </span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="my-2 bg-border/10" />

              <DropdownMenuItem
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-black text-rose-500/90 focus:bg-rose-500 focus:text-white cursor-pointer transition-all active:scale-[0.98] group/logout"
                onPointerDown={handleSignOut}
              >
                <span className="text-lg group-focus/logout:scale-110 transition-transform">🚪</span>
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
          <Button
            size="sm"
            onClick={signInWithGoogle}
            className="flex items-center gap-2 h-9 px-5 text-sm font-black rounded-full border-0 bg-primary text-primary-foreground hover:opacity-90 active:scale-95 shadow-lg transition-all"
          >
            Google 로그인
          </Button>
        )}
      </div>
    </header>
  );
}
