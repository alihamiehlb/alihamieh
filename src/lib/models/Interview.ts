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
    title: { type: String, required: true },
    titleEn: { type: String },
    date: { type: String, required: true },
    year: { type: Number, required: true },
    outlet: { type: String, required: true },
    outletEn: { type: String },
    description: { type: String, required: true },
    descriptionEn: { type: String },
    type: { type: String, required: true },
    links: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    image: { type: String, default: null },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);
