import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TMessage } from '../types';

  type MessageState = {
    messages: TMessage[];
    lastUpdated: number;
    setMessages: (msgs: TMessage[]) => void;
    addMessage: (msg: TMessage) => void;
    clear: () => void;
    prependMessages: (olderMessages: TMessage[]) => void;
  };

  const isWeb = Platform.OS === 'web';

  export const useMessageStore = create<MessageState>()(
    isWeb
      ? 
      (set, get) => ({
          messages: [],
          lastUpdated: 0,
          setMessages: (msgs) => set({ messages: msgs }),
          addMessage: (msg) => set({ messages: [msg, ...get().messages] }),
          clear: () => set({ messages: [], lastUpdated: 0 }),
          prependMessages: (olderMessages: TMessage[]) => {
            set((state) => ({
              messages: [...olderMessages.reverse(), ...state.messages],
            }));
          },
        })
      : persist(
          (set, get) => ({
            messages: [],
            lastUpdated: 0,
            setMessages: (msgs) => set({ messages: msgs }),
            addMessage: (msg) => set({ messages: [msg, ...get().messages] }),
            clear: () => set({ messages: [], lastUpdated: 0 }),
            prependMessages: (olderMessages: TMessage[]) => {
            set((state) => ({
              messages: [...olderMessages.reverse(), ...state.messages],
            }));
          },
          }),
          {
            name: 'message-storage',
            storage: createJSONStorage(() => AsyncStorage),
          }
        )
  );
