/**
 * Seed MongoDB with existing content data
 * Run: node scripts/seed-mongodb.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', 'content');

async function main() {
  console.log('Seeding MongoDB with existing content...');

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    console.error('Please set it in your .env file');
    process.exit(1);
  }

  // Dynamic import of mongoose
  const mongoose = (await import('mongoose')).default;

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Read existing content files
  const cvData = JSON.parse(fs.readFileSync(path.join(contentDir, 'cv.json'), 'utf8'));
  const profileData = JSON.parse(fs.readFileSync(path.join(contentDir, 'profile.json'), 'utf8'));
  const projectsData = JSON.parse(fs.readFileSync(path.join(contentDir, 'projects.json'), 'utf8'));
  const achievementsData = JSON.parse(fs.readFileSync(path.join(contentDir, 'achievements.json'), 'utf8'));
  const deployedData = JSON.parse(fs.readFileSync(path.join(contentDir, 'deployed.json'), 'utf8'));

  // Import models
  const Cv = (await import('../src/lib/models/Cv.ts')).default;
  const Profile = (await import('../src/lib/models/Profile.ts')).default;
  const Project = (await import('../src/lib/models/Project.ts')).default;
  const Achievement = (await import('../src/lib/models/Achievement.ts')).default;
  const Deployed = (await import('../src/lib/models/Deployed.ts')).default;

  // Clear existing data
  console.log('Clearing existing data...');
  await Cv.deleteMany({});
  await Profile.deleteMany({});
  await Project.deleteMany({});
  await Achievement.deleteMany({});
  await Deployed.deleteMany({});

  // Seed CV
  console.log('Seeding CV...');
  await Cv.create({
    ...cvData,
    name: cvData.name || 'Ali Hamieh',
    title: cvData.title || '',
  });

  // Seed Profile
  console.log('Seeding Profile...');
  await Profile.create(profileData);

  // Seed Projects
  console.log('Seeding Projects...');
  await Project.insertMany(projectsData);

  // Seed Achievements
  console.log('Seeding Achievements...');
  await Achievement.insertMany(achievementsData);

  // Seed Deployed
  console.log('Seeding Deployed projects...');
  await Deployed.insertMany(deployedData);

  console.log('MongoDB seeding completed successfully!');
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error('Error seeding MongoDB:', error);
  process.exit(1);
});
