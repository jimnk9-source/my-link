"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { linkSchema, LinkFormValues } from "@/lib/schemas";

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
    mode: "onChange",
  });

  const urlValue = watch("url");

  const onSubmit = (data: LinkFormValues) => {
    const now = Date.now();
    const newLink: LinkType = {
      id: `link-${now}`,
      title: data.title.trim(),
      url: data.url.trim(),
      createdAt: now,
      updatedAt: now,
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
        className="sm:max-w-[440px] border-border/40 p-0 overflow-hidden bg-background/95 backdrop-blur-3xl shadow-2xl rounded-3xl"
      >
        <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500" />

        <div className="p-7">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 shadow-inner">
                🔗
              </span>
              새 링크 추가
            </DialogTitle>
            <p className="text-sm text-muted-foreground font-medium mt-2 leading-relaxed">
              공유하고 싶은 링크의 제목과 주소를 입력해 주세요.<br />파비콘이 자동으로 생성됩니다.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
            {/* 제목 필드 */}
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="link-title" className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.15em] ml-1">
                링크 제목
              </Label>
              <Input
                id="link-title"
                placeholder="어떤 링크인가요?"
                {...register("title")}
                className={`h-12 bg-white dark:bg-white/5 border-border/60 text-foreground font-semibold placeholder:text-muted-foreground/25 focus-visible:ring-violet-500/30 rounded-xl transition-all shadow-sm ${
                  errors.title ? "ring-2 ring-rose-500/20 border-rose-500/40" : "focus:border-violet-500/50"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose-500 font-bold ml-1 animate-in fade-in slide-in-from-left-1">⚠ {errors.title.message}</p>
              )}
            </div>

            {/* URL 필드 */}
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="link-url" className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.15em] ml-1">
                URL 주소
              </Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                {...register("url")}
                className={`h-12 bg-white dark:bg-white/5 border-border/60 text-foreground font-mono text-sm placeholder:text-muted-foreground/25 focus-visible:ring-violet-500/30 rounded-xl transition-all shadow-sm ${
                  errors.url ? "ring-2 ring-rose-500/20 border-rose-500/40" : "focus:border-violet-500/50"
                }`}
              />
              {errors.url && (
                <p className="text-xs text-rose-500 font-bold ml-1 animate-in fade-in slide-in-from-left-1">⚠ {errors.url.message}</p>
              )}
            </div>

            {/* 미리보기 박스 */}
            {urlValue && !errors.url && (
              <div className="flex items-center gap-4 rounded-2xl p-4 bg-violet-500/[0.03] dark:bg-white/5 border border-violet-500/10 animate-in zoom-in-95 duration-300 shadow-sm">
                {(() => {
                  try {
                    const normalized = urlValue.startsWith("http") ? urlValue : `https://${urlValue}`;
                    const hostname = new URL(normalized).hostname;
                    return (
                      <>
                        <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-sm border border-border/50">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                            alt="favicon"
                            width={24}
                            height={24}
                            className="rounded-md"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[10px] font-black text-violet-500/60 dark:text-violet-400/60 uppercase tracking-widest">미리보기</span>
                          <span className="text-sm text-foreground font-mono font-bold truncate">
                            {hostname}
                          </span>
                        </div>
                      </>
                    );
                  } catch {
                    return null;
                  }
                })()}
              </div>
            )}

            <DialogFooter className="mt-4 flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="flex-1 h-12 text-muted-foreground font-black hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 dark:hover:bg-white/5 rounded-xl transition-all"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 font-black text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 shadow-xl shadow-violet-500/20 active:scale-95 rounded-xl transition-all"
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
