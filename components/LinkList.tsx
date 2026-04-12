"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, setDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { LinkType } from "@/data/links";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import { LinkItem } from "@/components/LinkItem";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

export function LinkList() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<LinkType | null>(null);

  // Firestore에서 실시간으로 링크 로드 (createdAt 최신순)
  useEffect(() => {
    const q = query(
      collection(db, "users", "anonymous", "links"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks: LinkType[] = [];
      snapshot.forEach((docSnap) => {
        fetchedLinks.push(docSnap.data() as LinkType);
      });
      setLinks(fetchedLinks);
    });
    return () => unsubscribe();
  }, []);

  const handleAddLink = async (newLink: LinkType) => {
    await setDoc(doc(db, "users", "anonymous", "links", newLink.id), newLink);
  };

  const handleUpdateLink = async (id: string, data: Partial<LinkType>) => {
    await updateDoc(doc(db, "users", "anonymous", "links", id), {
      ...data,
      updatedAt: Date.now(),
    });
  };

  const handleDeleteRequest = (link: LinkType) => {
    setLinkToDelete(link);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteDoc(doc(db, "users", "anonymous", "links", id));
  };

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

