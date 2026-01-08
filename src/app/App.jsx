import React, { useEffect } from "react";
import GalleryView from "../feature/gallary/GallaryView";
import FeedView from "../feature/feed/FeedView";
import { useStore } from "../store/UseStore"; // ✅ New Zustand Hook
import { Activity, X } from "lucide-react";

export default function App() {
  const { isFeedOpen, setIsFeedOpen, initializeIdentity } = useStore();

  // Initialize persistent user identity on mount
  useEffect(() => {
    initializeIdentity();
  }, [initializeIdentity]);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#0D0F11]">
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <GalleryView />
        <button 
          onClick={() => setIsFeedOpen(true)} 
          className="lg:hidden fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-2xl z-40"
        >
          <Activity size={24} />
        </button>
      </main>

      <aside className={`
        fixed inset-0 z-50 bg-[#0D0F11]/95 backdrop-blur-xl transition-transform duration-500 
        lg:static lg:w-80 lg:translate-y-0 lg:border-l lg:border-white/5 
        ${isFeedOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="lg:hidden p-5 border-b border-white/5 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Activity Hub</span>
          <button onClick={() => setIsFeedOpen(false)}><X size={20} /></button>
        </div>
        <FeedView />
      </aside>
    </div>
  );
}