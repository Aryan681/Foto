import React, { useState } from "react";
import { db } from "../../services/instantDb";
import { id } from "@instantdb/react";
import { MessageSquare } from "lucide-react";

// ✅ Modular Imports & Store
import { useStore } from "../../store/UseStore";
import { ImageSection } from "./Component/ImageSection";
import { CommentList } from "./Component/CommentList";
import { CommentInput } from "./Component/CommentInput";

export default function InteractionModal({ img, onClose }) {
  const [comment, setComment] = useState("");
  
  // ✅ Zustand: Get global identity
  const identity = useStore((state) => state.identity);
  const { name, color } = identity ?? {};

  // 1. Image-Level Sync: Scoped query for this specific image
  const { data, isLoading } = db.useQuery({
    interactions: {
      $: { where: { imageId: img.id } },
    },
  });

  const interactions = data?.interactions ?? [];
  const comments = interactions.filter((i) => i.type === "comment");

  // 2. Real-Time Transaction for Comments
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    db.transact(
      db.tx.interactions[id()].update({
        imageId: img.id,
        type: "comment",
        text: comment,
        user: name,      // ✅ Centralized name
        userColor: color, // ✅ Centralized color
        createdAt: Date.now(),
      })
    );
    setComment("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-panel border border-border w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-2xl shadow-black/50">
        
        <ImageSection url={img.url} onClose={onClose} />

        <div className="flex flex-col h-full bg-bg/20">
          <header className="p-6 border-b border-border bg-panel/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300">
                Live Discussion
              </h3>
            </div>
          </header>

          <CommentList isLoading={isLoading} comments={comments} />

          <CommentInput 
            value={comment} 
            onChange={setComment} 
            onSubmit={handleAddComment} 
          />
        </div>
      </div>
    </div>
  );
}