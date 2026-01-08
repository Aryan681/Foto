import React, { useState, useRef, useMemo, useCallback } from "react";
import { db } from "../../services/instantDb";
import { id } from "@instantdb/react";
import { MessageSquare, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Store & Components
import { useStore } from "../../store/UseStore";
import { EmojiBar } from "./compoments/EmojiBar";
import { EmojiStack } from "./compoments/EmojiStack";

export default function ImageCard({ img, onOpen }) {
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showHeart, setShowHeart] = useState(false); // ✅ Animation state
  const lastTap = useRef(0); // ✅ Track tap timing
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

  // ✅ Double Tap Logic
// Inside ImageCard.jsx
const handleInteraction = (e) => {
  const now = Date.now();
  if (now - lastTap.current < 300) {
    // Double Tap: React
    db.transact(db.tx.interactions[id()].update({
      imageId: img.id,
      type: "emoji",
      emoji: "❤️",
      user: name,
      userColor: color,
      createdAt: Date.now()
    }));
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  } else {
    // Single Tap: Delayed Open
    // We use a small timeout to ensure it wasn't the first half of a double tap
    timerRef.current = setTimeout(() => {
        if (Date.now() - lastTap.current >= 300) {
            onOpen();
        }
    }, 300);
  }
  lastTap.current = now;
};
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
      onClick={handleInteraction} // ✅ Use unified interaction handler
      className="group relative bg-panel border border-border rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">
        
        {/* ✅ Visual Heart Pop Animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2.2, opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center text-red-500 drop-shadow-2xl pointer-events-none"
            >
              <Heart size={80} fill="currentColor" strokeWidth={0} />
            </motion.div>
          )}
        </AnimatePresence>

        {!imageLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
             <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        <img 
          src={img.url} 
          alt="" 
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
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