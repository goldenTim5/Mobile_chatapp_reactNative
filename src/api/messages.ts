import { TMessageJSON } from '../types';

const BASE_URL = 'https://dummy-chat-server.tribechat.com/api';

/**
 * Get server session info and API version.
 */
export const fetchSessionInfo = async (): Promise<{
  sessionUuid: string;
  apiVersion: number;
}> => {
  const res = await fetch(`${BASE_URL}/info`);
  if (!res.ok) throw new Error('Failed to fetch session info');
  return res.json();
};

/**
 * Get all chat messages (use cautiously).
 */
export const fetchAllMessages = async (): Promise<TMessageJSON[]> => {
  const res = await fetch(`${BASE_URL}/messages/all`);
  if (!res.ok) throw new Error('Failed to fetch all messages');
  return res.json();
};

/**
 * Get the latest 25 messages.
 */
export const fetchLatestMessages = async (): Promise<TMessageJSON[]> => {
  const res = await fetch(`${BASE_URL}/messages/latest`);
  if (!res.ok) throw new Error('Failed to fetch latest messages');
  return res.json();
};

/**
 * Get 25 older messages before the given message UUID.
 */
export const fetchOlderMessages = async (
  refMessageUuid: string
): Promise<TMessageJSON[]> => {
  const res = await fetch(`${BASE_URL}/messages/older/${refMessageUuid}`);
  if (!res.ok) throw new Error('Failed to fetch older messages');
  return res.json();
};

/**
 * Get messages updated after a certain time (timestamp in ms).
 */
export const fetchUpdatedMessages = async (
  sinceTime: number
): Promise<TMessageJSON[]> => {
  const res = await fetch(`${BASE_URL}/messages/updates/${sinceTime}`);
  if (!res.ok) throw new Error('Failed to fetch updated messages');
  return res.json();
};

/**
 * Post a new text message.
 */
export const postNewMessage = async (
  text: string
): Promise<TMessageJSON> => {
  const res = await fetch(`${BASE_URL}/messages/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
};