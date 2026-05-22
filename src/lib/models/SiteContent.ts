import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';
import { LocalizedStringSchema } from './shared';

/**
 * Key-based editable site content (hero headline, about text, CTAs, etc.)
 * key example: "hero.title", "about.bio", "contact.heading"
 */
const SiteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    group: { type: String, default: 'general', index: true },
    value: { type: LocalizedStringSchema, required: true },
    description: { type: String, default: '' }, // admin-facing helper text
  },
  { timestamps: true }
);

export type SiteContentDoc = InferSchemaType<typeof SiteContentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SiteContent: Model<SiteContentDoc> =
  (mongoose.models.SiteContent as Model<SiteContentDoc>) ||
  mongoose.model<SiteContentDoc>('SiteContent', SiteContentSchema);
