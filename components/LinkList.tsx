"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkType } from "@/data/links";
import { AddLinkDialog } from "@/components/AddLinkDialog";

interface LinkListProps {
  initialLinks: LinkType[];
}

export function LinkList({ initialLinks }: LinkListProps) {
  const [links, setLinks] = useState<LinkType[]>(initialLinks);
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeLinks = links
    .filter((link) => link.isActive)
    .sort((a, b) => a.order - b.order);

  const handleAddLink = (newLink: LinkType) => {
    setLinks((prev) => [...prev, newLink]);
  };

  return (
    <>
      {/* ── 링크 목록 ── */}
      <section className="w-full flex flex-col gap-3">
        {activeLinks.length === 0 && (
          <div
            className="w-full rounded-2xl flex flex-col items-center justify-center py-10 gap-2"
            style={{
              background: "rgba(255,255,255,0.03)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            <span className="text-3xl">🔗</span>
            <p className="text-sm text-white/30">아직 등록된 링크가 없습니다.</p>
          </div>
        )}

        {activeLinks.map((link) => {
          const hostname = (() => {
            try {
              return new URL(link.url).hostname;
            } catch {
              return "";
            }
          })();

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card
                className="border-0 cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_#7c3aed30]"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  {/* 파비콘 래퍼 */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    {hostname ? (
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                        alt={link.title}
                        width={20}
                        height={20}
                        className="rounded"
                      />
                    ) : (
                      <span className="text-white/40 text-xs">🔗</span>
                    )}
                  </div>

                  {/* 링크 제목 */}
                  <span className="flex-1 font-medium text-white/90 text-sm tracking-wide">
                    {link.title}
                  </span>

                  {/* 화살표 */}
                  <svg
                    className="w-4 h-4 text-white/25 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </section>

      {/* ── 링크 추가 버튼 ── */}
      <Button
        id="add-link-btn"
        onClick={() => setDialogOpen(true)}
        className="w-full h-12 font-semibold tracking-wide border-0 transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
          boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
        }}
      >
        <span className="mr-2 text-base">+</span>
        새 링크 추가
      </Button>

      {/* ── 추가 다이얼로그 ── */}
      <AddLinkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAddLink}
      />
    </>
  );
}
