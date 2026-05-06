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
  ArrowRight01Icon,
  DragDropVerticalIcon,
} from "@hugeicons/core-free-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LinkItemProps {
  link: LinkType;
  onUpdate: (id: string, data: Partial<LinkType>) => Promise<void>;
  onDeleteRequest: (link: LinkType) => void;
  onClickLink?: (linkId: string) => void;
}

export function LinkItem({ link, onUpdate, onDeleteRequest, onClickLink }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  // dnd-kit sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 100 : 1,
    scale: isDragging ? "1.02" : "1",
    boxShadow: isDragging ? "0 20px 40px -10px rgba(124,58,237,0.3)" : undefined,
  };

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
      <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-lg">
        <CardContent className="p-4">
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            onBlur={(e) => {
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
                className="h-9 text-sm bg-background border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-violet-500/50"
              />
              {errors.title && (
                <p className="text-[10px] text-rose-500 ml-1">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Input
                {...register("url")}
                placeholder="URL (https://...)"
                className="h-9 text-sm font-mono bg-background border-border text-foreground/80 placeholder:text-muted-foreground/40 focus-visible:ring-violet-500/50"
              />
              {errors.url && (
                <p className="text-[10px] text-rose-500 ml-1">{errors.url.message}</p>
              )}
            </div>
            <div className="flex gap-2 mt-1">
              <Button
                type="submit"
                size="sm"
                className="flex-1 h-9 bg-violet-600 hover:bg-violet-700 text-white border-0 font-bold shadow-sm"
              >
                <HugeiconsIcon icon={Tick01Icon} size={16} className="mr-1" />
                저장
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="flex-1 h-9 text-muted-foreground/80 hover:text-violet-600 hover:bg-violet-500/10 border-0 font-bold transition-all"
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
    <div 
      ref={setNodeRef}
      style={style}
      className="group relative"
    >
      <div className={`border-border/50 bg-card/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-card/60 hover:border-violet-500/30 ${isDragging ? "shadow-2xl border-violet-500/50" : ""}`}>
        <CardContent className="flex items-center gap-4 py-4 pr-12 md:pr-4">
          {/* 드래그 핸들 */}
          <div 
            {...attributes}
            {...listeners}
            className="p-2 -ml-2 cursor-grab active:cursor-grabbing text-muted-foreground/20 hover:text-violet-500/50 transition-colors"
          >
            <HugeiconsIcon icon={DragDropVerticalIcon} size={20} />
          </div>

          <div className="w-10 h-10 rounded-xl bg-accent/50 flex items-center justify-center shrink-0 border border-border/10">
            {hostname ? (
              <img
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                alt={link.title}
                width={20}
                height={20}
                className="rounded"
              />
            ) : (
              <span className="text-muted-foreground/40 text-xs">🔗</span>
            )}
          </div>

          <span className="flex-1 flex items-center font-bold text-foreground/90 text-sm tracking-tight truncate">
            <span className="truncate">{link.title}</span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60 ml-3 font-normal shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {link.clickCount || 0}
            </span>
          </span>

          <HugeiconsIcon 
            icon={ArrowRight01Icon} 
            size={18} 
            className="text-muted-foreground/10 group-hover:text-violet-500/30 transition-all hidden md:block" 
          />
        </CardContent>
      </div>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-lg text-muted-foreground hover:text-violet-600 hover:bg-violet-500/10 border-0 transition-all"
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
          className="w-8 h-8 rounded-lg text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 border-0 transition-all"
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
