import React from "react";

export const EmojiStack = ({ uniqueEmojis, totalCount, onMouseEnter, onMouseLeave, userReaction }) => {
  if (totalCount === 0) {
    return (
      <div 
        className="text-[10px] text-gray-500 font-bold uppercase tracking-tight flex items-center gap-1.5 opacity-80 cursor-default"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span className="text-xl">💖</span> React
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-1 cursor-default group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={userReaction ? "You reacted - hover to change or remove" : "Hover to react"}
    >
      <div className="flex -space-x-5">
        {uniqueEmojis.map((emoji, idx) => {
          const isUserEmoji = userReaction?.emoji === emoji;
          return (
            <span 
              key={idx} 
              className={`
                text-2xl drop-shadow-md select-none transition-all
                ${isUserEmoji ? "scale-110 z-20 " : ""}
              `}
              style={{ zIndex: isUserEmoji ? 20 : 10 - idx }}
            >
              {emoji}
            </span>
          );
        })}
      </div>
      <span className="ml-1 text-[12px] font-black text-accent drop-shadow-sm">
        {totalCount}
      </span>
    </div>
  );
};