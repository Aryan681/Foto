import React from "react";
import { db } from "../../services/instantDb";

export default function FeedView() {
  // Real-time synchronization (Mandatory requirement) [cite: 27, 62]
  const { data, isLoading, error } = db.useQuery({
    interactions: {
      // Use the options object for ordering and limiting
      $: {
        order: { serverCreatedAt: "desc" }, // InstantDB also provides serverCreatedAt automatically
        limit: 50,
      },
    },
  });

  if (isLoading) return (
    <div className="p-4 text-gray-500 animate-pulse text-xs uppercase tracking-widest">
      Syncing Live Feed...
    </div>
  );

  if (error) return (
    <div className="p-4 border border-red-900/30 bg-red-900/5 m-4 rounded text-red-400 text-xs">
      <strong>Schema Sync Error:</strong> {error.message}
    </div>
  );

  const events = data?.interactions ?? [];

  return (
    <div className="flex flex-col h-full border-l border-border bg-bg">
      <header className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Global Activity</h2>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping" />
          <span className="text-[9px] font-bold text-green-500">LIVE</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {events.length === 0 ? (
          <p className="text-gray-600 text-sm italic text-center py-10">Waiting for interactions...</p>
        ) : (
          events.map((event) => (
            <div 
              key={event.id} 
              className="p-3 bg-panel border border-border rounded-lg animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-accent">{event.user}</span>
                  <span className="text-gray-400">
                    {event.type === "emoji" ? `reacted ${event.emoji}` : `commented`}
                  </span>
                </div>
                {event.type === "comment" && (
                  <p className="text-gray-300 text-sm mt-1 border-l-2 border-accent/30 pl-2">
                    “{event.text}”
                  </p>
                )}
                <span className="text-[9px] text-gray-600 font-mono mt-1">Img: {event.imageId}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}