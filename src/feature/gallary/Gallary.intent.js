const imageCache = new Map();

export async function loadGalleryPage({ pageParam = 1 }) {
  if (imageCache.has(pageParam)) return imageCache.get(pageParam);

  const fetchPage = async (p) => {
    // Artificial latency for first load only
    await new Promise((r) => setTimeout(r, 400));
    return {
      images: Array.from({ length: 12 }).map((_, i) => ({
        id: `img-${p}-${i}`,
        url: `https://picsum.photos/seed/${p}-${i}/600/600`,
        author: `Creator ${p}-${i}`,
      })),
      nextPage: p + 1,
    };
  };

  const currentPageData = await fetchPage(pageParam);
  imageCache.set(pageParam, currentPageData);

  // DSA Concept: Proactive Double Buffering
  if (!imageCache.has(pageParam + 1)) {
    fetchPage(pageParam + 1).then(data => imageCache.set(pageParam + 1, data));
  }

  return currentPageData;
}