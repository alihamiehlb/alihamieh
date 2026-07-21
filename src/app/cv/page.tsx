import type { Metadata } from "next";
import CvDocument, { type CvDocumentData } from "@/components/CvDocument";
import { getSiteContent } from "@/lib/get-site-content";
import profileData from "../../../content/profile.json";
import "./cv-document.css";

export const metadata: Metadata = {
  title: "CV — Ali Hamieh",
  description: "Professional CV / resume for Ali Hamieh — developer, founder of printsLB.",
};

export const dynamic = "force-dynamic";

export default async function CvPage() {
  const site = await getSiteContent();
  const base = site.cv as Record<string, unknown>;
  const profile = site.profile;

  const cv: CvDocumentData = {
    name: String(base.name || "Ali Hamieh"),
    title: String(profile.title || base.title || ""),
    tagline: String(profile.headline || base.tagline || ""),
    email: String(base.email || ""),
    phone: String(base.phone || ""),
    linkedin: String(profile.linkedin || base.linkedin || ""),
    github: String(profile.github || base.github || ""),
    linktree: profile.linktree,
    location: String(base.location || "Lebanon"),
    summary: String(base.summary || ""),
    highlights: (base.highlights as string[]) || [],
    experience: (base.experience as CvDocumentData["experience"]) || [],
    education: (base.education as CvDocumentData["education"]) || [],
    skillGroups: (base.skillGroups as CvDocumentData["skillGroups"]) || [],
    selectedProjects: (base.selectedProjects as CvDocumentData["selectedProjects"]) || [],
    certifications: (base.certifications as string[]) || [],
    achievements: (base.achievements as CvDocumentData["achievements"]) || [],
    interviews: (site.interviews || []).map((i) => ({ title: i.titleEn || i.title, url: i.links?.[0]?.url || "#" })),
    lastUpdated: String(base.lastUpdated || ""),
    documentFileName: String(base.documentFileName || "Ali_Hamieh_CV_2026.html"),
  };

  return <CvDocument cv={cv} />;
}
