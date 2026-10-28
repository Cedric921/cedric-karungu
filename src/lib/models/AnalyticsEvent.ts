import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

export const ANALYTICS_TYPES = ['pageview', 'cv_download', 'social_click'] as const;
export type AnalyticsType = (typeof ANALYTICS_TYPES)[number];

/** One visitor action on the public site (no IP stored: visitors are a random browser id). */
const AnalyticsEventSchema = new Schema(
  {
    type: { type: String, enum: ANALYTICS_TYPES, required: true },
    visitorId: { type: String, required: true },
    path: { type: String, default: '' },
    platform: { type: String, default: '' }, // social_click: linkedin, github, …
    target: { type: String, default: '' }, // clicked URL
    referrer: { type: String, default: '' }, // referring host, '' when direct
    country: { type: String, default: '' },
    device: { type: String, default: 'desktop' },
    locale: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

AnalyticsEventSchema.index({ type: 1, createdAt: -1 });
// Keep two years of history.
AnalyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2 * 365 * 24 * 3600 });

export type AnalyticsEventDoc = InferSchemaType<typeof AnalyticsEventSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AnalyticsEvent: Model<AnalyticsEventDoc> =
  (mongoose.models.AnalyticsEvent as Model<AnalyticsEventDoc>) ||
  mongoose.model<AnalyticsEventDoc>('AnalyticsEvent', AnalyticsEventSchema);
