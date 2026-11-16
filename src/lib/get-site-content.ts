import { buildSiteContent } from "@/lib/merge-content";
import { readOverrides } from "@/lib/storage";

export async function getSiteContent() {
  let overrides = null;
  if (process.env.MONGODB_URI) {
    try {
      const { readOverridesFromMongo } = await import("@/lib/mongodb-storage");
      overrides = await Promise.race([
        readOverridesFromMongo(),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("readOverridesFromMongo timeout after 3s")), 3000)
        ),
      ]);
    } catch (err: any) {
      console.warn("[getSiteContent] readOverridesFromMongo error/timeout:", err?.message);
      overrides = null;
    }
  }
  
  if (!overrides) {
    try {
      overrides = await readOverrides();
    } catch {
      overrides = null;
    }
  }

  return buildSiteContent(overrides);
}
