import React, { useState } from "react";
import GalleryView from "../feature/gallary/GallaryView";
import FeedView from "../feature/feed/FeedView";
import { Activity } from "lucide-react";

export default function App() {
  const [showMobileFeed, setShowMobileFeed] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-bg">
      {/* 1. Main Gallery Section */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <GalleryView />
        
        {/* Mobile-only Activity Toggle */}
        <button 
          onClick={() => setShowMobileFeed(true)}
          className="lg:hidden fixed bottom-6 right-6 p-4 bg-accent text-white rounded-full shadow-2xl z-40 active:scale-95 transition-transform"
        >
          <Activity size={24} />
        </button>
      </main>

      {/* 2. Real-Time Feed Section */}
      {/* Desktop: Persistent Side Column | Mobile: Animated Slide-up Overlay */}
      <aside className={`
        /* Desktop Styles */
        lg:w-80 xl:w-96 lg:flex lg:relative lg:border-l lg:translate-y-0
        
        /* Mobile Overlay Styles */
        fixed inset-0 z-50 bg-bg/95 backdrop-blur-xl transition-transform duration-500 flex flex-col
        ${showMobileFeed ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
      `}>
        {/* Mobile-only Close Header */}
        <div className="lg:hidden p-4 border-b border-border flex justify-between items-center bg-panel">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Activity Hub</span>
          <button 
            onClick={() => setShowMobileFeed(false)}
            className="text-gray-400 hover:text-white px-3 py-1 text-xs font-bold border border-border rounded-lg"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <FeedView />
        </div>
      </aside>
    </div>
  );
}