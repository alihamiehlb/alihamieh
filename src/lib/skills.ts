import type { CvData } from "@/lib/content";

type SkillGroup = { label: string; items: string[] };

export function getDisplaySkills(cv: CvData & { skillGroups?: SkillGroup[] }) {
  if (cv.skillGroups?.length) {
    const flat = cv.skillGroups.flatMap((g) => g.items);
    return [...new Set(flat)];
  }
  return cv.skills || [];
}
