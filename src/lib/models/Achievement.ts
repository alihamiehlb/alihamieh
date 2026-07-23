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
    title: { type: String },
    description: { type: String },
    detail: { type: String },
    instagramHighlight: { type: String },
    category: { type: String },
    image: { type: String },
    source: { type: String },
    sourceUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
