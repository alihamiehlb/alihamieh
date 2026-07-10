import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  id: string;
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
  path?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    path: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
