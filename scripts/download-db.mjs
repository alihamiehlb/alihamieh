import mongoose from 'mongoose';
import { readFileSync, writeFileSync, existsSync } from 'fs';

let envStr = '';
if (existsSync('.env')) {
  envStr += readFileSync('.env', 'utf8') + '\n';
}
if (existsSync('.env.local')) {
  envStr += readFileSync('.env.local', 'utf8');
}

let MONGODB_URI = '';
for (const line of envStr.split('\n')) {
  if (line.startsWith('MONGODB_URI=')) {
    MONGODB_URI = line.split('MONGODB_URI=')[1].trim().replace(/^['"]/, '').replace(/['"]$/, '');
  }
}

if (!MONGODB_URI) {
  console.error('No MONGODB_URI found in .env');
  process.exit(1);
}

// Minimal schemas
const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', new mongoose.Schema({}, { strict: false }));
const Deployed = mongoose.models.Deployed || mongoose.model('Deployed', new mongoose.Schema({}, { strict: false }));
const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({}, { strict: false }));
const Interview = mongoose.models.Interview || mongoose.model('Interview', new mongoose.Schema({}, { strict: false }));
const Profile = mongoose.models.Profile || mongoose.model('Profile', new mongoose.Schema({}, { strict: false }));
const Cv = mongoose.models.Cv || mongoose.model('Cv', new mongoose.Schema({}, { strict: false }));

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const clean = (docs) => docs.map(d => {
    const obj = d.toObject();
    delete obj._id;
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
  });

  const achievements = clean(await Achievement.find({}).sort({ createdAt: -1 }));
  const deployed = clean(await Deployed.find({}).sort({ createdAt: -1 }));
  const projects = clean(await Project.find({}).sort({ createdAt: -1 }));
  const interviews = clean(await Interview.find({}).sort({ createdAt: -1 }));
  const profileDoc = await Profile.findOne({});
  const cvDoc = await Cv.findOne({ name: 'Ali Hamieh' });

  const profile = profileDoc ? clean([profileDoc])[0] : null;
  const cv = cvDoc ? clean([cvDoc])[0] : null;

  if (achievements.length) {
    writeFileSync('content/achievements.json', JSON.stringify(achievements, null, 2));
    console.log('Saved achievements.json');
  }
  if (deployed.length) {
    writeFileSync('content/deployed.json', JSON.stringify(deployed, null, 2));
    console.log('Saved deployed.json');
  }
  if (projects.length) {
    writeFileSync('content/projects.json', JSON.stringify(projects, null, 2));
    console.log('Saved projects.json');
  }
  if (interviews.length) {
    writeFileSync('content/interviews.json', JSON.stringify(interviews, null, 2));
    console.log('Saved interviews.json');
  }
  if (profile) {
    writeFileSync('content/profile.json', JSON.stringify(profile, null, 2));
    console.log('Saved profile.json');
  }
  if (cv) {
    writeFileSync('content/cv.json', JSON.stringify(cv, null, 2));
    console.log('Saved cv.json');
  }

  await mongoose.disconnect();
  console.log('Done!');
}

run().catch(console.error);
