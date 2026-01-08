import React from "react";
import { X } from "lucide-react";

export const ImageSection = ({ url, onClose }) => (
  <div className="bg-black/40 flex items-center justify-center relative border-r border-border/50">
    <img 
      src={url} 
      alt="Focused" 
      className="max-w-full max-h-full object-contain p-2" 
    />
    <button 
      onClick={onClose} 
      className="absolute top-6 left-6 p-2.5 bg-black/60 rounded-full hover:bg-red-500/20 hover:text-red-400 text-white transition-all border border-white/10"
    >
      <X size={20} />
    </button>
  </div>
);