import PortfolioShell from "@/components/PortfolioShell";
import { getSiteContent } from "@/lib/get-site-content";
import type { Achievement, CvData, DeployedProject, ProfileData, Project } from "@/lib/content";

/** Cache page at the edge; admin/blob overrides still apply per request */
export const revalidate = 120;

export default async function Home() {
  const site = await getSiteContent();

  return (
    <PortfolioShell
      cv={site.cv as CvData}
      projects={site.projects as Project[]}
      achievements={site.achievements as Achievement[]}
      deployed={site.deployed as DeployedProject[]}
      interviews={site.interviews as any[]}
      profile={site.profile as ProfileData}
      instagramUrl={site.instagramUrl}
    />
  );
}
