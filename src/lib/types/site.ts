export type AchievementRecord = {
  id: string;
  title: string;
  description: string;
  detail?: string;
  instagramHighlight?: string;
  category: string;
  image: string;
  source?: string;
  sourceUrl?: string;
  implementation?: string;
};

export type DeployedRecord = {
  id: string;
  name: string;
  description: string;
  homepage: string | null;
  github: string;
  language?: string | null;
  stars?: number;
  featured?: boolean;
  isFounder?: boolean;
};

export type ProjectRecord = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
  path?: string;
  images?: string[];
  content?: string;
  [key: string]: unknown;
};

export type InterviewRecord = {
  id: string;
  title: string;
  titleEn?: string;
  date: string;
  year: number;
  outlet: string;
  outletEn?: string;
  description: string;
  descriptionEn?: string;
  type: string;
  links: { label: string; url: string }[];
  image: string | null;
  featured: boolean;
};

export type ProfileRecord = {
  github: string;
  instagram: string;
  linkedin: string;
  linktree: string;
  printsLb: { name: string; url: string; tagline: string };
  title: string;
  headline: string;
  aiDiploma?: string;
  githubBio?: string;
  publicRepos?: number;
  avatarUrl?: string;
};

export type CvOverrides = {
  skills?: string[];
  summary?: string;
  experience?: Array<{ title: string; period: string; summary: string }>;
  education?: Array<{ school: string; detail: string }>;
  skillGroups?: Array<{ label: string; items: string[] }>;
  selectedProjects?: Array<{ name: string; role: string; url: string }>;
  certifications?: string[];
  achievements?: Array<{ title: string; subtitle: string; summary: string; implementation?: string }>;
  learningSources?: Array<{ name: string; focus: string }>;
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  birthDate?: string;
};

export type SiteOverrides = {
  version: number;
  updatedAt?: string;
  achievements?: AchievementRecord[];
  deployed?: DeployedRecord[];
  projects?: ProjectRecord[];
  interviews?: InterviewRecord[];
  profile?: Partial<ProfileRecord>;
  cv?: CvOverrides;
};

export type SiteContent = {
  cv: Record<string, unknown> & {
    name: string;
    title: string;
    summary: string;
    skills: string[];
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    education: { school: string }[];
  };
  projects: ProjectRecord[];
  achievements: AchievementRecord[];
  deployed: DeployedRecord[];
  interviews: InterviewRecord[];
  profile: ProfileRecord;
  instagramUrl: string;
};

export type AdminContentPayload = {
  achievements: AchievementRecord[];
  deployed: DeployedRecord[];
  projects: ProjectRecord[];
  interviews: InterviewRecord[];
  profile: ProfileRecord;
  cv: CvOverrides & { skills: string[] };
};
