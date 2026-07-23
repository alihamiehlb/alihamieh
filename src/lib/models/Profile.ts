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
    github: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    linktree: { type: String },
    printsLb: {
      name: { type: String },
      url: { type: String },
      tagline: { type: String },
    },
    title: { type: String },
    headline: { type: String },
    aiDiploma: { type: String },
    githubBio: { type: String },
    publicRepos: { type: Number },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
