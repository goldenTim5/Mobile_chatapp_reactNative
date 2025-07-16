import axios from 'axios';
import type { TMessage, TParticipant } from '../types/chatTypes';

const BASE_URL = 'https://dummy-chat-server.tribechat.com/api';

export const fetchSessionInfo = async () => {
  const res = await axios.get(`${BASE_URL}/info`);
  return res.data;
};

export const fetchAllMessages = async (): Promise<TMessage[]> => {
  const res = await axios.get(`${BASE_URL}/messages/all`);
  return res.data;
};

export const fetchLatestMessages = async (): Promise<TMessage[]> => {
  const res = await axios.get(`${BASE_URL}/messages/latest`);
  return res.data;
};

export const fetchOlderMessages = async (refUuid: string): Promise<TMessage[]> => {
  const res = await axios.get(`${BASE_URL}/messages/older/${refUuid}`);
  return res.data;
};

export const fetchMessageUpdates = async (time: number): Promise<TMessage[]> => {
  const res = await axios.get(`${BASE_URL}/messages/updates/${time}`);
  return res.data;
};

export const postNewMessage = async (text: string): Promise<TMessage> => {
  const res = await axios.post(`${BASE_URL}/messages/new`, { text });
  return res.data;
};

export const fetchAllParticipants = async (): Promise<TParticipant[]> => {
  const res = await axios.get(`${BASE_URL}/participants/all`);
  return res.data;
};

export const fetchParticipantUpdates = async (time: number): Promise<TParticipant[]> => {
  const res = await axios.get(`${BASE_URL}/participants/updates/${time}`);
  return res.data;
};
