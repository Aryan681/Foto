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
  const [showHeart, setShowHeart] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const lastTap = useRef(0);
  const timerRef = useRef(null);

  const identity = useStore((state) => state.identity);
  const { id: userId, name, color } = identity ?? {};

  const { data } = db.useQuery({
    interactions: { $: { where: { imageId: img.id } } }
  });

  const interactions = data?.interactions ?? [];

  const userReaction = useMemo(() => {
    return interactions.find(i => i.type === 'emoji' && i.userId === userId);
  }, [interactions, userId]);

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

  // 	Add, Update, or Remove reaction
  const handleReactionToggle = useCallback((emoji) => {
    if (userReaction) {
      if (userReaction.emoji === emoji) {
        db.transact(db.tx.interactions[userReaction.id].delete());
        setShowUndo(true);
        setTimeout(() => setShowUndo(false), 800);
      } else {
        db.transact(
          db.tx.interactions[userReaction.id].update({ emoji, createdAt: Date.now() })
        );
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
      }
    } else {
      // No reaction
      db.transact(
        db.tx.interactions[id()].update({
          imageId: img.id,
          type: "emoji",
          emoji,
          user: name,
          userId,
          userColor: color,
          createdAt: Date.now()
        })
      );
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
  }, [userReaction, img.id, name, userId, color]);

  // Double Tap Logic
  const handleInteraction = (e) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double Tap
      handleReactionToggle("❤️");
    } else {
      // Single Tap (Removed onOpen() call here)
      // The timer logic for single tap can be removed entirely
      // since the default behavior is now just to set lastTap.current
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
    handleReactionToggle(emoji);
    setShowEmojiBar(false);
  }, [handleReactionToggle]);

  // New handler for opening the comment box
  const handleOpenComments = useCallback((e) => {
    e.stopPropagation(); // Prevent the card's handleInteraction from triggering
    onOpen();
  }, [onOpen]);

  return (
    <div
      onClick={handleInteraction}
      className="group relative bg-panel border border-border rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">

        {/* Heart Animation 	*/}
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

        {/* Undo Animation 	*/}
        <AnimatePresence>
          {showUndo && (
            <motion.div
              initial={{ scale: 1.5, opacity: 1 }}
              animate={{ scale: 0.8, opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center text-gray-400 drop-shadow-2xl pointer-events-none"
            >
              <Heart size={80} strokeWidth={2} fill="none" />
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
          isVisible={showEmojiBar}
          emojis={["❤️", "🔥", "😂", "😮", "👍"]}
          onReact={handleReact}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          userReaction={userReaction}
        />
        <EmojiStack
          uniqueEmojis={uniqueEmojis}
          totalCount={totalReactions}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          userReaction={userReaction}
        />
        <div className="flex items-center gap-1 text-gray-500 cursor-pointer" onClick={handleOpenComments}> {/* ADDED onClick HANDLER */}
          <MessageSquare size={16} className="text-gray-400" />
          <span className="text-[12px] font-bold">{commentCount}</span>
        </div>
      </div>
    </div>
  );
}