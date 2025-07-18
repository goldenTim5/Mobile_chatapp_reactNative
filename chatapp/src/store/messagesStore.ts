import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TMessage } from '../types';

// Define your types
type MessageState = {
  messages: TMessage[];
  lastUpdated: number;
  setMessages: (msgs: TMessage[]) => void;
  addMessage: (msg: TMessage) => void;
  clear: () => void;
};

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messages: [],
      lastUpdated: 0,
      setMessages: (msgs) => set({ messages: msgs }),
      addMessage: (msg) => set({ messages: [msg, ...get().messages] }),
      clear: () => set({ messages: [], lastUpdated: 0 }),
    }),
    {
      name: 'message-storage',
      storage: createJSONStorage(() => AsyncStorage), // ✅ Fix here
    }
  )
);