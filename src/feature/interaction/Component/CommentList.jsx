import React from "react";
import { MessageSquare, Clock } from "lucide-react";

export const CommentList = ({ isLoading, comments }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
        <div className="h-5 w-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-widest font-bold">Syncing...</span>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
        <MessageSquare size={48} className="mb-4" />
        <p className="text-sm italic">No comments on this image yet.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
      {comments.sort((a, b) => b.createdAt - a.createdAt).map((c) => (
        <div key={c.id} className="animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: c.userColor || '#888' }} 
              />
              <span 
                className="text-xs font-black uppercase tracking-tighter"
                style={{ color: c.userColor || '#fff' }}
              >
                {c.user}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-gray-500 font-mono">
              {new Date(c.createdAt).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </div>
          </div>
          <div className="text-sm text-gray-300 bg-panel border border-border/50 p-4 rounded-2xl rounded-tl-none leading-relaxed">
            {c.text}
          </div>
        </div>
      ))}
    </div>
  );
};