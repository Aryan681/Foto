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


const SkeletonCard = () => (
  <div className="bg-white/5 border border-white/5 rounded-2xl aspect-square overflow-hidden animate-pulse">
    <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
  </div>
);

export default function GalleryView() {
  const { selectedImg, setSelectedImg } = useStore();
  const loadMoreRef = useRef(null);

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

  const images = useMemo(() => 
    data?.pages.flatMap((p) => p.images) ?? [], 
    [data]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" } 
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="p-4 lg:p-8 space-y-8">
      <header className="flex items-end justify-between px-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-1 flex items-center gap-2">
            <Sparkles size={14} /> FotoOwl
          </h2>
          <p className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Curated Visuals
          </p>
        </motion.div>
        <div className="hidden md:block text-[10px] font-mono text-gray-600 uppercase tracking-widest">
          {images.length} Objects Synced
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            images.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: (index % 12) * 0.03 
                }}
              >
                <ImageCard 
                  img={img} 
                  onOpen={() => setSelectedImg(img)} 
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

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

      {selectedImg && (
        <InteractionModal 
          img={selectedImg} 
          onClose={() => setSelectedImg(null)} 
        />
      )}
    </div>
  );
}