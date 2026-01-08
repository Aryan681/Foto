export function deriveGalleryState(images = []) {
  return {
    images,
    total: images.length,
    isEmpty: images.length === 0,
  };
}
