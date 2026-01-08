import React, { useState, useRef, useMemo, useCallback } from "react";
import { db } from "../../services/instantDb";
import { id } from "@instantdb/react";
import { MessageSquare } from "lucide-react";

// Store & Components
import { useStore } from "../../store/UseStore";
import { EmojiBar } from "./compoments/EmojiBar";
import { EmojiStack } from "./compoments/EmojiStack";

export default function ImageCard({ img, onOpen }) {
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // ✅ Track actual pixel readiness
  const timerRef = useRef(null);
  
  const identity = useStore((state) => state.identity);
  const { name, color } = identity ?? {};

  const { data } = db.useQuery({ 
    interactions: { $: { where: { imageId: img.id } } }
  });

  const interactions = data?.interactions ?? [];

  const { uniqueEmojis, totalReactions, commentCount } = useMemo(() => {
    const emojiInteractions = interactions.filter(i => i.type === 'emoji');
    const comments = interactions.filter(i => i.type === 'comment');
    const sorted = [...emojiInteractions].sort((a, b) => b.createdAt - a.createdAt);
    return {
      uniqueEmojis: [...new Set(sorted.map(i => i.emoji))].slice(0, 3),
      totalReactions: emojiInteractions.length,
      commentCount: comments.length
    };
  }, [interactions]);

  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowEmojiBar(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timerRef.current = setTimeout(() => setShowEmojiBar(false), 500);
  }, []);

  const handleReact = useCallback((emoji, e) => {
    e.stopPropagation();
    db.transact(db.tx.interactions[id()].update({
      imageId: img.id, type: "emoji", emoji, user: name, userColor: color, createdAt: Date.now()
    }));
    setShowEmojiBar(false);
  }, [img.id, name, color]);

  return (
    <div 
      onClick={onOpen}
      className="group relative bg-panel border border-border rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
    >
      {/* 1. ASPECT RATIO CONTAINER: Prevents Layout Shift (CLS) */}
      <div className="relative aspect-square overflow-hidden bg-white/5">
        
        {/* 2. BLUR PLACEHOLDER: Shown while the real pixels are decoding */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
             <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        <img 
          src={img.url} 
          alt="" 
          loading="lazy"
          decoding="async" // ✅ CRITICAL: Offloads decoding to a background thread
          onLoad={() => setImageLoaded(true)} // ✅ Only shows when pixels are READY
          className={`
            w-full h-full object-cover transition-all duration-700
            ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105 blur-lg"}
            group-hover:scale-110
          `} 
        />
        
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
          <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">
            {img.author || "Unsplash Creator"}
          </p>
        </div>
      </div>

      <div className="p-3 relative flex items-center justify-between bg-panel/50 backdrop-blur-sm border-t border-border/30">
        <EmojiBar 
          isVisible={showEmojiBar} emojis={["❤️", "🔥", "😂", "😮", "👍"]} 
          onReact={handleReact} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
        />
        <EmojiStack 
          uniqueEmojis={uniqueEmojis} totalCount={totalReactions}
          onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
        />
        <div className="flex items-center gap-1 text-gray-500">
          <MessageSquare size={16} className="text-gray-400" />
          <span className="text-[12px] font-bold">{commentCount}</span>
        </div>
      </div>
    </div>
  );
}