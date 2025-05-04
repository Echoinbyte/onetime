import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['compound', 'simple'], required: true },
  expiresAt: { type: Date, required: true },
  viewLimit: { type: Number, required: true, min: 1, max: 10, default: 1 },
  viewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Add middleware to check expiration
messageSchema.pre('findOne', function() {
  this.where({
    isActive: true,
    expiresAt: { $gt: new Date() }
  });
});

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);