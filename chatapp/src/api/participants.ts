import { TParticipant } from '../types';

const BASE_URL = 'https://dummy-chat-server.tribechat.com/api';

/**
 * Get all chat participants.
 */
export const fetchAllParticipants = async (): Promise<TParticipant[]> => {
  const res = await fetch(`${BASE_URL}/participants/all`);
  if (!res.ok) throw new Error('Failed to fetch participants');
  return res.json();
};

/**
 * Get participants updated after a certain time (timestamp in ms).
 */
export const fetchUpdatedParticipants = async (
  sinceTime: number
): Promise<TParticipant[]> => {
  const res = await fetch(`${BASE_URL}/participants/updates/${sinceTime}`);
  if (!res.ok) throw new Error('Failed to fetch updated participants');
  return res.json();
};
