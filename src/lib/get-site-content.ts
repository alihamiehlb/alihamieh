import { buildSiteContent } from "@/lib/merge-content";
import { readOverrides } from "@/lib/storage";
import { readOverridesFromMongo } from "@/lib/mongodb-storage";

export async function getSiteContent() {
  let overrides = null;
  if (process.env.MONGODB_URI) {
    overrides = await readOverridesFromMongo();
  }
  
  if (!overrides) {
    overrides = await readOverrides();
  }

  return buildSiteContent(overrides);
}
