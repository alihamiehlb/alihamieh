import { buildSiteContent } from "@/lib/merge-content";
import { readOverrides } from "@/lib/storage";

export async function getSiteContent() {
  const overrides = await readOverrides();
  return buildSiteContent(overrides);
}
