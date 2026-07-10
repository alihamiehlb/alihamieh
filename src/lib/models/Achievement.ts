import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  id: string;
  title: string;
  description: string;
  detail?: string;
  instagramHighlight?: string;
  category: string;
  image: string;
  source?: string;
  sourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    detail: { type: String },
    instagramHighlight: { type: String },
    category: { type: String, required: true },
    image: { type: String, required: true },
    source: { type: String },
    sourceUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
