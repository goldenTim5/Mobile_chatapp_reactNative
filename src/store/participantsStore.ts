import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TParticipant } from '../types';

type ParticipantState = {
  participants: Record<string, TParticipant>;
  lastUpdated: number;
  setParticipants: (participants: TParticipant[]) => void;
  updateParticipant: (participant: TParticipant) => void;
  clear: () => void;
};

const isWeb = Platform.OS === 'web';

export const useParticipantStore = create<ParticipantState>()(
  isWeb
    ? 
    (set, get) => ({
        participants: {},
        lastUpdated: 0,
        setParticipants: (users) =>
          set({
            participants: users.reduce((acc, p) => {
              acc[p.uuid] = p;
              return acc;
            }, {} as Record<string, TParticipant>),
          }),
        updateParticipant: (participant) =>
          set({
            participants: {
              ...get().participants,
              [participant.uuid]: participant,
            },
          }),
        clear: () => set({ participants: {}, lastUpdated: 0 }),
      })
    : persist(
        (set, get) => ({
          participants: {},
          lastUpdated: 0,
          setParticipants: (users) =>
          set({
            participants: users.reduce((acc, p) => {
              acc[p.uuid] = p;
              return acc;
            }, {} as Record<string, TParticipant>),
          }),
        updateParticipant: (participant) =>
          set({
            participants: {
              ...get().participants,
              [participant.uuid]: participant,
            },
          }),
        clear: () => set({ participants: {}, lastUpdated: 0 }),
        }),
        {
          name: 'participants-storage',
          storage: createJSONStorage(() => AsyncStorage),
        }
      )
);