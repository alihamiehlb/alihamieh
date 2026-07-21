import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  id: string;
  title: string;
  slug?: string;
  description: string;
  overview?: string;
  content?: string;
  tags: string[];
  techStack?: string[];
  languages?: { name: string; count: number }[];
  dependencies?: string[];
  highlights?: string[];
  structure?: any[];
  scripts?: string[];
  fileCount?: number;
  images?: string[];
  url?: string;
  featured?: boolean;
  path?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String },
    description: { type: String, required: true },
    overview: { type: String },
    content: { type: String },
    tags: [{ type: String }],
    techStack: [{ type: String }],
    languages: [{ name: String, count: Number }],
    dependencies: [{ type: String }],
    highlights: [{ type: String }],
    structure: { type: Schema.Types.Mixed, default: [] },
    scripts: [{ type: String }],
    fileCount: { type: Number, default: 0 },
    images: [{ type: String }],
    url: { type: String },
    featured: { type: Boolean, default: false },
    path: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
