import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const MONGODB_URI = "mongodb+srv://alihamiehlb_db_user:YTR6fRrENRJZk5G0@portfolio.dsi4uop.mongodb.net/?appName=portfolio";

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  featured: { type: Boolean, default: false },
  content: { type: String },
  images: { type: [String] },
  githubUrl: { type: String },
  liveUrl: { type: String },
  date: { type: String }
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function sync() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const raw = readFileSync(resolve('content/projects.json'), 'utf8');
  const data = JSON.parse(raw);
  const projects = data.projects;

  console.log(`Found ${projects.length} projects in local JSON`);

  // Clear existing and insert new
  await Project.deleteMany({});
  await Project.insertMany(projects);

  console.log('Successfully synced projects to MongoDB!');
  mongoose.disconnect();
}

sync().catch(console.error);
