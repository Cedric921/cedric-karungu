import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';
import { LocalizedStringSchema } from './shared';
import { MAX_PROJECT_IMAGES } from '../slug';

const ProjectSchema = new Schema(
  {
    title: { type: LocalizedStringSchema, required: true },
    slug: { type: String, default: '', index: true },
    description: { type: LocalizedStringSchema, required: true },
    category: { type: LocalizedStringSchema, required: true },
    image: { type: String, default: '' },
    gallery: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= MAX_PROJECT_IMAGES,
        message: `A project can have at most ${MAX_PROJECT_IMAGES} images`,
      },
    },
    link: { type: String, default: '' },
    githubLink: { type: String, default: '' },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

ProjectSchema.index({ order: 1, createdAt: -1 });

export type ProjectDoc = InferSchemaType<typeof ProjectSchema> & { _id: mongoose.Types.ObjectId };

export const Project: Model<ProjectDoc> =
  (mongoose.models.Project as Model<ProjectDoc>) ||
  mongoose.model<ProjectDoc>('Project', ProjectSchema);
