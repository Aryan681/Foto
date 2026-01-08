import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      // --- Identity State ---
      identity: null,
      
      // Action to generate identity if it doesn't exist
      initializeIdentity: () => {
        set((state) => {
          if (state.identity) return state; // Already exists

          const adjectives = ["Swift", "Zen", "Hyper", "Vivid", "Neon"];
          const nouns = ["Pixel", "Coder", "Vision", "Lens", "Frame"];
          const colors = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

          return {
            identity: {
              name: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
                nouns[Math.floor(Math.random() * nouns.length)]
              }`,
              color: colors[Math.floor(Math.random() * colors.length)],
            },
          };
        });
      },

      // --- UI State ---
      selectedImg: null, // Scoped for InteractionModal
      setSelectedImg: (img) => set({ selectedImg: img }),

      isFeedOpen: false, // Scoped for Mobile Feed Toggle
      setIsFeedOpen: (isOpen) => set({ isFeedOpen: isOpen }),
    }),
    {
      name: "stat-genie-context",
      // Only persist the identity to localStorage
      partialize: (state) => ({ identity: state.identity }),
    }
  )
);