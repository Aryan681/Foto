
---

# FotoOwl Real-Time Discovery Engine 🚀

A high-performance, real-time image discovery platform built with **React**, **InstantDB**, and **TanStack Query**. This application features a seamless infinite-scroll gallery, a live activity hub, and image-level synchronization for social interactions.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: Zustand (with Persistence Middleware)
- **Data Fetching**: TanStack Query (React Query)
- **Real-Time DB**: InstantDB (NoSQL Graph-based)
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## 🚀 Performance & DSA Concepts

To meet enterprise-level UI/UX expectations, I implemented several advanced optimization strategies:

### 1. Proactive Double Buffering
To eliminate the "loading state" during infinite scrolling, the fetching logic uses a **Double Buffering** strategy. While the user views the current set of images, the system proactively fetches the next page into a background buffer.
- **Complexity**: $O(1)$ lookup using a memoized Hash Map.
- **Benefit**: 0ms perceived latency during page transitions.

### 2. Referential Equality & Memoization
- **useMemo**: Used to handle $O(N \log N)$ sorting operations on interaction streams, ensuring that the UI only recalculates when the raw data from InstantDB changes.
- **useCallback**: Memoized event handlers to prevent unnecessary re-renders of modular sub-components (EmojiBar, CommentInput).

### 3. Intersection Observer (Proactive Fetch)
Instead of waiting for the user to hit the bottom of the list, the observer triggers a fetch when the user is within `200px` of the end of the content, keeping the scroll experience fluid.

### 4. Pixel Rendering Optimizations
- **Background Decoding**: Utilized `decoding="async"` to offload heavy image processing from the main thread, maintaining 60FPS during scroll.
- **Layout Stability**: Implemented aspect-ratio boxes for all image containers to achieve zero Cumulative Layout Shift (CLS).
- **Graceful Entry**: Combined React state with CSS transitions to only fade-in images once the browser's `onLoad` event signals pixel-readiness.
---

## 📊 InstantDB Schema & Sync Strategy

The application utilizes a **Graph-based NoSQL schema** to handle real-time synchronization.

### Schema Definition
```javascript
{
  "interactions": {
    "imageId": "string",   // Scoped Image ID from Unsplash/Picsum
    "type": "string",      // 'emoji' | 'comment'
    "user": "string",      // Persistent Identity Name
    "userColor": "string", // Persistent Identity Color
    "emoji": "string",     // Optional: Selected emoji
    "text": "string",      // Optional: Comment text
    "createdAt": "number"  // Timestamp for Chronological Ordering
  }
}

```

### Sync Strategy

* **Image-Level Sync**: Queries are scoped using `where: { imageId: img.id }`, ensuring components only listen to updates relevant to their specific asset.
* **Global Feed Sync**: A separate listener on the `interactions` entity provides the "Live Activity Hub" with a real-time stream of global platform usage.

---

## ✨ Features

* **Persistent Identity**: Every user is assigned a unique, persistent name and color (stored via Zustand + LocalStorage) that remains consistent across sessions.
* **Stacked Social UI**: Real-time emoji reactions are rendered in a layered stack, with the most recent reaction always appearing on top.
* **Live Discussion**: A dedicated communication hub for every image with 12-hour AM/PM localized timestamps.
* **Mobile Optimized**: A fully responsive layout with a toggleable "Activity Hub" for smaller viewports.
* **System Stability**: Implemented a global **Error Boundary** to catch and handle unexpected neural engine interruptions gracefully.

---

## 🛠️ Local Setup

1. **Clone the repo**:
```bash
git clone <your-repo-link>
cd fotoOwl-INT

```


2. **Install dependencies**:
```bash
npm install

```


3. **Configure Environment**:
Create a `.env` file in the root directory:
```env
VITE_INSTANTDB_APP_ID=your_instantdb_id_here

```


4. **Run Development Server**:
```bash
npm run dev

```



---

## 📝 Assignment Requirements Checklist

* [x] **Clean decomposition**: Modularized Gallery, Feed, and Interaction components.
* [x] **Real-time Sync**: Full InstantDB integration.
* [x] **React Query**: Optimized API handling with pre-fetching.
* [x] **Zustand**: Persistent global context management.
* [x] **Performance**: Memoized state and callbacks.
* [x] **Controlled Inputs**: Sanitized and managed comment forms.
* [x] **Immutable State**: Strictly followed functional update patterns.

```



