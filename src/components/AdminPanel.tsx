"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import type {
  AchievementRecord,
  AdminContentPayload,
  DeployedRecord,
  ProfileRecord,
  ProjectRecord,
  InterviewRecord,
  CvOverrides
} from "@/lib/types/site";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const GUIDES = {
  achievements: `Add a certificate or award. Required: unique id (slug), title, short description, category, image path or URL.`,
  deployed: `Live GitHub projects. Required: id, name, description, github URL. Optional: homepage (live site), language, featured, isFounder.`,
  projects: `Portfolio showcase projects (local work). Required: id, title, description, tags (comma-separated). Optional: featured (true/false).`,
  interviews: `TV and Video interviews. Required: id, title, channel, date, description, url.`,
  profile: `Site-wide links and hero text. printsLB url should be https://printslb.com for your domain.`,
  cv: `Manage your full CV details including experience, education, skills, certifications, and more.`,
};

type Tab = "achievements" | "deployed" | "projects" | "interviews" | "profile" | "cv";

function emptyAchievement(): AchievementRecord {
  return { id: `item-${Date.now()}`, title: "", description: "", detail: "", instagramHighlight: "", category: "Academy", image: "", source: "certificate", implementation: "" };
}
function emptyDeployed(): DeployedRecord {
  return { id: `repo-${Date.now()}`, name: "my-project", description: "", homepage: "", github: "https://github.com/alihamiehlb/", language: "TypeScript", featured: true, isFounder: false };
}
function emptyProject(): ProjectRecord {
  return { id: `project-${Date.now()}`, title: "", description: "", tags: [], featured: false, images: [], content: "" };
}
function emptyInterview(): InterviewRecord {
  return { id: `interview-${Date.now()}`, title: "", outlet: "", date: "", year: new Date().getFullYear(), description: "", type: "online", links: [], image: null, featured: false };
}

