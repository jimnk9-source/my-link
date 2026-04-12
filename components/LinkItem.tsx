"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkType } from "@/data/links";
import { linkSchema, LinkFormValues } from "@/lib/schemas";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  PencilEdit01Icon, 
  Delete02Icon, 
  Tick01Icon, 
  Cancel01Icon,
  ArrowRight01Icon
} from "@hugeicons/core-free-icons";

interface LinkItemProps {
  link: LinkType;
  onUpdate: (id: string, data: Partial<LinkType>) => Promise<void>;
  onDeleteRequest: (link: LinkType) => void;
}

export function LinkItem({ link, onUpdate, onDeleteRequest }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  });

  const hostname = (() => {
    try {
      return new URL(link.url).hostname;
    } catch {
      return "";
    }
  })();

  const onSubmit = async (data: LinkFormValues) => {
    await onUpdate(link.id, {
      title: data.title.trim(),
      url: data.url.trim(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset({
      title: link.title,
      url: link.url,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card
        className="border-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <CardContent className="p-4">
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            onBlur={(e) => {
              // 폼 외부(다른 요소)를 클릭했을 때만 자동 저장 실행
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                handleSubmit(onSubmit)();
              }
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1.5">
              <Input
                {...register("title")}
                placeholder="링크 제목"
                className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-violet-500/50"
              />
              {errors.title && (
                <p className="text-[10px] text-rose-400 ml-1">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Input
                {...register("url")}
                placeholder="URL (https://...)"
                className="h-9 text-sm font-mono bg-white/5 border-white/10 text-white/80 placeholder:text-white/20 focus-visible:ring-violet-500/50"
              />
              {errors.url && (
                <p className="text-[10px] text-rose-400 ml-1">{errors.url.message}</p>
              )}
            </div>
            <div className="flex gap-2 mt-1">
              <Button
                type="submit"
                size="sm"
                className="flex-1 h-9 bg-violet-600 hover:bg-violet-700 text-white border-0"
              >
                <HugeiconsIcon icon={Tick01Icon} size={16} className="mr-1" />
                저장
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="flex-1 h-9 text-white/40 hover:text-white/60 hover:bg-white/5 border-0"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} className="mr-1" />
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="group relative">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
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
          <CardContent className="flex items-center gap-4 py-4 pr-12 md:pr-4">
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
            <span className="flex-1 font-medium text-white/90 text-sm tracking-wide truncate">
              {link.title}
            </span>

            {/* 기본 화살표 (데스크탑 group-hover 시 숨김 처리 가능) */}
            <HugeiconsIcon 
              icon={ArrowRight01Icon} 
              size={18} 
              className="text-white/20 group-hover:text-white/40 transition-all group-hover:translate-x-0.5 hidden md:block" 
            />
          </CardContent>
        </Card>
      </a>

      {/* 액션 버튼 (오른쪽 상단/중앙 배치) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-lg text-white/40 hover:text-white hover:bg-white/10 border-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-lg text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 border-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteRequest(link);
          }}
        >
          <HugeiconsIcon icon={Delete02Icon} size={16} />
        </Button>
      </div>
    </div>
  );
}
