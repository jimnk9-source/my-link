"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

// Zod 스키마 정의
const linkSchema = z.object({
  title: z
    .string()
    .min(1, "링크 제목을 입력해주세요.")
    .max(50, "제목은 최대 50자까지 입력 가능합니다."),
  url: z
    .string()
    .min(1, "URL을 입력해주세요.")
    .refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
      message: "http 나 https로 시작하는 올바른 url을 추가하세요",
    })
    .refine(
      (val) => {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "URL 형식이 올바르지 않습니다." }
    ),
});

type LinkFormValues = z.infer<typeof linkSchema>;

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
  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
    mode: "onChange", // 실시간 검증
  });

  const urlValue = watch("url");

  const onSubmit = (data: LinkFormValues) => {
    const newLink: LinkType = {
      id: `link-${Date.now()}`,
      title: data.title.trim(),
      url: data.url.trim(),
      isActive: true, // 기본값 활성화
      order: Date.now(),
    };

    onAdd(newLink);
    handleReset();
  };

  const handleReset = () => {
    reset();
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

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                {...register("title")}
                className={`border-0 text-white/90 placeholder:text-white/25 focus-visible:ring-1 h-11 transition-all ${
                  errors.title 
                    ? "focus-visible:ring-rose-500/60 ring-1 ring-rose-500/20" 
                    : "focus-visible:ring-violet-500/60"
                }`}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  boxShadow: errors.title 
                    ? "inset 0 0 0 1px rgba(244,63,94,0.3)" 
                    : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              />
              {errors.title && (
                <p className="text-xs text-rose-400/80 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <span>⚠</span> {errors.title.message}
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
                {...register("url")}
                className={`border-0 text-white/90 placeholder:text-white/25 focus-visible:ring-1 h-11 font-mono text-sm transition-all ${
                  errors.url 
                    ? "focus-visible:ring-rose-500/60 ring-1 ring-rose-500/20" 
                    : "focus-visible:ring-violet-500/60"
                }`}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  boxShadow: errors.url 
                    ? "inset 0 0 0 1px rgba(244,63,94,0.3)" 
                    : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              />
              {errors.url && (
                <p className="text-xs text-rose-400/80 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <span>⚠</span> {errors.url.message}
                </p>
              )}
            </div>

            {/* URL 미리보기 */}
            {urlValue && !errors.url && (
              <div
                className="flex items-center gap-3 rounded-xl p-3 animate-in zoom-in-95 duration-200"
                style={{
                  background: "rgba(124,58,237,0.08)",
                  boxShadow: "inset 0 0 0 1px rgba(124,58,237,0.2)",
                }}
              >
                {(() => {
                  try {
                    const normalized = urlValue.startsWith("http")
                      ? urlValue
                      : `https://${urlValue}`;
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
                        <span className="text-xs text-white/50 font-mono truncate">
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

            <DialogFooter className="mt-1 flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="flex-1 text-white/50 hover:text-white/80 hover:bg-white/5 border-0 h-11"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 font-semibold h-11 border-0 transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                }}
              >
                추가하기
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
