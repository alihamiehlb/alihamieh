import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const MONGODB_URI = "mongodb+srv://alihamiehlb_db_user:YTR6fRrENRJZk5G0@portfolio.dsi4uop.mongodb.net/?appName=portfolio";

const AchievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  detail: { type: String },
  instagramHighlight: { type: String },
  category: { type: String },
  image: { type: String },
  source: { type: String }
}, { strict: false });

const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);

async function sync() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const raw = readFileSync(resolve('content/achievements.json'), 'utf8');
  const data = JSON.parse(raw);
  const achievements = data.achievements;

  console.log(`Found ${achievements.length} achievements in local JSON`);

  // Clear existing and insert new
  await Achievement.deleteMany({});
  await Achievement.insertMany(achievements);

  console.log('Successfully synced achievements to MongoDB!');
  mongoose.disconnect();
}

sync().catch(console.error);
