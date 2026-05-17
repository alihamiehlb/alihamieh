import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/get-site-content";
import { readOverrides, storageHint, writeOverrides } from "@/lib/storage";
import type { AdminContentPayload } from "@/lib/types/site";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getSiteContent();
  const overrides = await readOverrides();

  return NextResponse.json({
    content: {
      achievements: content.achievements,
      deployed: content.deployed,
      projects: content.projects,
      profile: content.profile,
      cv: {
        skills: content.cv.skills,
        summary: content.cv.summary,
      },
    },
    hasOverrides: Boolean(overrides),
    storageHint: storageHint(),
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
    const result = await writeOverrides({
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
  } catch (e) {
    const message = e instanceof Error ? e.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
