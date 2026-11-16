import { cache } from "react";
import { buildSiteContent } from "@/lib/merge-content";
import { readOverrides } from "@/lib/storage";

export const getSiteContent = cache(async function getSiteContent() {
  let overrides = null;
  if (process.env.MONGODB_URI) {
    try {
      const { readOverridesFromMongo } = await import("@/lib/mongodb-storage");
      let timeout: ReturnType<typeof setTimeout> | undefined;
      try {
        overrides = await Promise.race([
          readOverridesFromMongo(),
          new Promise<null>((_, reject) => {
            timeout = setTimeout(
              () => reject(new Error("readOverridesFromMongo timeout after 1.5s")),
              1500
            );
          }),
        ]);
      } finally {
        if (timeout) clearTimeout(timeout);
      }
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
});
