import React from "react";

export const EmojiBar = ({ isVisible, emojis, onReact, onMouseEnter, onMouseLeave, userReaction }) => (
  <div 
    className={`absolute bottom-[100%] left-4 flex gap-2 bg-black/80 backdrop-blur-md p-2 rounded-xl transition-all duration-300 transform border border-white/10 z-50 shadow-2xl ${
      isVisible ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-2 pointer-events-none"
    }`}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {emojis.map((emoji) => {
      const isSelected = userReaction?.emoji === emoji;
      return (
        <button
          key={emoji}
          onClick={(e) => onReact(emoji, e)}
          className={`
            relative transition-all px-1 text-2xl drop-shadow-sm
            ${isSelected ? "scale-110" : "hover:scale-125"}
          `}
          title={isSelected ? "Click to remove reaction" : "React"}
        >
          {emoji}
          {/* ✅ Blue dot indicator for selected emoji */}
          {isSelected && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" />
          )}
        </button>
      );
    })}
    {/* Message Bubble Tail */}
    <div className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/80" />
  </div>
);