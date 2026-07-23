import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  id: string;
  title: string;
  titleEn?: string;
  date: string;
  year: number;
  outlet: string;
  outletEn?: string;
  description: string;
  descriptionEn?: string;
  type: string;
  links: { label: string; url: string }[];
  image: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String },
    titleEn: { type: String },
    date: { type: String },
    year: { type: Number },
    outlet: { type: String },
    outletEn: { type: String },
    description: { type: String },
    descriptionEn: { type: String },
    type: { type: String },
    links: [
      {
        label: { type: String },
        url: { type: String },
      },
    ],
    image: { type: String, default: null },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);
