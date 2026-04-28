"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
  orderBy,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { LinkType } from "@/data/links";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import { LinkItem } from "@/components/LinkItem";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { toast } from "sonner";

interface LinkListProps {
  /** 현재 로그인된 사용자의 uid */
  uid: string;
}

export function LinkList({ uid }: LinkListProps) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<LinkType | null>(null);

  // 1. 링크 목록 조회 (useQuery) - 실시간 리스너 제거
  const { data: links = [], isLoading } = useQuery({
    queryKey: ["links", uid],
    queryFn: async () => {
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

  // 2. 링크 추가 (useMutation)
  const addMutation = useMutation({
    mutationFn: async (newLink: LinkType) => {
      await setDoc(doc(db, "users", uid, "links", newLink.id), newLink);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] });
      toast.success("새 링크가 추가되었습니다.");
    },
  });

  // 3. 링크 업데이트 (useMutation)
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LinkType> }) => {
      await updateDoc(doc(db, "users", uid, "links", id), {
        ...data,
        updatedAt: Date.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] });
      toast.success("링크가 수정되었습니다.");
    },
  });

  // 4. 링크 삭제 (useMutation)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "users", uid, "links", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] });
      toast.success("링크가 삭제되었습니다.");
    },
  });

  const handleAddLink = async (newLink: LinkType) => {
    await addMutation.mutateAsync(newLink);
  };

  const handleUpdateLink = async (id: string, data: Partial<LinkType>) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDeleteRequest = (link: LinkType) => {
    setLinkToDelete(link);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-accent border-t-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* ── 링크 추가 버튼 ── */}
      <Button
        id="add-link-btn"
        onClick={() => setDialogOpen(true)}
        className="w-full h-12 font-semibold tracking-wide border-0 transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] mb-6"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
          boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
        }}
      >
        <span className="mr-2 text-base">+</span>
        새 링크 추가
      </Button>

      {/* ── 링크 목록 ── */}
      <section className="w-full flex flex-col gap-3">
        {links.length === 0 && (
          <div className="w-full rounded-2xl flex flex-col items-center justify-center py-10 gap-2 bg-accent/30 border border-dashed border-border">
            <span className="text-3xl">🔗</span>
            <p className="text-sm text-muted-foreground/60">아직 등록된 링크가 없습니다.</p>
          </div>
        )}

        {links.map((link) => (
          <LinkItem
            key={link.id}
            link={link}
            onUpdate={handleUpdateLink}
            onDeleteRequest={handleDeleteRequest}
          />
        ))}
      </section>

      {/* ── 추가 다이얼로그 ── */}
      <AddLinkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAddLink}
      />

      {/* ── 삭제 확인 다이얼로그 ── */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        link={linkToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
