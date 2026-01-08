import React from "react";
import { MessageSquare, Clock } from "lucide-react";

export const CommentList = ({ isLoading, comments }) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-600">
        <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 italic p-10">
        <MessageSquare size={48} className="mb-4" />
        <p className="text-sm">No comments yet.</p>
      </div>
    );
  }

  return (
    /* ✅ flex-1 allows it to fill the space, overflow-y-auto enables scrolling */
    <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar touch-pan-y">
      {comments.sort((a, b) => b.createdAt - a.createdAt).map((c) => (
        <div key={c.id} className="animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.userColor }} />
              <span className="text-xs font-black uppercase" style={{ color: c.userColor }}>{c.user}</span>
            </div>
            <div className="text-[9px] text-gray-500 font-mono">
              {new Date(c.createdAt).toLocaleTimeString('en-US', {
                hour: 'numeric', minute: '2-digit', hour12: true
              })}
            </div>
          </div>
          <div className="text-sm text-gray-300 bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none leading-relaxed">
            {c.text}
          </div>
        </div>
      ))}
    </div>
  );
};