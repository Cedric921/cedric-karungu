import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const MessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    archived: { type: Boolean, default: false, index: true },
    locale: { type: String, default: 'en' },
    userAgent: { type: String, default: '' },
    ip: { type: String, default: '' },
    emailSent: { type: Boolean, default: false },
    emailError: { type: String, default: '' },
  },
  { timestamps: true }
);

MessageSchema.index({ createdAt: -1 });

export type MessageDoc = InferSchemaType<typeof MessageSchema> & { _id: mongoose.Types.ObjectId };

export const Message: Model<MessageDoc> =
  (mongoose.models.Message as Model<MessageDoc>) ||
  mongoose.model<MessageDoc>('Message', MessageSchema);
