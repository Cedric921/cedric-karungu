import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const SkillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    category: { type: String, required: true, trim: true },
    logoUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

SkillSchema.index({ category: 1, order: 1 });

export type SkillDoc = InferSchemaType<typeof SkillSchema> & { _id: mongoose.Types.ObjectId };

export const Skill: Model<SkillDoc> =
  (mongoose.models.Skill as Model<SkillDoc>) ||
  mongoose.model<SkillDoc>('Skill', SkillSchema);
