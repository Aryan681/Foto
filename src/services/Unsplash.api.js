export async function fetchImages(page = 1) {
  await new Promise((r) => setTimeout(r, 600));

 
  return Array.from({ length: 12 }).map((_, i) => ({
    id: `img-${page}-${i}`,
    url: `https://picsum.photos/seed/${page}-${i}/600/400`,
    author: `Creator ${page}-${i}`
  }));
}