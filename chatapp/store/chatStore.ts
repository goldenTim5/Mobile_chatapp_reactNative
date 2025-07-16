
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

export type TMessageAttachment = {
  uuid: string;
  type: 'image';
  url: string;
  width: number;
  height: number;
};

export type TReaction = {
  uuid: string;
  participantUuid: string;
  value: string;
};

export type TParticipant = {
  uuid: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  jobTitle?: string;
  createdAt: number;
  updatedAt: number;
};

export type TMessage = {
  uuid: string;
  text: string;
  attachments: TMessageAttachment[];
  replyToMessageUuid?: string;
  reactions: TReaction[];
  authorUuid: string;
  sentAt: number;
  updatedAt: number;
};

export type TMessageJSON = Omit<TMessage, 'replyToMessageUuid'> & {
  replyToMessage?: Omit<TMessage, 'replyToMessageUuid'>;
};

interface ChatState {
  messages: TMessage[];
  participants: TParticipant[];
  setMessages: (messages: TMessage[]) => void;
  setParticipants: (participants: TParticipant[]) => void;
  addMessage: (message: TMessage) => void;
  updateMessage: (message: TMessage) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      participants: [],
      setMessages: (messages) => set({ messages }),
      setParticipants: (participants) => set({ participants }),
      addMessage: (message) => set({ messages: [message, ...get().messages] }),
      updateMessage: (message) => set({
        messages: get().messages.map(m => m.uuid === message.uuid ? message : m)
      }),
    }),
    {
      name: 'chat-storage',
      // storage: AsyncStorage,
    }
  )
);
