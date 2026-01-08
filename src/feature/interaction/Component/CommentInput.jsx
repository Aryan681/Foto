import React from "react";
import { Send } from "lucide-react";

export const CommentInput = ({ value, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="p-6 border-t border-border bg-panel/20">
    <div className="relative group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full bg-bg border border-border rounded-2xl py-4 pl-5 pr-14 text-sm outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-gray-600"
      />
      <button 
        type="submit" 
        disabled={!value.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-accent hover:bg-accent hover:text-white rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-accent"
      >
        <Send size={18} />
      </button>
    </div>
  </form>
);