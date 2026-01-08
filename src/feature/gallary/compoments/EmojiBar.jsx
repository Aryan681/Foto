import React from "react";

export const EmojiBar = ({ isVisible, emojis, onReact, onMouseEnter, onMouseLeave }) => (
  <div 
    className={`absolute bottom-[100%] left-4 flex gap-2 bg-black/80 backdrop-blur-md p-2 rounded-xl transition-all duration-300 transform border border-white/10 z-50 shadow-2xl ${
      isVisible ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-2 pointer-events-none"
    }`}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {emojis.map((emoji) => (
      <button
        key={emoji}
        onClick={(e) => onReact(emoji, e)}
        className="hover:scale-125 transition-transform px-1 text-2xl drop-shadow-sm" 
      >
        {emoji}
      </button>
    ))}
    {/* Message Bubble Tail */}
    <div className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/80" />
  </div>
);