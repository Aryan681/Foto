import React, { useState, useRef } from "react";
import { db } from "../../services/instantDb";
import { id } from "@instantdb/react";
import { MessageSquare } from "lucide-react";
import { getIdentity } from "../../utils/identity";
import { EmojiBar } from "./compoments/EmojiBar";
import { EmojiStack } from "./compoments/EmojiStack";

export default function ImageCard({ img, onOpen }) {
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const timerRef = useRef(null);
  const quickEmojis = ["💖", "🔥", "😂", "😮", "👍"];

  // 1. Data Sync
  const { data } = db.useQuery({ 
    interactions: { $: { where: { imageId: img.id } } }
  });

  const interactions = data?.interactions ?? [];
  const { name, color } = getIdentity();

  // 2. Interaction Logic
  const emojiInteractions = interactions.filter(i => i.type === 'emoji');
  const commentCount = interactions.filter(i => i.type === 'comment').length;
  
  const sortedEmojis = [...emojiInteractions].sort((a, b) => b.createdAt - a.createdAt);
  const uniqueEmojis = [...new Set(sortedEmojis.map(i => i.emoji))].slice(0, 3);
  const totalReactions = emojiInteractions.length;

  // 3. Hover Handlers
  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowEmojiBar(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setShowEmojiBar(false), 500);
  };

  const handleReact = (emoji, e) => {
    e.stopPropagation();
    db.transact(
      db.tx.interactions[id()].update({
        imageId: img.id,
        type: "emoji",
        emoji: emoji,
        user: name,
        userColor: color,
        createdAt: Date.now(),
      })
    );
    setShowEmojiBar(false);
  };

  return (
    <div 
      onClick={onOpen}
      className="group relative bg-panel border border-border rounded-2xl overflow-hidden hover:border-accent/40 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
    >
      {/* Visual Asset Section */}
      <div className="relative aspect-square overflow-hidden bg-black/20">
        <img src={img.url} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
          <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">
            {img.author || "Unsplash Creator"}
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-3 relative flex items-center justify-between bg-panel/50 backdrop-blur-sm border-t border-border/30">
        <EmojiBar 
          isVisible={showEmojiBar} 
          emojis={quickEmojis} 
          onReact={handleReact}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />

        <EmojiStack 
          uniqueEmojis={uniqueEmojis}
          totalCount={totalReactions}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        
        <div className="flex items-center gap-1 text-gray-500">
          <MessageSquare size={20} className="text-gray-400" />
          <span className="text-[12px] font-bold">{commentCount}</span>
        </div>
      </div>
    </div>
  );
}