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
    name: { type: String },
    title: { type: String },
    birthDate: { type: String },
    tagline: { type: String },
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    documentFileName: { type: String },
    highlights: [{ type: String }],
    experience: [
      {
        title: { type: String },
        period: { type: String },
        summary: { type: String },
      },
    ],
    education: [
      {
        school: { type: String },
        detail: { type: String },
      },
    ],
    skillGroups: [
      {
        label: { type: String },
        items: [{ type: String }],
      },
    ],
    selectedProjects: [
      {
        name: { type: String },
        role: { type: String },
        url: { type: String },
      },
    ],
    certifications: [{ type: String }],
    learningSources: [
      {
        name: { type: String },
        focus: { type: String },
      },
    ],
    lastUpdated: { type: String },
    sourcePdfs: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Cv || mongoose.model<ICv>('Cv', CvSchema);
