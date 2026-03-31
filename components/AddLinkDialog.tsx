"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkType } from "@/data/links";

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (link: LinkType) => void;
}

export function AddLinkDialog({
  open,
  onOpenChange,
  onAdd,
}: AddLinkDialogProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; url?: string } = {};
    if (!title.trim()) {
      newErrors.title = "링크 제목을 입력해주세요.";
    }
    if (!url.trim()) {
      newErrors.url = "URL을 입력해주세요.";
    } else {
      try {
        const parsed = new URL(
          url.startsWith("http") ? url : `https://${url}`
        );
        if (!parsed.hostname) throw new Error();
      } catch {
        newErrors.url = "올바른 URL 형식을 입력해주세요. (예: https://example.com)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    const newLink: LinkType = {
      id: `link-${Date.now()}`,
      title: title.trim(),
      url: normalizedUrl,
      isActive: true,
      order: Date.now(),
    };

    onAdd(newLink);
    handleReset();
  };

  const handleReset = () => {
    setTitle("");
    setUrl("");
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleReset(); }}>
      <DialogContent
        className="sm:max-w-[440px] border-0 p-0 overflow-hidden"
        style={{
          background: "rgba(15, 15, 25, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 24px 64px rgba(0,0,0,0.6), 0 0 80px rgba(124,58,237,0.15)",
        }}
      >
        {/* 상단 그라데이션 라인 */}
        <div
          className="h-[2px] w-full"
          style={{
            background:
              "linear-gradient(90deg, #7c3aed, #2563eb, #7c3aed)",
          }}
        />

        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                style={{ background: "rgba(124,58,237,0.25)" }}
              >
                🔗
              </span>
              새 링크 추가
            </DialogTitle>
            <p className="text-xs text-white/40 mt-1">
              제목과 URL을 입력하면 파비콘이 자동으로 표시됩니다.
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            {/* 제목 필드 */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="link-title"
                className="text-xs font-medium text-white/60 uppercase tracking-wider"
              >
                링크 제목
              </Label>
              <Input
                id="link-title"
                placeholder="예: 내 인스타그램"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="border-0 text-white/90 placeholder:text-white/25 focus-visible:ring-1 focus-visible:ring-violet-500/60 h-11"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              />
              {errors.title && (
                <p className="text-xs text-rose-400/80 flex items-center gap-1">
                  <span>⚠</span> {errors.title}
                </p>
              )}
            </div>

            {/* URL 필드 */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="link-url"
                className="text-xs font-medium text-white/60 uppercase tracking-wider"
              >
                URL
              </Label>
              <Input
                id="link-url"
                placeholder="예: https://instagram.com/username"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (errors.url) setErrors((p) => ({ ...p, url: undefined }));
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="border-0 text-white/90 placeholder:text-white/25 focus-visible:ring-1 focus-visible:ring-violet-500/60 h-11 font-mono text-sm"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              />
              {errors.url && (
                <p className="text-xs text-rose-400/80 flex items-center gap-1">
                  <span>⚠</span> {errors.url}
                </p>
              )}
            </div>

            {/* URL 미리보기 */}
            {url && !errors.url && (
              <div
                className="flex items-center gap-3 rounded-xl p-3"
                style={{
                  background: "rgba(124,58,237,0.08)",
                  boxShadow: "inset 0 0 0 1px rgba(124,58,237,0.2)",
                }}
              >
                {(() => {
                  try {
                    const normalized = url.startsWith("http")
                      ? url
                      : `https://${url}`;
                    const hostname = new URL(normalized).hostname;
                    return (
                      <>
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                          alt="favicon"
                          width={20}
                          height={20}
                          className="rounded"
                        />
                        <span className="text-xs text-white/50 font-mono">
                          {hostname}
                        </span>
                      </>
                    );
                  } catch {
                    return null;
                  }
                })()}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            <Button
              variant="ghost"
              onClick={handleReset}
              className="flex-1 text-white/50 hover:text-white/80 hover:bg-white/5 border-0 h-11"
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 font-semibold h-11 border-0 transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
              }}
            >
              추가하기
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
