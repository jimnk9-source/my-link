"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserEdit01Icon, Tick01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

const profileSchema = z.object({
  username: z.string().min(2, "이름은 2글자 이상이어야 합니다.").max(20, "이름은 20글자 이하여야 합니다."),
  displayName: z.string()
    .min(3, "User name은 3글자 이상이어야 합니다.")
    .max(15, "User name은 15글자 이하여야 합니다.")
    .regex(/^[a-z0-9_]+$/, "영문 소문자, 숫자, 언더바(_)만 가능합니다."),
  bio: z.string().max(100, "소개글은 100글자 이내로 작성해 주세요.").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => Promise<void>;
  checkUnique: (name: string, uid: string) => Promise<boolean>;
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  profile,
  onUpdate,
  checkUnique,
}: ProfileEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username,
      displayName: profile.displayName,
      bio: profile.bio || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        username: profile.username,
        displayName: profile.displayName,
        bio: profile.bio || "",
      });
    }
  }, [open, profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      if (data.displayName !== profile.displayName) {
        const isUnique = await checkUnique(data.displayName, profile.uid);
        if (!isUnique) {
          toast.error("이미 사용 중인 User name입니다.");
          setIsSubmitting(false);
          return;
        }
      }

      await onUpdate({
        username: data.username.trim(),
        displayName: data.displayName.toLowerCase().trim(),
        bio: data.bio?.trim() || "",
      });
      
      toast.success("프로필이 업데이트되었습니다.");
      onOpenChange(false);
    } catch (error: any) {
      console.error("프로필 업데이트 오류:", error);
      toast.error(`업데이트 실패: ${error.message || "알 수 없는 오류"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] border-border/40 bg-background/95 backdrop-blur-3xl shadow-2xl rounded-3xl p-0 overflow-hidden">
        <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500" />
        
        <div className="p-7">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-violet-500/10 border border-violet-500/20 shadow-inner">
                <HugeiconsIcon icon={UserEdit01Icon} size={20} className="text-violet-500" />
              </span>
              프로필 편집
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* User name (Slug) */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="displayName" className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">
                  User name (URL)
                </Label>
                <span className="text-[10px] font-bold text-violet-500/60 font-mono">mylink.com/{"{name}"}</span>
              </div>
              <Input
                id="displayName"
                {...register("displayName")}
                className={`h-12 bg-white dark:bg-white/5 border-border/60 text-foreground font-mono text-sm placeholder:text-muted-foreground/25 focus-visible:ring-violet-500/30 rounded-xl transition-all shadow-sm ${
                  errors.displayName ? "ring-2 ring-rose-500/20 border-rose-500/40" : "focus:border-violet-500/50"
                }`}
              />
              {errors.displayName && (
                <p className="text-xs text-rose-500 font-bold ml-1">⚠ {errors.displayName.message}</p>
              )}
            </div>

            {/* 이름 필드 */}
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="username" className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.15em] ml-1">
                이름
              </Label>
              <Input
                id="username"
                {...register("username")}
                className={`h-12 bg-white dark:bg-white/5 border-border/60 text-foreground font-semibold placeholder:text-muted-foreground/25 focus-visible:ring-violet-500/30 rounded-xl transition-all shadow-sm ${
                  errors.username ? "ring-2 ring-rose-500/20 border-rose-500/40" : "focus:border-violet-500/50"
                }`}
              />
              {errors.username && (
                <p className="text-xs text-rose-500 font-bold ml-1">⚠ {errors.username.message}</p>
              )}
            </div>

            {/* 소개글 필드 */}
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="bio" className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.15em] ml-1">
                소개글
              </Label>
              <Textarea
                id="bio"
                {...register("bio")}
                placeholder="나를 한 줄로 표현해 보세요."
                className={`min-h-[100px] bg-white dark:bg-white/5 border-border/60 text-foreground font-medium placeholder:text-muted-foreground/25 focus-visible:ring-violet-500/30 rounded-xl transition-all shadow-sm resize-none py-3 ${
                  errors.bio ? "ring-2 ring-rose-500/20 border-rose-500/40" : "focus:border-violet-500/50"
                }`}
              />
              {errors.bio && (
                <p className="text-xs text-rose-500 font-bold ml-1">⚠ {errors.bio.message}</p>
              )}
            </div>

            <DialogFooter className="mt-4 flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 text-muted-foreground font-black hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 dark:hover:bg-white/5 rounded-xl transition-all"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} className="mr-1" />
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 font-black text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 shadow-xl shadow-violet-500/20 active:scale-95 rounded-xl transition-all"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <HugeiconsIcon icon={Tick01Icon} size={18} className="mr-1" />
                    저장하기
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
