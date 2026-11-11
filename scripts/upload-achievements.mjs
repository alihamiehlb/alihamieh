import fs from 'fs';
import pkg from '@next/env';
const { loadEnvConfig } = pkg;
import mongoose from 'mongoose';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

const AchievementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String },
  description: { type: String },
  detail: { type: String },
  instagramHighlight: { type: String },
  category: { type: String },
  image: { type: String },
  source: { type: String },
  sourceUrl: { type: String },
}, { timestamps: true });

const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);

async function run() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const data = JSON.parse(fs.readFileSync('./content/achievements.json', 'utf8'));
  const achievements = Array.isArray(data) ? data : data.achievements;
  
  await Achievement.deleteMany({});
  await Achievement.insertMany(achievements);
  
  console.log(`Uploaded ${achievements.length} achievements to MongoDB`);
  process.exit(0);
}
run().catch(console.error);
