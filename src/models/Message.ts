import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isRead: { type: Boolean, default: false },
});

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);