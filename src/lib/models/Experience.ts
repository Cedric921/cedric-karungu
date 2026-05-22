import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';
import { LocalizedStringSchema } from './shared';

const ExperienceSchema = new Schema(
  {
    role: { type: LocalizedStringSchema, required: true },
    company: { type: String, required: true, trim: true },
    period: { type: LocalizedStringSchema, required: true },
    location: { type: LocalizedStringSchema, required: true },
    description: { type: LocalizedStringSchema, required: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

ExperienceSchema.index({ order: 1, createdAt: -1 });

export type ExperienceDoc = InferSchemaType<typeof ExperienceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Experience: Model<ExperienceDoc> =
  (mongoose.models.Experience as Model<ExperienceDoc>) ||
  mongoose.model<ExperienceDoc>('Experience', ExperienceSchema);
