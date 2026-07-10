import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/get-site-content";
import { readOverrides, storageHint, writeOverrides } from "@/lib/storage";
import { readOverridesFromMongo, writeOverridesToMongo, mongoStorageHint } from "@/lib/mongodb-storage";
import type { AdminContentPayload } from "@/lib/types/site";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getSiteContent();
  
  // Try MongoDB first, fall back to local/blob storage
  let overrides = null;
  let storageHintText = storageHint();
  
  if (process.env.MONGODB_URI) {
    try {
      console.log('Attempting to read from MongoDB...');
      overrides = await readOverridesFromMongo();
      console.log('MongoDB read result:', overrides ? 'Success' : 'No data');
      if (overrides) {
        storageHintText = mongoStorageHint();
        console.log('Using MongoDB storage');
      } else {
        console.log('MongoDB returned null, falling back to local storage');
      }
    } catch (e) {
      console.error('MongoDB read error, falling back to local storage:', e);
    }
  } else {
    console.log('MONGODB_URI not set, using local storage');
  }
  
  if (!overrides) {
    overrides = await readOverrides();
    console.log('Using local storage overrides');
  }

  return NextResponse.json({
    content: {
      achievements: overrides?.achievements || content.achievements,
      deployed: overrides?.deployed || content.deployed,
      projects: overrides?.projects || content.projects,
      profile: overrides?.profile || content.profile,
      cv: {
        skills: overrides?.cv?.skills || content.cv.skills,
        summary: overrides?.cv?.summary || content.cv.summary,
      },
    },
    hasOverrides: Boolean(overrides),
    storageHint: storageHintText,
  });
}

export async function PUT(req: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as AdminContentPayload;
  if (
    !body?.achievements ||
    !body?.deployed ||
    !body?.projects ||
    !body?.profile ||
    !body?.cv?.skills
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    let result;
    
    // Use MongoDB if configured, otherwise fall back to local/blob storage
    if (process.env.MONGODB_URI) {
      result = await writeOverridesToMongo(body);
      return NextResponse.json({
        ok: true,
        storage: result.storage,
        storageHint: mongoStorageHint(),
      });
    } else {
      result = await writeOverrides({
        version: 1,
        achievements: body.achievements,
        deployed: body.deployed,
        projects: body.projects,
        profile: body.profile,
        cv: {
          skills: body.cv.skills,
          summary: body.cv.summary,
        },
      });
      return NextResponse.json({
        ok: true,
        storage: result.storage,
        blobUrl: result.blobUrl,
        storageHint: storageHint(),
      });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
