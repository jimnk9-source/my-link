"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LinkType } from "@/data/links";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: LinkType | null;
  onConfirm: (linkId: string) => Promise<void>;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  link,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!link) return null;

  const handleConfirm = async () => {
    await onConfirm(link.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[400px] border-0 p-0 overflow-hidden"
        style={{
          background: "rgba(20, 20, 30, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              정말 삭제하시겠습니까?
            </DialogTitle>
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm font-medium text-white/80 truncate">
                {link.title}
              </p>
              <p className="text-xs text-white/40 font-mono truncate mt-1">
                {link.url}
              </p>
            </div>
            <p className="text-sm text-rose-500 font-medium mt-4">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </DialogHeader>

          <DialogFooter className="mt-8 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 text-white/50 hover:text-white/80 hover:bg-white/5 border-0 h-11"
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              className="flex-1 font-extrabold text-white tracking-tight text-base h-11 border-0 transition-all duration-200 hover:scale-[1.02]"
              style={{
                boxShadow: "0 4px 20px rgba(225,29,72,0.45)",
                background: "linear-gradient(135deg, #ff4c61, #be123c)",
              }}
            >
              삭제하기
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
