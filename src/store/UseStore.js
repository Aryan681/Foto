import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid"; 

export const useStore = create(
  persist(
    (set) => ({
      identity: null,
      
      initializeIdentity: () => {
        set((state) => {
          if (state.identity) return state; 

          const adjectives = ["Swift", "Zen", "Hyper", "Vivid", "Neon"];
          const nouns = ["Pixel", "Coder", "Vision", "Lens", "Frame"];
          const colors = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

          return {
            identity: {
              id: nanoid(), 
              name: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
                nouns[Math.floor(Math.random() * nouns.length)]
              }`,
              color: colors[Math.floor(Math.random() * colors.length)],
            },
          };
        });
      },

      selectedImg: null,
      setSelectedImg: (img) => set({ selectedImg: img }),

      isFeedOpen: false,
      setIsFeedOpen: (isOpen) => set({ isFeedOpen: isOpen }),
    }),
    {
      name: "stat-genie-context",
      partialize: (state) => ({ identity: state.identity }),
    }
  )
);