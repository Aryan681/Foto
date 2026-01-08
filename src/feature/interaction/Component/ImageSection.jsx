import React, { useRef, useState } from "react";
import { X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../../services/instantDb";
import { id } from "@instantdb/react";
import { useStore } from "../../../store/UseStore";

export const ImageSection = ({ url, onClose, imgId }) => {
  const lastTap = useRef(0);
  const [showHeart, setShowHeart] = useState(false);
  
  // ✅ Get Identity for the transaction
  const identity = useStore((state) => state.identity);
  const { name, color } = identity ?? {};

  const handleInteraction = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // ✅ 1. Double Tap Detected: Write to InstantDB
      db.transact(
        db.tx.interactions[id()].update({
          imageId: imgId,
          type: "emoji",
          emoji: "❤️",
          user: name,
          userColor: color,
          createdAt: Date.now(),
        })
      );

      // ✅ 2. Trigger Visual Animation
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTap.current = now;
  };

  return (
    <div
      onClick={handleInteraction}
      className="relative w-full h-full bg-black/80 flex items-center justify-center overflow-hidden cursor-pointer"
    >
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

      <img
        src={url}
        alt="Focused"
        className="max-w-full max-h-full object-contain p-2 sm:p-4 rounded-2xl select-none pointer-events-none"
        draggable={false}
      />

      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents triggering double-tap when closing
          onClose();
        }}
        className="absolute top-4 left-4 p-2.5 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white z-50"
      >
        <X size={20} />
      </button>
    </div>
  );
};