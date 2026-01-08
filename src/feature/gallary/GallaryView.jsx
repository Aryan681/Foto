import React, { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { loadGalleryPage } from "./Gallary.intent";
import ImageCard from "./ImageCard"; // ✅ Import the new component
import InteractionModal from "../interaction/intractionModel";

export default function GalleryView() {
  const [selectedImg, setSelectedImg] = useState(null);
  const loadMoreRef = useRef(null);

  // Requirement: Use React Query for API handling [cite: 70]
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = 
    useInfiniteQuery({
      queryKey: ["gallery"],
      queryFn: loadGalleryPage,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const images = data?.pages.flatMap((p) => p.images) ?? [];

  // Requirement: Support pagination or infinite scroll [cite: 23]
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isLoading) return <div className="p-10 text-center animate-pulse">Loading gallery...</div>;

  return (
    <div className="p-6">
      {/* Requirement: Render images in a scrollable grid [cite: 22] */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <ImageCard 
            key={img.id} 
            img={img} 
            onOpen={() => setSelectedImg(img)} 
          />
        ))}
      </div>

      {/* Intersection Observer Anchor */}
      <div ref={loadMoreRef} className="h-20" />

      {/* Requirement: Clicking an image opens a focused image view [cite: 24] */}
      {selectedImg && (
        <InteractionModal 
          img={selectedImg} 
          onClose={() => setSelectedImg(null)} 
        />
      )}
    </div>
  );
}