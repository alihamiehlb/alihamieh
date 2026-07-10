import connectDB from './mongodb';
import Achievement from './models/Achievement';
import Deployed from './models/Deployed';
import Project from './models/Project';
import Profile from './models/Profile';
import Cv from './models/Cv';
import type { SiteOverrides, AdminContentPayload } from './types/site';

export async function readOverridesFromMongo(): Promise<SiteOverrides | null> {
  try {
    await connectDB();
    
    const [achievements, deployed, projects, profile, cv] = await Promise.all([
      Achievement.find({}).sort({ createdAt: -1 }),
      Deployed.find({}).sort({ createdAt: -1 }),
      Project.find({}).sort({ createdAt: -1 }),
      Profile.findOne({}),
      Cv.findOne({}),
    ]);

    return {
      version: 1,
      achievements: achievements.map(a => a.toObject()),
      deployed: deployed.map(d => d.toObject()),
      projects: projects.map(p => p.toObject()),
      profile: profile ? profile.toObject() : undefined,
      cv: cv ? { 
        skills: cv.skills, 
        summary: cv.summary,
        experience: cv.experience,
        education: cv.education,
        skillGroups: cv.skillGroups,
        selectedProjects: cv.selectedProjects,
        certifications: cv.certifications,
        learningSources: cv.learningSources,
        name: cv.name,
        title: cv.title,
        email: cv.email,
        phone: cv.phone,
        location: cv.location,
        birthDate: cv.birthDate
      } : undefined,
    };
  } catch (error) {
    console.error('Error reading from MongoDB:', error);
    return null;
  }
}

export async function writeOverridesToMongo(data: AdminContentPayload): Promise<{
  storage: 'mongo';
}> {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      Achievement.deleteMany({}),
      Deployed.deleteMany({}),
      Project.deleteMany({}),
    ]);

    // Insert new data
    await Promise.all([
      Achievement.insertMany(data.achievements),
      Deployed.insertMany(data.deployed),
      Project.insertMany(data.projects),
    ]);

    // Update or create profile
    await Profile.findOneAndUpdate({}, data.profile, { upsert: true, new: true });

    // Update or create CV
    await Cv.findOneAndUpdate(
      { name: 'Ali Hamieh' },
      { 
        $set: { 
          skills: data.cv.skills,
          summary: data.cv.summary,
          experience: data.cv.experience,
          education: data.cv.education,
          skillGroups: data.cv.skillGroups,
          selectedProjects: data.cv.selectedProjects,
          certifications: data.cv.certifications,
          learningSources: data.cv.learningSources,
          name: data.cv.name || 'Ali Hamieh',
          title: data.cv.title || 'Full-Stack Developer',
          email: data.cv.email,
          phone: data.cv.phone,
          location: data.cv.location,
          birthDate: data.cv.birthDate
        } 
      },
      { upsert: true, new: true }
    );

    return { storage: 'mongo' };
  } catch (error) {
    console.error('Error writing to MongoDB:', error);
    throw error;
  }
}

export async function uploadImageToMongo(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ url: string; storage: 'blob' | 'local' }> {
  // For now, we'll still use Vercel Blob or local storage for images
  // MongoDB is not ideal for storing large binary files
  const { uploadImage } = await import('./storage');
  return uploadImage(buffer, filename, contentType);
}

export function mongoStorageHint() {
  return "Content is saved to MongoDB Atlas (live on your site immediately).";
}
