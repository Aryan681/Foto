export async function fetchImages(page = 1) {
  // Simulating API latency
  await new Promise((r) => setTimeout(r, 600));

  // In a real app, you would use: 
  // fetch(`https://api.unsplash.com/photos?page=${page}&client_id=...`)
  return Array.from({ length: 12 }).map((_, i) => ({
    id: `img-${page}-${i}`,
    url: `https://picsum.photos/seed/${page}-${i}/600/400`,
    author: `Creator ${page}-${i}`
  }));
}