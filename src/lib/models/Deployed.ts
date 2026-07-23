import mongoose, { Schema, Document } from 'mongoose';

export interface IDeployed extends Document {
  id: string;
  name: string;
  description: string;
  homepage: string | null;
  github: string;
  language?: string | null;
  stars?: number;
  featured?: boolean;
  isFounder?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeployedSchema = new Schema<IDeployed>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String },
    description: { type: String },
    homepage: { type: String, default: null },
    github: { type: String },
    language: { type: String },
    stars: { type: Number },
    featured: { type: Boolean, default: false },
    isFounder: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Deployed || mongoose.model<IDeployed>('Deployed', DeployedSchema);
