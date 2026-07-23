import cvData from "../../content/cv.json";
import projectsData from "../../content/projects.json";
import achievementsData from "../../content/achievements.json";
import profileData from "../../content/profile.json";
import deployedData from "../../content/deployed.json";
import interviewsData from "../../content/interviews.json";
export type CvData = typeof cvData;
export type Project = typeof projectsData[number];
export type Achievement = typeof achievementsData[number];
export type ProfileData = typeof profileData;
export type DeployedProject = typeof deployedData[number];
export type Interview = typeof interviewsData[number];
export const cv: CvData = cvData;
export const projects: Project[] = projectsData;
export const achievements: Achievement[] = achievementsData || [];
export const profile: ProfileData = profileData;
export const deployed: DeployedProject[] = deployedData || [];
export const interviews: Interview[] = interviewsData || [];
export const instagramUrl =
  (achievementsData as any).instagram || profile.instagram || "https://www.instagram.com/alihamiehlb/";

export const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "achievements", label: "Achievements" },
  { id: "skills", label: "Skills" },
  { id: "interviews", label: "Interviews" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
