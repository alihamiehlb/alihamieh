import { buildSiteContent } from "@/lib/merge-content";
import { readOverrides } from "@/lib/storage";
import { readOverridesFromMongo } from "@/lib/mongodb-storage";

export async function getSiteContent() {
  console.log("[getSiteContent] start");
  let overrides = null;
  if (process.env.MONGODB_URI) {
    try {
      console.log("[getSiteContent] calling readOverridesFromMongo...");
      overrides = await Promise.race([
        readOverridesFromMongo(),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("readOverridesFromMongo timeout after 3s")), 3000)
        ),
      ]);
      console.log("[getSiteContent] readOverridesFromMongo succeeded");
    } catch (err: any) {
      console.warn("[getSiteContent] readOverridesFromMongo error/timeout:", err?.message);
      overrides = null;
    }
  }
  
  if (!overrides) {
    try {
      console.log("[getSiteContent] calling readOverrides...");
      overrides = await Promise.race([
        readOverrides(),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("readOverrides timeout after 3s")), 3000)
        ),
      ]);
      console.log("[getSiteContent] readOverrides succeeded");
    } catch (err: any) {
      console.warn("[getSiteContent] readOverrides error/timeout:", err?.message);
      overrides = null;
    }
  }

  console.log("[getSiteContent] calling buildSiteContent...");
  const result = buildSiteContent(overrides);
  console.log("[getSiteContent] buildSiteContent done");
  return result;
}
