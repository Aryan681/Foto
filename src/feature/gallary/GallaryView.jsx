import React, { useRef, useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

// Services & Store
import { loadGalleryPage } from "./Gallary.intent";
import { useStore } from "../../store/UseStore";

// Components
import ImageCard from "./ImageCard";
import InteractionModal from "../interaction/intractionModel";

/**
 * Skeleton Loader for high-end initial state
 */
const SkeletonCard = () => (
  <div className="bg-white/5 border border-white/5 rounded-2xl aspect-square overflow-hidden animate-pulse">
    <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
  </div>
);

export default function GalleryView() {
  // 1. Zustand Global State
  const { selectedImg, setSelectedImg } = useStore();
  const loadMoreRef = useRef(null);

  // 2. Optimized API Handling with TanStack Query
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useInfiniteQuery({
    queryKey: ["gallery"],
    queryFn: loadGalleryPage, // Uses the Double Buffering logic
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 mins
  });

  // 3. Performance Optimization: Memoize flattened image array
  const images = useMemo(() => 
    data?.pages.flatMap((p) => p.images) ?? [], 
    [data]
  );

  // 4. Proactive Infinite Scroll with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger fetch when user is close to bottom
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" } // Proactive fetch before user hits bottom
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Aesthetic Header Area */}
      <header className="flex items-end justify-between px-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-1 flex items-center gap-2">
            <Sparkles size={14} /> Global Discovery
          </h2>
          <p className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Curated Visuals
          </p>
        </motion.div>
        <div className="hidden md:block text-[10px] font-mono text-gray-600 uppercase tracking-widest">
          {images.length} Objects Synced
        </div>
      </header>

      {/* Grid Implementation with Staggered Entry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            // Initial Skeleton State
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            images.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: (index % 12) * 0.03 // DSA Staggering algorithm
                }}
              >
                <ImageCard 
                  img={img} 
                  onOpen={() => setSelectedImg(img)} // Triggers Zustand store
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Optimized Infinite Scroll Anchor */}
      <div ref={loadMoreRef} className="h-40 flex flex-col items-center justify-center gap-4">
        {isFetchingNextPage && (
          <>
            <Loader2 className="animate-spin text-blue-500" size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
              Fetching Buffer...
            </span>
          </>
        )}
      </div>

      {/* Focused Image View (Modal) */}
      {selectedImg && (
        <InteractionModal 
          img={selectedImg} 
          onClose={() => setSelectedImg(null)} 
        />
      )}
    </div>
  );
}