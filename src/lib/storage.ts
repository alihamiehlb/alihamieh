import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { SiteOverrides } from "@/lib/types/site";

const LOCAL_FILE = path.join(process.cwd(), "content", "site-overrides.json");
const BLOB_PATHNAME = "portfolio/site-overrides.json";

const EMPTY: SiteOverrides = { version: 1 };

export async function readOverrides(): Promise<SiteOverrides | null> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "portfolio/", limit: 20 });
      const hit = blobs.find((b) => b.pathname === BLOB_PATHNAME);
      if (hit?.url) {
        const res = await fetch(hit.url, { cache: "no-store" });
        if (res.ok) return (await res.json()) as SiteOverrides;
      }
    } catch {
      /* fall through to local */
    }
  }

  try {
    const raw = await readFile(LOCAL_FILE, "utf8");
    return JSON.parse(raw) as SiteOverrides;
  } catch {
    return null;
  }
}

export async function writeOverrides(data: SiteOverrides): Promise<{
  storage: "blob" | "local";
  blobUrl?: string;
}> {
  const payload: SiteOverrides = {
    ...data,
    version: 1,
    updatedAt: new Date().toISOString(),
  };

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(BLOB_PATHNAME, JSON.stringify(payload, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    return { storage: "blob", blobUrl: blob.url };
  }

  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, JSON.stringify(payload, null, 2), "utf8");
  return { storage: "local" };
}

export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ url: string; storage: "blob" | "local" }> {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
  const name = `${Date.now()}-${safe}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`portfolio/uploads/${name}`, buffer, {
      access: "public",
      contentType,
    });
    return { url: blob.url, storage: "blob" };
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, name);
  await writeFile(filePath, buffer);
  return { url: `/uploads/${name}`, storage: "local" };
}

export function storageHint() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return "Content is saved to Vercel Blob (live on your site immediately).";
  }
  if (process.env.VERCEL) {
    return "Set BLOB_READ_WRITE_TOKEN in Vercel env to save edits in production.";
  }
  return "Content is saved to content/site-overrides.json on this machine.";
}

export { EMPTY };
