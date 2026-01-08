import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../../services/instantDb";
import { id } from "@instantdb/react";
import { MessageSquare } from "lucide-react";

// Modular Imports & Store
import { useStore } from "../../store/UseStore";
import { ImageSection } from "./Component/ImageSection";
import { CommentList } from "./Component/CommentList";
import { CommentInput } from "./Component/CommentInput";

export default function InteractionModal({ img, onClose }) {
  const [comment, setComment] = useState("");
  const identity = useStore((state) => state.identity);
  const { name, color } = identity ?? {};

  const { data, isLoading } = db.useQuery({
    interactions: { $: { where: { imageId: img.id } } },
  });

  const interactions = data?.interactions ?? [];
  const comments = interactions.filter((i) => i.type === "comment");

  // Global Interaction & Scroll Lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleAddComment = useCallback((e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    db.transact(
      db.tx.interactions[id()].update({
        imageId: img.id,
        type: "comment",
        text: comment,
        user: name,
        userColor: color,
        createdAt: Date.now(),
      })
    );
    setComment("");
  }, [comment, img.id, name, color]);

  return (
    <div 
      className="fixed inset-0 z-100 flex items-end lg:items-center justify-center bg-black/55 backdrop-blur-2xl p-0 lg:p-10"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()} 
        className="
          bg-panel border-t lg:border border-white/10 
          w-full max-w-5xl h-[92vh] lg:h-[85vh] 
          rounded-t-4xl lg:rounded-[48px] 
          flex flex-col lg:grid lg:grid-cols-[1.2fr_0.8fr] 
          overflow-hidden shadow-2xl
        "
      >
        {/* Mobile Handle */}
        <div className="lg:hidden w-12 h-1 bg-white/20 rounded-full mx-auto my-3 shrink-0" />

        {/* 1. Image View */}
        <div className="h-[25vh] sm:h-[30vh] lg:h-full shrink-0">
<ImageSection url={img.url} onClose={onClose} imgId={img.id} />
        </div>

        {/* 2. Discussion Hub */}
        <div className="flex flex-col flex-1 min-h-0 bg-[#0A0C0E]/40 overflow-hidden">
          
          {/* ✅ CHANGED: Added 'hidden lg:block' to hide header on mobile */}
          <header className="hidden lg:block p-6 border-b border-border bg-panel/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300">
                Live Discussion
              </h3>
            </div>
          </header>

          {/* Comment list occupies the remaining space */}
          <CommentList isLoading={isLoading} comments={comments} />

          {/* Input pinned at the bottom */}
          <div className="p-4 lg:p-6 bg-linear-to-t from-black to-transparent shrink-0">
             <CommentInput 
                value={comment} 
                onChange={setComment} 
                onSubmit={handleAddComment} 
              />
          </div>
        </div>
      </motion.div>
    </div>
  );
}