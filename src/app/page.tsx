import PortfolioShell from "@/components/PortfolioShell";
import { getSiteContent } from "@/lib/get-site-content";
import type { Achievement, CvData, DeployedProject, ProfileData, Project } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const site = await getSiteContent();

  return (
    <PortfolioShell
      cv={site.cv as CvData}
      projects={site.projects as Project[]}
      achievements={site.achievements as Achievement[]}
      deployed={site.deployed as DeployedProject[]}
      profile={site.profile as ProfileData}
      instagramUrl={site.instagramUrl}
    />
  );
}
