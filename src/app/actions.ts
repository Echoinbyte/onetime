'use server';

import { nanoid } from 'nanoid';
import connectDB from '@/lib/db';
import { Message } from '@/models/Message';
import { encryptMessage, decryptMessage } from '@/lib/crypto';

export async function createMessage(content: string, expireAt: number =24) {
  await connectDB();
  const id = nanoid();
  const encrypted = await encryptMessage(content);

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expireAt);

  await Message.create({
    id,
    content: encrypted,
    expiresAt,
    isRead: false,
  });

  return id;
}

export async function readMessage(id: string) {
  await connectDB();
  const message = await Message.findOne({ id, isRead: false });

  if (!message) {
    return null;
  }

  const decrypted = await decryptMessage(message.content);
  await Message.deleteOne({ id });

  return decrypted;
}