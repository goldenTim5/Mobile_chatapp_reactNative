import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TReaction } from "../types";

type ReactionState = {
  reactions: TReaction[];
  setReactions: (r: TReaction[]) => void;
  addReaction: (r: TReaction) => void;
  clear: () => void;
};

export const useReactionStore = create<ReactionState>()(
  persist(
    (set, get) => ({
      reactions: [],
      setReactions: (r) => set({ reactions: r }),
      addReaction: (r) => set({ reactions: [...get().reactions, r] }),
      clear: () => set({ reactions: [] }),
    }),
    {
      name: 'reaction-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);