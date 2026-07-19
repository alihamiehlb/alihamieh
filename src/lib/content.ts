import cvData from "../../content/cv.json";
import projectsData from "../../content/projects.json";
import achievementsData from "../../content/achievements.json";
import profileData from "../../content/profile.json";
import deployedData from "../../content/deployed.json";
import interviewsData from "../../content/interviews.json";
export type CvData = typeof cvData;
export type Project = (typeof projectsData.projects)[number];
export type Achievement = (typeof achievementsData.achievements)[number];
export type ProfileData = typeof profileData;
export type DeployedProject = (typeof deployedData.projects)[number];
export type Interview = (typeof interviewsData.interviews)[number];
export const cv: CvData = cvData;
export const projects: Project[] = projectsData.projects;
export const achievements: Achievement[] = achievementsData.achievements || [];
export const profile: ProfileData = profileData;
export const deployed: DeployedProject[] = deployedData.projects || [];
export const interviews: Interview[] = interviewsData.interviews || [];
export const instagramUrl =
  achievementsData.instagram || profile.instagram || "https://www.instagram.com/alihamiehlb/";

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
