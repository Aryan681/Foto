import React, { useState } from "react";
import { db } from "../../services/instantDb";
import { id } from "@instantdb/react";
import { X, Send, MessageSquare, Clock } from "lucide-react";

export default function InteractionModal({ img, onClose }) {
  const [comment, setComment] = useState("");

  // 1. Image-Level Sync: Scoped query for this specific image [cite: 40, 47]
  const { data, isLoading } = db.useQuery({
    interactions: {
      $: { where: { imageId: img.id } },
    },
  });

  const interactions = data?.interactions ?? [];
  const comments = interactions.filter((i) => i.type === "comment");

  // 2. Real-Time Transaction for Comments [cite: 34, 35]
const handleAddComment = (e) => {
  e.preventDefault();
  if (!comment.trim()) return;

  const identity = getIdentity();

  db.transact(
    db.tx.interactions[id()].update({
      imageId: img.id,
      type: "comment",
      text: comment,
      user: identity.name,       // ✅ Shows real name in feed
      userColor: identity.color,
      createdAt: Date.now(),
    })
  );
  setComment("");
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-panel border border-border w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-2xl shadow-black/50">
        
        {/* Left Section: Focused Image View [cite: 24] */}
        <div className="bg-black/40 flex items-center justify-center relative border-r border-border/50">
          <img 
            src={img.url} 
            alt="Focused" 
            className="max-w-full max-h-full object-contain p-2" 
          />
          <button 
            onClick={onClose} 
            className="absolute top-6 left-6 p-2.5 bg-black/60 rounded-full hover:bg-red-500/20 hover:text-red-400 text-white transition-all border border-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Right Section: Real-Time Communication Hub [cite: 36, 41] */}
        <div className="flex flex-col h-full bg-bg/20">
          <header className="p-6 border-b border-border bg-panel/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300">
                Live Discussion
              </h3>
            </div>
          </header>

          {/* Real-time Comment Stream [cite: 35, 45] */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
                <div className="h-5 w-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-xs uppercase tracking-widest font-bold">Syncing...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <MessageSquare size={48} className="mb-4" />
                <p className="text-sm italic">No comments on this image yet.</p>
              </div>
            ) : (
              comments.sort((a,b) => b.createdAt - a.createdAt).map((c) => (
                <div key={c.id} className="animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-accent uppercase tracking-tighter">
                      {c.user}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] text-gray-500 font-mono">
                      <Clock size={10} />
                      {new Date(c.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 bg-panel border border-border/50 p-4 rounded-2xl rounded-tl-none leading-relaxed">
                    {c.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Controlled Input for Real-time Submission [cite: 72] */}
          <form onSubmit={handleAddComment} className="p-6 border-t border-border bg-panel/20">
            <div className="relative group">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-bg border border-border rounded-2xl py-4 pl-5 pr-14 text-sm outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-gray-600"
              />
              <button 
                type="submit" 
                disabled={!comment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-accent hover:bg-accent hover:text-white rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-accent"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}