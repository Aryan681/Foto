import React, { useRef, useState, useMemo } from "react";
import { X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../../services/instantDb";
import { id } from "@instantdb/react";
import { useStore } from "../../../store/UseStore";

export const ImageSection = ({ url, onClose, imgId }) => {
  const lastTap = useRef(0);
  const [showHeart, setShowHeart] = useState(false);
  const [showUndo, setShowUndo] = useState(false); // ✅ NEW: Undo animation
  
  const identity = useStore((state) => state.identity);
  const { id: userId, name, color } = identity ?? {};

  const { data } = db.useQuery({ 
    interactions: { $: { where: { imageId: imgId } } }
  });

  const interactions = data?.interactions ?? [];
  
  const userReaction = useMemo(() => {
    return interactions.find(i => i.type === 'emoji' && i.userId === userId);
  }, [interactions, userId]);

  const handleInteraction = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // ✅ Double Tap: Toggle heart reaction
      if (userReaction && userReaction.emoji === "❤️") {
        // Remove reaction if already has heart
        db.transact(db.tx.interactions[userReaction.id].delete());
        setShowUndo(true);
        setTimeout(() => setShowUndo(false), 800);
      } else if (userReaction) {
        // Update to heart if has different emoji
        db.transact(
          db.tx.interactions[userReaction.id].update({
            emoji: "❤️",
            createdAt: Date.now(),
          })
        );
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
      } else {
        // Add new heart reaction
        db.transact(
          db.tx.interactions[id()].update({
            imageId: imgId,
            type: "emoji",
            emoji: "❤️",
            user: name,
            userId,
            userColor: color,
            createdAt: Date.now(),
          })
        );
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
      }
    }
    lastTap.current = now;
  };

  return (
    <div
      onClick={handleInteraction}
      className="relative w-full h-full bg-black/80 flex items-center justify-center overflow-hidden cursor-pointer"
    >
      {/* ✅ Heart Animation (Add/Update) */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2.5, opacity: 0 }}
            className="absolute z-50 text-red-500 pointer-events-none drop-shadow-2xl"
          >
            <Heart size={100} fill="currentColor" strokeWidth={0} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ NEW: Undo Animation (Remove) */}
      <AnimatePresence>
        {showUndo && (
          <motion.div
            initial={{ scale: 1.5, opacity: 1 }}
            animate={{ scale: 0.8, opacity: 0.5, rotate: 180 }}
            exit={{ opacity: 0 }}
            className="absolute z-50 text-gray-400 pointer-events-none drop-shadow-2xl"
          >
            <Heart size={100} strokeWidth={2} fill="none" />
          </motion.div>
        )}
      </AnimatePresence>

      <img
        src={url}
        alt="Focused"
        className="max-w-full max-h-full object-contain p-2 sm:p-4 rounded-2xl select-none pointer-events-none"
        draggable={false}
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 left-4 p-2.5 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white z-50 hover:bg-black/80 transition-colors"
      >
        <X size={20} />
      </button>

      {/* ✅ NEW: Visual hint for current reaction status */}
      {userReaction && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur border border-white/10 rounded-full text-xs text-white/80 flex items-center gap-2 pointer-events-none">
          <span className="text-lg">{userReaction.emoji}</span>
          <span>Double-tap to remove</span>
        </div>
      )}
    </div>
  );
};