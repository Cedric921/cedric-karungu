import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const SocialLinkSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, default: '' }, // key matching constants.Icons or lucide name
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

SocialLinkSchema.index({ order: 1 });

export type SocialLinkDoc = InferSchemaType<typeof SocialLinkSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SocialLink: Model<SocialLinkDoc> =
  (mongoose.models.SocialLink as Model<SocialLinkDoc>) ||
  mongoose.model<SocialLinkDoc>('SocialLink', SocialLinkSchema);
