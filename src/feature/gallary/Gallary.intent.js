import { fetchImages } from "../../services/unsplash.api";

export async function loadGalleryPage({ pageParam = 1 }) {
  const images = await fetchImages(pageParam);
  return {
    images,
    nextPage: pageParam + 1,
  };
}
