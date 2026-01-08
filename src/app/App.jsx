import GalleryView from "../feature/gallary/GallaryView";
import FeedView from "../feature/feed/FeedView";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Gallery Section - 3/4 width [cite: 15] */}
      <main className="flex-1 overflow-y-auto bg-bg custom-scrollbar">
        <GalleryView />
      </main>

      {/* Feed Section - 1/4 width [cite: 17] */}
      <aside className="w-80 lg:w-96 border-l border-border bg-bg/50 backdrop-blur-md overflow-hidden flex flex-col">
        <FeedView />
      </aside>
    </div>
  );
}