function AccordionItem({ title, isOpen, onToggle, children, onMoveUp, onMoveDown, onDelete, isFirst, isLast }: any) {
  return (
    <div className="admin-card mb-4" style={{ overflow: 'hidden', transition: 'all 0.3s ease' }}>
      <div className="admin-card-header cursor-pointer select-none" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
        <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
          {onMoveUp && <button type="button" className="icon-btn" onClick={onMoveUp} disabled={isFirst}>↑</button>}
          {onMoveDown && <button type="button" className="icon-btn" onClick={onMoveDown} disabled={isLast}>↓</button>}
          {onDelete && <button type="button" className="admin-btn admin-btn--danger admin-btn--small" onClick={onDelete}>Delete</button>}
        </div>
      </div>
      {isOpen && <div className="admin-card-body grid-2">{children}</div>}
    </div>
  );
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("achievements");
  const [storageHint, setStorageHint] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [achievements, setAchievements] = useState<AchievementRecord[]>([]);
  const [deployed, setDeployed] = useState<DeployedRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  
  // CV Data
  const [skillsText, setSkillsText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [experience, setExperience] = useState<Array<{ title: string; period: string; summary: string }>>([]);
  const [education, setEducation] = useState<Array<{ school: string; detail: string }>>([]);
  const [skillGroups, setSkillGroups] = useState<Array<{ label: string; items: string[] }>>([]);
  const [selectedProjects, setSelectedProjects] = useState<Array<{ name: string; role: string; url: string }>>([]);
  const [certificationsText, setCertificationsText] = useState("");
  const [learningSources, setLearningSources] = useState<Array<{ name: string; focus: string }>>([]);

  const isInitialLoad = useRef(true);

  const loadContent = useCallback(async () => {
    const res = await fetch("/api/admin/content");
    if (res.status === 401) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    if (!res.ok) throw new Error("Failed to load");
    const data = await res.json();
    setAchievements(data.content.achievements || []);
    setDeployed((data.content.deployed || []).map((p: DeployedRecord) => ({ ...p, homepage: p.homepage || "" })));
    setProjects(data.content.projects || []);
    setInterviews(data.content.interviews || []);
    setProfile(data.content.profile || null);
    
    // CV Fields
    setSkillsText((data.content.cv?.skills || []).join("\n"));
    setSummaryText(data.content.cv?.summary || "");
    setExperience(data.content.cv?.experience || []);
    setEducation(data.content.cv?.education || []);
    setSkillGroups(data.content.cv?.skillGroups || []);
    setSelectedProjects(data.content.cv?.selectedProjects || []);
    setCertificationsText((data.content.cv?.certifications || []).join("\n"));
    setLearningSources(data.content.cv?.learningSources || []);
    
    setStorageHint(data.storageHint);
    setAuthed(true);
    setLoading(false);
    setTimeout(() => { isInitialLoad.current = false; setHasUnsaved(false); }, 100);
  }, []);

  useEffect(() => {
    loadContent().catch(() => setLoading(false));
  }, [loadContent]);

  useEffect(() => {
    if (!isInitialLoad.current) setHasUnsaved(true);
  }, [achievements, deployed, projects, interviews, profile, skillsText, summaryText, experience, education, skillGroups, selectedProjects, certificationsText, learningSources]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsaved) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsaved]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const d = await res.json();
      setLoginError(d.error || "Login failed");
      return;
    }
    setAuthed(true);
    await loadContent();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setPassword("");
  }

  async function saveAll() {
    if (!profile) return;
    setStatus("Saving…");
    setError(false);
    const payload: AdminContentPayload = {
      achievements,
      interviews,
      deployed: deployed.map((p) => ({ ...p, homepage: p.homepage || null })),
      projects: projects.map((p) => ({
        ...p,
        tags: Array.isArray(p.tags) ? p.tags : String(p.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
        images: Array.isArray(p.images) ? p.images : String(p.images || "").split(",").map((t) => t.trim()).filter(Boolean),
      })),
      profile,
      cv: {
        skills: skillsText.split("\n").map((s) => s.trim()).filter(Boolean),
        summary: summaryText.trim() || undefined,
        experience,
        education,
        skillGroups,
        selectedProjects,
        certifications: certificationsText.split("\n").map(s => s.trim()).filter(Boolean),
        learningSources
      },
    };
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Save failed");
      setError(true);
      return;
    }
    setStorageHint(data.storageHint);
    setStatus(`Saved successfully!`);
    setError(false);
    setHasUnsaved(false);
    setTimeout(() => setStatus(""), 4000);
  }

  async function uploadFile(file: File, onUrl: (url: string) => void) {
    setStatus("Uploading…");
    setError(false);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Upload failed");
      setError(true);
      return;
    }
    onUrl(data.url);
    setStatus(`Uploaded successfully!`);
    setError(false);
    setTimeout(() => setStatus(""), 4000);
  }

  const moveItem = (arr: any[], index: number, direction: 'up' | 'down', setter: (val: any[]) => void) => {
    const newArr = [...arr];
    if (direction === 'up' && index > 0) {
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      setter(newArr);
    } else if (direction === 'down' && index < newArr.length - 1) {
      [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      setter(newArr);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading Dashboard…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="admin-login-wrapper">
        <form className="admin-login" onSubmit={login}>
          <div className="admin-login-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h1>Admin Dashboard</h1>
          <p>Access the private portfolio content manager.</p>
          <div className="admin-field">
            <input type="password" placeholder="Enter admin password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {loginError && <p className="admin-status error">{loginError}</p>}
          <button type="submit" className="admin-btn admin-btn--primary admin-btn--block">Authenticate</button>
        </form>
        <a href="/" className="admin-back">← Back to Portfolio</a>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Dashboard</h2>
          <a href="/" className="admin-btn admin-btn--ghost admin-btn--small">View Site</a>
        </div>
        <nav className="admin-nav">
          <button type="button" className={`admin-nav-item${tab === "achievements" ? " active" : ""}`} onClick={() => {setTab("achievements"); setExpandedId(null)}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
            Achievements
          </button>
          <button type="button" className={`admin-nav-item${tab === "deployed" ? " active" : ""}`} onClick={() => {setTab("deployed"); setExpandedId(null)}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            Live Projects
          </button>
          <button type="button" className={`admin-nav-item${tab === "projects" ? " active" : ""}`} onClick={() => {setTab("projects"); setExpandedId(null)}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            Showcase
          </button>
          <button type="button" className={`admin-nav-item${tab === "interviews" ? " active" : ""}`} onClick={() => {setTab("interviews"); setExpandedId(null)}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
            Interviews
          </button>
          <button type="button" className={`admin-nav-item${tab === "profile" ? " active" : ""}`} onClick={() => {setTab("profile"); setExpandedId(null)}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Profile & Links
          </button>
          <button type="button" className={`admin-nav-item${tab === "cv" ? " active" : ""}`} onClick={() => {setTab("cv"); setExpandedId(null)}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            CV Editor
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <p className="admin-storage-hint">{storageHint}</p>
          <button type="button" className="admin-btn admin-btn--danger admin-btn--block" onClick={logout}>Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>{tab.charAt(0).toUpperCase() + tab.slice(1)} Management</h1>
            <p className="admin-guide">{GUIDES[tab]}</p>
          </div>
          <div className="admin-topbar-actions">
            {status && <span className={`admin-status-badge ${error ? 'error' : 'success'}`}>{status}</span>}
            <button
              type="button"
              className={`admin-btn admin-btn--primary ${hasUnsaved ? 'pulse-glow' : ''}`}
              onClick={saveAll}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px'}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Save All Changes
            </button>
          </div>
        </header>

        <div className="admin-content-area">
          {tab === "achievements" && (
            <section className="admin-section">
              <div className="admin-section-header mb-6">
                <button type="button" className="admin-btn admin-btn--primary" onClick={() => {
                  const newAch = emptyAchievement();
                  setAchievements([newAch, ...achievements]);
                  setExpandedId(newAch.id);
                }}>+ Create New Achievement</button>
              </div>
              <div className="admin-list">
                {achievements.map((a, i) => (
                  <AccordionItem
                    key={a.id}
                    title={a.title || 'Untitled Achievement'}
                    isOpen={expandedId === a.id}
                    onToggle={() => setExpandedId(expandedId === a.id ? null : a.id)}
                    onMoveUp={() => moveItem(achievements, i, 'up', setAchievements)}
                    onMoveDown={() => moveItem(achievements, i, 'down', setAchievements)}
                    onDelete={() => setAchievements(achievements.filter((_, j) => j !== i))}
                    isFirst={i === 0}
                    isLast={i === achievements.length - 1}
                  >
                    <div className="admin-field">
                      <label>Unique ID (Slug)</label>
                      <input value={a.id} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, id: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>Title</label>
                      <input value={a.title} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, title: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>Category</label>
                      <input value={a.category} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, category: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>Image Upload</label>
                      <div className="image-input-group">
                        <input value={a.image} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, image: e.target.value } : item))} placeholder="Upload or paste Base64/URL" />
                        <label className="admin-btn admin-btn--ghost upload-btn">
                          Upload
                          <input type="file" accept="image/*" hidden onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadFile(f, (url) => setAchievements(achievements.map((item, j) => j === i ? { ...item, image: url } : item)));
                          }} />
                        </label>
                      </div>
                      {a.image && <img src={a.image} alt="Preview" className="admin-image-preview mt-2" />}
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Short Description (Card)</label>
                      <textarea rows={2} value={a.description} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, description: e.target.value } : item))} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Detailed Description (Modal)</label>
                      <textarea rows={4} value={a.detail || ""} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, detail: e.target.value } : item))} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Implementation Details (CV)</label>
                      <textarea rows={4} value={a.implementation || ""} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, implementation: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>Instagram Highlight URL</label>
                      <input value={a.instagramHighlight || ""} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, instagramHighlight: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>Source URL</label>
                      <input value={a.sourceUrl || ""} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, sourceUrl: e.target.value } : item))} />
                    </div>
                  </AccordionItem>
                ))}
              </div>
            </section>
          )}

          {tab === "deployed" && (
            <section className="admin-section">
               <div className="admin-section-header mb-6">
                <button type="button" className="admin-btn admin-btn--primary" onClick={() => {
                  const newDep = emptyDeployed();
                  setDeployed([newDep, ...deployed]);
                  setExpandedId(newDep.id);
                }}>+ Add Live Project</button>
              </div>
              <div className="admin-list">
                {deployed.map((p, i) => (
                  <AccordionItem
                    key={p.id}
                    title={p.name || 'Untitled Project'}
                    isOpen={expandedId === p.id}
                    onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
                    onMoveUp={() => moveItem(deployed, i, 'up', setDeployed)}
                    onMoveDown={() => moveItem(deployed, i, 'down', setDeployed)}
                    onDelete={() => setDeployed(deployed.filter((_, j) => j !== i))}
                    isFirst={i === 0}
                    isLast={i === deployed.length - 1}
                  >
                    <div className="admin-field">
                      <label>Unique ID</label>
                      <input value={p.id} onChange={(e) => setDeployed(deployed.map((item, j) => j === i ? { ...item, id: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>Name</label>
                      <input value={p.name} onChange={(e) => setDeployed(deployed.map((item, j) => j === i ? { ...item, name: e.target.value } : item))} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Description</label>
                      <textarea rows={2} value={p.description} onChange={(e) => setDeployed(deployed.map((item, j) => j === i ? { ...item, description: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>Live URL (Homepage)</label>
                      <input value={p.homepage || ""} onChange={(e) => setDeployed(deployed.map((item, j) => j === i ? { ...item, homepage: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>GitHub URL</label>
                      <input value={p.github} onChange={(e) => setDeployed(deployed.map((item, j) => j === i ? { ...item, github: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>Language</label>
                      <input value={p.language || ""} onChange={(e) => setDeployed(deployed.map((item, j) => j === i ? { ...item, language: e.target.value } : item))} />
                    </div>
                    <div className="admin-field switch-group">
                       <label className="toggle-switch">
                          <input type="checkbox" checked={p.featured} onChange={(e) => setDeployed(deployed.map((item, j) => j === i ? { ...item, featured: e.target.checked } : item))} />
                          <span className="slider"></span> Featured on Homepage
                       </label>
                       <label className="toggle-switch">
                          <input type="checkbox" checked={p.isFounder || false} onChange={(e) => setDeployed(deployed.map((item, j) => j === i ? { ...item, isFounder: e.target.checked } : item))} />
                          <span className="slider"></span> Is Founder (printsLB)
                       </label>
                    </div>
                  </AccordionItem>
                ))}
              </div>
            </section>
          )}

          {tab === "projects" && (
            <section className="admin-section">
               <div className="admin-section-header mb-6">
                <button type="button" className="admin-btn admin-btn--primary" onClick={() => {
                  const newProj = emptyProject();
                  setProjects([newProj, ...projects]);
                  setExpandedId(newProj.id);
                }}>+ Add Showcase Project</button>
              </div>
              <div className="admin-list">
                {projects.map((p, i) => (
                  <AccordionItem
                    key={p.id}
                    title={p.title || 'Untitled Project'}
                    isOpen={expandedId === p.id}
                    onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
                    onMoveUp={() => moveItem(projects, i, 'up', setProjects)}
                    onMoveDown={() => moveItem(projects, i, 'down', setProjects)}
                    onDelete={() => setProjects(projects.filter((_, j) => j !== i))}
                    isFirst={i === 0}
                    isLast={i === projects.length - 1}
                  >
                    <div className="admin-field">
                      <label>Unique ID</label>
                      <input value={p.id} onChange={(e) => setProjects(projects.map((item, j) => j === i ? { ...item, id: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>Title</label>
                      <input value={p.title} onChange={(e) => setProjects(projects.map((item, j) => j === i ? { ...item, title: e.target.value } : item))} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Description</label>
                      <textarea rows={3} value={p.description} onChange={(e) => setProjects(projects.map((item, j) => j === i ? { ...item, description: e.target.value } : item))} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Tags (Comma Separated)</label>
                      <input value={Array.isArray(p.tags) ? p.tags.join(", ") : p.tags} onChange={(e) => setProjects(projects.map((item, j) => j === i ? { ...item, tags: e.target.value.split(",").map(t => t.trim()) } : item))} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Images (Comma Separated URLs)</label>
                      <div className="image-input-group" style={{ alignItems: "flex-start" }}>
                        <textarea rows={2} value={Array.isArray(p.images) ? p.images.join(", ") : p.images} onChange={(e) => setProjects(projects.map((item, j) => j === i ? { ...item, images: e.target.value.split(",").map(t => t.trim()).filter(Boolean) } : item))} placeholder="Upload or paste URLs..." style={{ flex: 1 }} />
                        <label className="admin-btn admin-btn--ghost upload-btn" style={{ whiteSpace: "nowrap" }}>
                          Upload Image
                          <input type="file" accept="image/*" hidden onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadFile(f, (url) => {
                                const currentImages = Array.isArray(p.images) ? [...p.images] : [];
                                currentImages.push(url);
                                setProjects(projects.map((item, j) => j === i ? { ...item, images: currentImages } : item));
                            });
                          }} />
                        </label>
                      </div>
                      <div className="mt-2 flex gap-2 overflow-x-auto">
                        {(p.images || []).map((imgUrl, imgIdx) => (
                          <img key={imgIdx} src={imgUrl} alt={`Preview ${imgIdx}`} className="admin-image-preview" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                        ))}
                      </div>
                    </div>
                    <div className="admin-field col-span-2" data-color-mode="dark">
                      <label>Project Content (Markdown)</label>
                      <MDEditor value={(p.content as string) || ""} onChange={(val) => setProjects(projects.map((item, j) => j === i ? { ...item, content: val || "" } : item))} />
                    </div>
                    <div className="admin-field col-span-2">
                       <label className="toggle-switch">
                          <input type="checkbox" checked={p.featured} onChange={(e) => setProjects(projects.map((item, j) => j === i ? { ...item, featured: e.target.checked } : item))} />
                          <span className="slider"></span> Featured Showcase
                       </label>
                    </div>
                  </AccordionItem>
                ))}
              </div>
            </section>
          )}

          {tab === "interviews" && (
            <section className="admin-section">
               <div className="admin-section-header mb-6">
                <button type="button" className="admin-btn admin-btn--primary" onClick={() => {
                  const newInt = emptyInterview();
                  setInterviews([newInt, ...interviews]);
                  setExpandedId(newInt.id);
                }}>+ Add Interview</button>
              </div>
              <div className="admin-list">
                {interviews.map((int, i) => (
                  <AccordionItem
                    key={int.id}
                    title={int.title || 'Untitled Interview'}
                    isOpen={expandedId === int.id}
                    onToggle={() => setExpandedId(expandedId === int.id ? null : int.id)}
                    onMoveUp={() => moveItem(interviews, i, 'up', setInterviews)}
                    onMoveDown={() => moveItem(interviews, i, 'down', setInterviews)}
                    onDelete={() => setInterviews(interviews.filter((_, j) => j !== i))}
                    isFirst={i === 0}
                    isLast={i === interviews.length - 1}
                  >
                    <div className="admin-field">
                      <label>Title</label>
                      <input value={int.title} onChange={(e) => setInterviews(interviews.map((item, j) => j === i ? { ...item, title: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>Outlet</label>
                      <input value={int.outlet} onChange={(e) => setInterviews(interviews.map((item, j) => j === i ? { ...item, outlet: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>Date (e.g. Oct 2024)</label>
                      <input value={int.date} onChange={(e) => setInterviews(interviews.map((item, j) => j === i ? { ...item, date: e.target.value } : item))} />
                    </div>
                    <div className="admin-field">
                      <label>First Link URL</label>
                      <input value={int.links?.[0]?.url || ""} onChange={(e) => setInterviews(interviews.map((item, j) => j === i ? { ...item, links: [{ label: "Link", url: e.target.value }] } : item))} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Description</label>
                      <textarea rows={2} value={int.description} onChange={(e) => setInterviews(interviews.map((item, j) => j === i ? { ...item, description: e.target.value } : item))} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Image URL</label>
                      <div className="image-input-group">
                        <input value={int.image || ""} onChange={(e) => setInterviews(interviews.map((item, j) => j === i ? { ...item, image: e.target.value } : item))} placeholder="Upload or paste URL" />
                        <label className="admin-btn admin-btn--ghost upload-btn">
                          Upload
                          <input type="file" accept="image/*" hidden onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadFile(f, (url) => setInterviews(interviews.map((item, j) => j === i ? { ...item, image: url } : item)));
                          }} />
                        </label>
                      </div>
                      {int.image && <img src={int.image} alt="Preview" className="admin-image-preview mt-2" />}
                    </div>
                  </AccordionItem>
                ))}
              </div>
            </section>
          )}

          {tab === "cv" && (
            <section className="admin-section">
               {/* Summary & Skills Textareas */}
               <AccordionItem title="Overview & Text Skills" isOpen={expandedId === 'cv-overview'} onToggle={() => setExpandedId(expandedId === 'cv-overview' ? null : 'cv-overview')}>
                  <div className="admin-field col-span-2">
                    <label>About Summary</label>
                    <textarea value={summaryText} onChange={(e) => setSummaryText(e.target.value)} rows={5} />
                  </div>
                  <div className="admin-field col-span-2 mt-4">
                    <label>Skills List (One per line)</label>
                    <textarea value={skillsText} onChange={(e) => setSkillsText(e.target.value)} rows={8} className="font-mono" />
                  </div>
               </AccordionItem>

               {/* Experience */}
               <div className="admin-section-header mt-8 mb-4">
                  <h2 style={{color: '#fff', fontSize: '1.25rem', margin: 0}}>Work Experience</h2>
                  <button type="button" className="admin-btn admin-btn--primary admin-btn--small" onClick={() => {
                    setExperience([{ title: "", period: "", summary: "" }, ...experience]);
                    setExpandedId('exp-0');
                  }}>+ Add</button>
               </div>
               {experience.map((exp, i) => (
                  <AccordionItem key={i} title={exp.title || 'New Experience'} isOpen={expandedId === `exp-${i}`} onToggle={() => setExpandedId(expandedId === `exp-${i}` ? null : `exp-${i}`)} onMoveUp={() => moveItem(experience, i, 'up', setExperience)} onMoveDown={() => moveItem(experience, i, 'down', setExperience)} onDelete={() => setExperience(experience.filter((_, j) => j !== i))} isFirst={i === 0} isLast={i === experience.length - 1}>
                    <div className="admin-field"><label>Title</label><input value={exp.title} onChange={(e) => setExperience(experience.map((item, j) => j === i ? { ...item, title: e.target.value } : item))} /></div>
                    <div className="admin-field"><label>Period</label><input value={exp.period} onChange={(e) => setExperience(experience.map((item, j) => j === i ? { ...item, period: e.target.value } : item))} /></div>
                    <div className="admin-field col-span-2"><label>Summary</label><textarea rows={3} value={exp.summary} onChange={(e) => setExperience(experience.map((item, j) => j === i ? { ...item, summary: e.target.value } : item))} /></div>
                  </AccordionItem>
               ))}

               {/* Education */}
               <div className="admin-section-header mt-8 mb-4">
                  <h2 style={{color: '#fff', fontSize: '1.25rem', margin: 0}}>Education</h2>
                  <button type="button" className="admin-btn admin-btn--primary admin-btn--small" onClick={() => {
                    setEducation([{ school: "", detail: "" }, ...education]);
                    setExpandedId('edu-0');
                  }}>+ Add</button>
               </div>
               {education.map((edu, i) => (
                  <AccordionItem key={i} title={edu.school || 'New Education'} isOpen={expandedId === `edu-${i}`} onToggle={() => setExpandedId(expandedId === `edu-${i}` ? null : `edu-${i}`)} onMoveUp={() => moveItem(education, i, 'up', setEducation)} onMoveDown={() => moveItem(education, i, 'down', setEducation)} onDelete={() => setEducation(education.filter((_, j) => j !== i))} isFirst={i === 0} isLast={i === education.length - 1}>
                    <div className="admin-field col-span-2"><label>School</label><input value={edu.school} onChange={(e) => setEducation(education.map((item, j) => j === i ? { ...item, school: e.target.value } : item))} /></div>
                    <div className="admin-field col-span-2"><label>Detail</label><textarea rows={2} value={edu.detail} onChange={(e) => setEducation(education.map((item, j) => j === i ? { ...item, detail: e.target.value } : item))} /></div>
                  </AccordionItem>
               ))}

               {/* Skill Groups */}
               <div className="admin-section-header mt-8 mb-4">
                  <h2 style={{color: '#fff', fontSize: '1.25rem', margin: 0}}>Skill Groups</h2>
                  <button type="button" className="admin-btn admin-btn--primary admin-btn--small" onClick={() => {
                    setSkillGroups([{ label: "", items: [] }, ...skillGroups]);
                    setExpandedId('sg-0');
                  }}>+ Add</button>
               </div>
               {skillGroups.map((sg, i) => (
                  <AccordionItem key={i} title={sg.label || 'New Group'} isOpen={expandedId === `sg-${i}`} onToggle={() => setExpandedId(expandedId === `sg-${i}` ? null : `sg-${i}`)} onMoveUp={() => moveItem(skillGroups, i, 'up', setSkillGroups)} onMoveDown={() => moveItem(skillGroups, i, 'down', setSkillGroups)} onDelete={() => setSkillGroups(skillGroups.filter((_, j) => j !== i))} isFirst={i === 0} isLast={i === skillGroups.length - 1}>
                    <div className="admin-field col-span-2"><label>Group Label</label><input value={sg.label} onChange={(e) => setSkillGroups(skillGroups.map((item, j) => j === i ? { ...item, label: e.target.value } : item))} /></div>
                    <div className="admin-field col-span-2"><label>Items (Comma Separated)</label><textarea rows={2} value={sg.items.join(', ')} onChange={(e) => setSkillGroups(skillGroups.map((item, j) => j === i ? { ...item, items: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) } : item))} /></div>
                  </AccordionItem>
               ))}

               {/* Selected Projects */}
               <div className="admin-section-header mt-8 mb-4">
                  <h2 style={{color: '#fff', fontSize: '1.25rem', margin: 0}}>CV Selected Projects</h2>
                  <button type="button" className="admin-btn admin-btn--primary admin-btn--small" onClick={() => {
                    setSelectedProjects([{ name: "", role: "", url: "" }, ...selectedProjects]);
                    setExpandedId('sp-0');
                  }}>+ Add</button>
               </div>
               {selectedProjects.map((sp, i) => (
                  <AccordionItem key={i} title={sp.name || 'New Project'} isOpen={expandedId === `sp-${i}`} onToggle={() => setExpandedId(expandedId === `sp-${i}` ? null : `sp-${i}`)} onMoveUp={() => moveItem(selectedProjects, i, 'up', setSelectedProjects)} onMoveDown={() => moveItem(selectedProjects, i, 'down', setSelectedProjects)} onDelete={() => setSelectedProjects(selectedProjects.filter((_, j) => j !== i))} isFirst={i === 0} isLast={i === selectedProjects.length - 1}>
                    <div className="admin-field"><label>Name</label><input value={sp.name} onChange={(e) => setSelectedProjects(selectedProjects.map((item, j) => j === i ? { ...item, name: e.target.value } : item))} /></div>
                    <div className="admin-field"><label>Role</label><input value={sp.role} onChange={(e) => setSelectedProjects(selectedProjects.map((item, j) => j === i ? { ...item, role: e.target.value } : item))} /></div>
                    <div className="admin-field col-span-2"><label>URL</label><input value={sp.url} onChange={(e) => setSelectedProjects(selectedProjects.map((item, j) => j === i ? { ...item, url: e.target.value } : item))} /></div>
                  </AccordionItem>
               ))}

               {/* Learning Sources */}
               <div className="admin-section-header mt-8 mb-4">
                  <h2 style={{color: '#fff', fontSize: '1.25rem', margin: 0}}>Learning Sources</h2>
                  <button type="button" className="admin-btn admin-btn--primary admin-btn--small" onClick={() => {
                    setLearningSources([{ name: "", focus: "" }, ...learningSources]);
                    setExpandedId('ls-0');
                  }}>+ Add</button>
               </div>
               {learningSources.map((ls, i) => (
                  <AccordionItem key={i} title={ls.name || 'New Source'} isOpen={expandedId === `ls-${i}`} onToggle={() => setExpandedId(expandedId === `ls-${i}` ? null : `ls-${i}`)} onMoveUp={() => moveItem(learningSources, i, 'up', setLearningSources)} onMoveDown={() => moveItem(learningSources, i, 'down', setLearningSources)} onDelete={() => setLearningSources(learningSources.filter((_, j) => j !== i))} isFirst={i === 0} isLast={i === learningSources.length - 1}>
                    <div className="admin-field col-span-2"><label>Name</label><input value={ls.name} onChange={(e) => setLearningSources(learningSources.map((item, j) => j === i ? { ...item, name: e.target.value } : item))} /></div>
                    <div className="admin-field col-span-2"><label>Focus / Detail</label><input value={ls.focus} onChange={(e) => setLearningSources(learningSources.map((item, j) => j === i ? { ...item, focus: e.target.value } : item))} /></div>
                  </AccordionItem>
               ))}

               {/* Certifications (Simple Textarea) */}
               <div className="admin-section-header mt-8 mb-4">
                  <h2 style={{color: '#fff', fontSize: '1.25rem', margin: 0}}>Certifications (One per line)</h2>
               </div>
               <div className="admin-card mb-4">
                 <div className="admin-card-body">
                   <textarea rows={6} value={certificationsText} onChange={(e) => setCertificationsText(e.target.value)} className="w-full" />
                 </div>
               </div>
            </section>
          )}

          {tab === "profile" && profile && (
            <section className="admin-section">
              <div className="admin-card">
                 <div className="admin-card-body grid-2">
                    <div className="admin-field col-span-2"><label>Hero Title</label><input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} /></div>
                    <div className="admin-field col-span-2"><label>Hero Subtitle (Headline)</label><input value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} /></div>
                    <div className="admin-field col-span-2"><label>AI Diploma Line</label><input value={profile.aiDiploma} onChange={(e) => setProfile({ ...profile, aiDiploma: e.target.value })} /></div>
                    <h3 className="col-span-2 mt-4 form-section-title">Social Links</h3>
                    <div className="admin-field"><label>GitHub URL</label><input value={profile.github} onChange={(e) => setProfile({ ...profile, github: e.target.value })} /></div>
                    <div className="admin-field"><label>LinkedIn URL</label><input value={profile.linkedin} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} /></div>
                    <div className="admin-field"><label>Instagram URL</label><input value={profile.instagram} onChange={(e) => setProfile({ ...profile, instagram: e.target.value })} /></div>
                    <div className="admin-field"><label>Linktree URL</label><input value={profile.linktree} onChange={(e) => setProfile({ ...profile, linktree: e.target.value })} /></div>
                    <h3 className="col-span-2 mt-4 form-section-title">printsLB Config</h3>
                    <div className="admin-field"><label>Business Name</label><input value={profile.printsLb?.name || ''} onChange={(e) => setProfile({ ...profile, printsLb: { ...profile.printsLb, name: e.target.value } })} /></div>
                    <div className="admin-field"><label>Website URL</label><input value={profile.printsLb?.url || ''} onChange={(e) => setProfile({ ...profile, printsLb: { ...profile.printsLb, url: e.target.value } })} /></div>
                    <div className="admin-field col-span-2"><label>Tagline</label><input value={profile.printsLb?.tagline || ''} onChange={(e) => setProfile({ ...profile, printsLb: { ...profile.printsLb, tagline: e.target.value } })} /></div>
                 </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
