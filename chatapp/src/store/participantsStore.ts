import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TParticipant } from '../types';

type ParticipantState = {
  participants: TParticipant[];
  lastUpdated: number;
  setParticipants: (users: TParticipant[]) => void;
  clear: () => void;
};

export const useParticipantStore = create<ParticipantState>()(
  persist(
    (set) => ({
      participants: [],
      lastUpdated: 0,
      setParticipants: (users) =>
        set({
          participants: users,
          lastUpdated: Date.now(),
        }),
      clear: () => set({ participants: [], lastUpdated: 0 }),
    }),
    {
      name: 'participant-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);