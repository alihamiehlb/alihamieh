import mongoose, { Schema, Document } from 'mongoose';

export interface ICv extends Document {
  skills: string[];
  summary?: string;
  name: string;
  title: string;
  birthDate?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  location?: string;
  documentFileName?: string;
  highlights?: string[];
  experience?: Array<{
    title: string;
    period: string;
    summary: string;
  }>;
  education?: Array<{
    school: string;
    detail: string;
  }>;
  skillGroups?: Array<{
    label: string;
    items: string[];
  }>;
  selectedProjects?: Array<{
    name: string;
    role: string;
    url: string;
  }>;
  certifications?: string[];
  learningSources?: Array<{
    name: string;
    focus: string;
  }>;
  lastUpdated?: string;
  sourcePdfs?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CvSchema = new Schema<ICv>(
  {
    skills: [{ type: String }],
    summary: { type: String },
    name: { type: String, required: true },
    title: { type: String, required: true },
    birthDate: { type: String },
    tagline: { type: String },
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    documentFileName: { type: String },
    highlights: [{ type: String }],
    experience: [
      {
        title: { type: String, required: true },
        period: { type: String, required: true },
        summary: { type: String, required: true },
      },
    ],
    education: [
      {
        school: { type: String, required: true },
        detail: { type: String, required: true },
      },
    ],
    skillGroups: [
      {
        label: { type: String, required: true },
        items: [{ type: String }],
      },
    ],
    selectedProjects: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    certifications: [{ type: String }],
    learningSources: [
      {
        name: { type: String, required: true },
        focus: { type: String, required: true },
      },
    ],
    lastUpdated: { type: String },
    sourcePdfs: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Cv || mongoose.model<ICv>('Cv', CvSchema);
