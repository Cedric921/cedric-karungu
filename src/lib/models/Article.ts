import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';
import { LocalizedStringSchema } from './shared';

/** Blog article. Text fields are per-locale; empty locales fall back to EN. */
const ArticleSchema = new Schema(
  {
    title: { type: LocalizedStringSchema, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: LocalizedStringSchema, default: () => ({}) },
    content: { type: LocalizedStringSchema, default: () => ({}) }, // Markdown
    cover: { type: String, default: '' },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: null },
    readingMinutes: { type: Number, default: 1 },
  },
  { timestamps: true },
);

ArticleSchema.index({ published: 1, publishedAt: -1 });

export type ArticleDoc = InferSchemaType<typeof ArticleSchema> & { _id: mongoose.Types.ObjectId };

export const Article: Model<ArticleDoc> =
  (mongoose.models.Article as Model<ArticleDoc>) || mongoose.model<ArticleDoc>('Article', ArticleSchema);
