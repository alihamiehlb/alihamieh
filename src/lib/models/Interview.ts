import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  id: string;
  title: string;
  channel: string;
  date: string;
  description: string;
  url: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    channel: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);
