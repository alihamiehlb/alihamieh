import cvData from "../../content/cv.json";
import projectsData from "../../content/projects.json";
import achievementsData from "../../content/achievements.json";
import profileData from "../../content/profile.json";
import deployedData from "../../content/deployed.json";
import type { SiteContent, SiteOverrides } from "@/lib/types/site";

function mergeProfile(
  base: typeof profileData,
  patch?: SiteOverrides["profile"]
) {
  if (!patch) return base;
  return {
    ...base,
    ...patch,
    printsLb: { ...base.printsLb, ...patch.printsLb },
  };
}

export function buildSiteContent(overrides: SiteOverrides | null): SiteContent {
  const profile = mergeProfile(profileData, overrides?.profile);
  const achievements =
    overrides?.achievements !== undefined
      ? overrides.achievements
      : achievementsData.achievements || [];
  const deployed =
    overrides?.deployed !== undefined
      ? overrides.deployed
      : deployedData.projects || [];
  const rawProjects =
    overrides?.projects !== undefined
      ? overrides.projects
      : projectsData.projects;
  const projects = rawProjects.filter((p) => p.id !== "final_project");

  const interviews = overrides?.interviews !== undefined ? overrides.interviews : [];

  const cv = {
    ...cvData,
    title: profile.title || cvData.title,
    skills: overrides?.cv?.skills ?? cvData.skills,
    summary: overrides?.cv?.summary ?? cvData.summary,
    experience: overrides?.cv?.experience ?? cvData.experience,
    education: overrides?.cv?.education ?? cvData.education,
    skillGroups: overrides?.cv?.skillGroups ?? (cvData as any).skillGroups,
    selectedProjects: overrides?.cv?.selectedProjects ?? (cvData as any).selectedProjects,
    certifications: overrides?.cv?.certifications ?? (cvData as any).certifications,
    learningSources: overrides?.cv?.learningSources ?? (cvData as any).learningSources,
  };

  return {
    cv,
    projects,
    achievements,
    deployed,
    interviews,
    profile,
    instagramUrl:
      achievementsData.instagram ||
      profile.instagram ||
      "https://www.instagram.com/alihamiehlb/",
  };
}

export function getBaseContent(): SiteContent {
  return buildSiteContent(null);
}
