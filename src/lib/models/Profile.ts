import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  github: string;
  instagram: string;
  linkedin: string;
  linktree: string;
  printsLb: {
    name: string;
    url: string;
    tagline: string;
  };
  title: string;
  headline: string;
  aiDiploma?: string;
  githubBio?: string;
  publicRepos?: number;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    github: { type: String, required: true },
    instagram: { type: String, required: true },
    linkedin: { type: String, required: true },
    linktree: { type: String, required: true },
    printsLb: {
      name: { type: String, required: true },
      url: { type: String, required: true },
      tagline: { type: String, required: true },
    },
    title: { type: String, required: true },
    headline: { type: String, required: true },
    aiDiploma: { type: String },
    githubBio: { type: String },
    publicRepos: { type: Number },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
