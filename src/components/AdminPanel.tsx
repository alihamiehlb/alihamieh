"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AchievementRecord,
  AdminContentPayload,
  DeployedRecord,
  ProfileRecord,
  ProjectRecord,
  CvOverrides
} from "@/lib/types/site";

const GUIDES = {
  achievements: `Add a certificate or award. Required: unique id (slug), title, short description, category, image path or URL. Optional: detail (long text for modal), instagramHighlight, sourceUrl (link to IG post). Upload an image first, then paste the returned URL into image.`,
  deployed: `Live GitHub projects. Required: id, name, description, github URL. Optional: homepage (live site), language, featured, isFounder (only for printsLB).`,
  projects: `Portfolio showcase projects (local work). Required: id, title, description, tags (comma-separated). Optional: featured (true/false). Descriptions are shown on the main site cards.`,
  profile: `Site-wide links and hero text. printsLB url should be https://printslb.com for your domain.`,
  cv: `Manage your CV details including skills, summary, work experience, and education.`,
};

type Tab = "achievements" | "deployed" | "projects" | "profile" | "cv";

function emptyAchievement(): AchievementRecord {
  return {
    id: `item-${Date.now()}`,
    title: "",
    description: "",
    detail: "",
    instagramHighlight: "",
    category: "Academy",
    image: "",
    source: "certificate",
  };
}

function emptyDeployed(): DeployedRecord {
  return {
    id: `repo-${Date.now()}`,
    name: "my-project",
    description: "",
    homepage: "",
    github: "https://github.com/alihamiehlb/",
    language: "TypeScript",
    featured: true,
    isFounder: false,
  };
}

function emptyProject(): ProjectRecord {
  return {
    id: `project-${Date.now()}`,
    title: "",
    description: "",
    tags: [],
    featured: false,
  };
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

  const [achievements, setAchievements] = useState<AchievementRecord[]>([]);
  const [deployed, setDeployed] = useState<DeployedRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  
  // CV Data
  const [skillsText, setSkillsText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [experience, setExperience] = useState<Array<{ title: string; period: string; summary: string }>>([]);
  const [education, setEducation] = useState<Array<{ school: string; detail: string }>>([]);

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
    setDeployed(
      (data.content.deployed || []).map((p: DeployedRecord) => ({
        ...p,
        homepage: p.homepage || "",
      }))
    );
    setProjects(data.content.projects || []);
    setProfile(data.content.profile || null);
    
    // CV Fields
    setSkillsText((data.content.cv?.skills || []).join("\n"));
    setSummaryText(data.content.cv?.summary || "");
    setExperience(data.content.cv?.experience || []);
    setEducation(data.content.cv?.education || []);
    
    setStorageHint(data.storageHint);
    setAuthed(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadContent().catch(() => setLoading(false));
  }, [loadContent]);

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
      deployed: deployed.map((p) => ({
        ...p,
        homepage: p.homepage || null,
      })),
      projects: projects.map((p) => ({
        ...p,
        tags: Array.isArray(p.tags)
          ? p.tags
          : String(p.tags || "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
      })),
      profile,
      cv: {
        skills: skillsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        summary: summaryText.trim() || undefined,
        experience,
        education
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
    setStatus(`Saved successfully (${data.storage}). Cache cleared.`);
    setError(false);
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
    setStatus(`Uploaded → ${data.url}`);
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
            <input
              id="admin-pw"
              type="password"
              placeholder="Enter admin password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {loginError && (
            <p className="admin-status error">{loginError}</p>
          )}
          <button type="submit" className="admin-btn admin-btn--primary admin-btn--block">
            Authenticate
          </button>
        </form>
        <a href="/" className="admin-back">
          ← Back to Portfolio
        </a>
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
          <button type="button" className={`admin-nav-item${tab === "achievements" ? " active" : ""}`} onClick={() => setTab("achievements")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
            Achievements
          </button>
          <button type="button" className={`admin-nav-item${tab === "deployed" ? " active" : ""}`} onClick={() => setTab("deployed")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            Live Projects
          </button>
          <button type="button" className={`admin-nav-item${tab === "projects" ? " active" : ""}`} onClick={() => setTab("projects")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            Showcase
          </button>
          <button type="button" className={`admin-nav-item${tab === "profile" ? " active" : ""}`} onClick={() => setTab("profile")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Profile & Links
          </button>
          <button type="button" className={`admin-nav-item${tab === "cv" ? " active" : ""}`} onClick={() => setTab("cv")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            CV Editor
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <p className="admin-storage-hint">{storageHint}</p>
          <button type="button" className="admin-btn admin-btn--danger admin-btn--block" onClick={logout}>
            Sign Out
          </button>
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
            {status && (
              <span className={`admin-status-badge ${error ? 'error' : 'success'}`}>
                {status}
              </span>
            )}
            <button
              type="button"
              className="admin-btn admin-btn--primary"
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
              <div className="admin-section-header">
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={() => setAchievements([emptyAchievement(), ...achievements])}
                >
                  + Create New Achievement
                </button>
              </div>
              <div className="admin-list">
                {achievements.map((a, i) => (
                  <div key={a.id} className="admin-card">
                    <div className="admin-card-header">
                      <h3>{a.title || 'Untitled Achievement'}</h3>
                      <div className="admin-card-actions">
                        <button type="button" className="icon-btn" onClick={() => moveItem(achievements, i, 'up', setAchievements)} disabled={i === 0}>↑</button>
                        <button type="button" className="icon-btn" onClick={() => moveItem(achievements, i, 'down', setAchievements)} disabled={i === achievements.length - 1}>↓</button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--small"
                          onClick={() => setAchievements(achievements.filter((_, j) => j !== i))}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="admin-card-body grid-2">
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
                        <label>Image Path or URL</label>
                        <div className="image-input-group">
                          <input value={a.image} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, image: e.target.value } : item))} />
                          <label className="admin-btn admin-btn--ghost upload-btn">
                            Upload
                            <input type="file" accept="image/*" hidden onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadFile(f, (url) => setAchievements(achievements.map((item, j) => j === i ? { ...item, image: url } : item)));
                            }} />
                          </label>
                        </div>
                        {a.image && <img src={a.image} alt="Preview" className="admin-image-preview" />}
                      </div>
                      <div className="admin-field col-span-2">
                        <label>Short Description (Card)</label>
                        <textarea rows={2} value={a.description} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, description: e.target.value } : item))} />
                      </div>
                      <div className="admin-field col-span-2">
                        <label>Detailed Description (Modal)</label>
                        <textarea rows={4} value={a.detail || ""} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, detail: e.target.value } : item))} />
                      </div>
                      <div className="admin-field">
                        <label>Instagram Highlight (Optional)</label>
                        <input value={a.instagramHighlight || ""} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, instagramHighlight: e.target.value } : item))} />
                      </div>
                      <div className="admin-field">
                        <label>Source/Post URL (Optional)</label>
                        <input value={a.sourceUrl || ""} onChange={(e) => setAchievements(achievements.map((item, j) => j === i ? { ...item, sourceUrl: e.target.value } : item))} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "deployed" && (
            <section className="admin-section">
               <div className="admin-section-header">
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={() => setDeployed([emptyDeployed(), ...deployed])}
                >
                  + Add Live Project
                </button>
              </div>
              <div className="admin-list">
                {deployed.map((p, i) => (
                  <div key={p.id} className="admin-card">
                    <div className="admin-card-header">
                      <h3>{p.name || 'Untitled Project'}</h3>
                      <div className="admin-card-actions">
                        <button type="button" className="icon-btn" onClick={() => moveItem(deployed, i, 'up', setDeployed)} disabled={i === 0}>↑</button>
                        <button type="button" className="icon-btn" onClick={() => moveItem(deployed, i, 'down', setDeployed)} disabled={i === deployed.length - 1}>↓</button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--small"
                          onClick={() => setDeployed(deployed.filter((_, j) => j !== i))}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="admin-card-body grid-2">
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
                            <span className="slider"></span>
                            Featured on Homepage
                         </label>
                         <label className="toggle-switch">
                            <input type="checkbox" checked={p.isFounder || false} onChange={(e) => setDeployed(deployed.map((item, j) => j === i ? { ...item, isFounder: e.target.checked } : item))} />
                            <span className="slider"></span>
                            Is Founder (printsLB)
                         </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "projects" && (
            <section className="admin-section">
               <div className="admin-section-header">
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={() => setProjects([emptyProject(), ...projects])}
                >
                  + Add Showcase Project
                </button>
              </div>
              <div className="admin-list">
                {projects.map((p, i) => (
                  <div key={p.id} className="admin-card">
                    <div className="admin-card-header">
                      <h3>{p.title || 'Untitled Project'}</h3>
                      <div className="admin-card-actions">
                        <button type="button" className="icon-btn" onClick={() => moveItem(projects, i, 'up', setProjects)} disabled={i === 0}>↑</button>
                        <button type="button" className="icon-btn" onClick={() => moveItem(projects, i, 'down', setProjects)} disabled={i === projects.length - 1}>↓</button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--small"
                          onClick={() => setProjects(projects.filter((_, j) => j !== i))}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="admin-card-body grid-2">
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
                         <label className="toggle-switch">
                            <input type="checkbox" checked={p.featured} onChange={(e) => setProjects(projects.map((item, j) => j === i ? { ...item, featured: e.target.checked } : item))} />
                            <span className="slider"></span>
                            Featured Showcase
                         </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "cv" && (
            <section className="admin-section">
               <div className="admin-card mb-4">
                 <div className="admin-card-header">
                   <h3>Summary & Skills</h3>
                 </div>
                 <div className="admin-card-body">
                    <div className="admin-field">
                      <label>About Summary (Optional)</label>
                      <textarea
                        value={summaryText}
                        onChange={(e) => setSummaryText(e.target.value)}
                        rows={5}
                        placeholder="Write a brief introduction shown on the homepage..."
                      />
                    </div>
                    <div className="admin-field mt-4">
                      <label>Skills List (One per line)</label>
                      <textarea
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        rows={16}
                        spellCheck={false}
                        className="font-mono"
                        placeholder="React&#10;Next.js&#10;TypeScript"
                      />
                    </div>
                 </div>
               </div>

               <div className="admin-section-header mt-8">
                  <h2 style={{color: '#fff', fontSize: '1.25rem', margin: 0}}>Work Experience</h2>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary admin-btn--small"
                    onClick={() => setExperience([{ title: "", period: "", summary: "" }, ...experience])}
                  >
                    + Add Experience
                  </button>
               </div>
               <div className="admin-list mt-4">
                  {experience.map((exp, i) => (
                    <div key={i} className="admin-card">
                       <div className="admin-card-header">
                          <h3>{exp.title || 'New Experience'}</h3>
                          <div className="admin-card-actions">
                            <button type="button" className="icon-btn" onClick={() => moveItem(experience, i, 'up', setExperience)} disabled={i === 0}>↑</button>
                            <button type="button" className="icon-btn" onClick={() => moveItem(experience, i, 'down', setExperience)} disabled={i === experience.length - 1}>↓</button>
                            <button type="button" className="admin-btn admin-btn--danger admin-btn--small" onClick={() => setExperience(experience.filter((_, j) => j !== i))}>Delete</button>
                          </div>
                       </div>
                       <div className="admin-card-body grid-2">
                          <div className="admin-field">
                            <label>Title / Role</label>
                            <input value={exp.title} onChange={(e) => setExperience(experience.map((item, j) => j === i ? { ...item, title: e.target.value } : item))} />
                          </div>
                          <div className="admin-field">
                            <label>Period (e.g. 2021 - Present)</label>
                            <input value={exp.period} onChange={(e) => setExperience(experience.map((item, j) => j === i ? { ...item, period: e.target.value } : item))} />
                          </div>
                          <div className="admin-field col-span-2">
                            <label>Summary / Details</label>
                            <textarea rows={3} value={exp.summary} onChange={(e) => setExperience(experience.map((item, j) => j === i ? { ...item, summary: e.target.value } : item))} />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="admin-section-header mt-8">
                  <h2 style={{color: '#fff', fontSize: '1.25rem', margin: 0}}>Education</h2>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary admin-btn--small"
                    onClick={() => setEducation([{ school: "", detail: "" }, ...education])}
                  >
                    + Add Education
                  </button>
               </div>
               <div className="admin-list mt-4">
                  {education.map((edu, i) => (
                    <div key={i} className="admin-card">
                       <div className="admin-card-header">
                          <h3>{edu.school || 'New Education'}</h3>
                          <div className="admin-card-actions">
                            <button type="button" className="icon-btn" onClick={() => moveItem(education, i, 'up', setEducation)} disabled={i === 0}>↑</button>
                            <button type="button" className="icon-btn" onClick={() => moveItem(education, i, 'down', setEducation)} disabled={i === education.length - 1}>↓</button>
                            <button type="button" className="admin-btn admin-btn--danger admin-btn--small" onClick={() => setEducation(education.filter((_, j) => j !== i))}>Delete</button>
                          </div>
                       </div>
                       <div className="admin-card-body grid-2">
                          <div className="admin-field col-span-2">
                            <label>School / Institution</label>
                            <input value={edu.school} onChange={(e) => setEducation(education.map((item, j) => j === i ? { ...item, school: e.target.value } : item))} />
                          </div>
                          <div className="admin-field col-span-2">
                            <label>Detail (Degree, Year, etc.)</label>
                            <textarea rows={2} value={edu.detail} onChange={(e) => setEducation(education.map((item, j) => j === i ? { ...item, detail: e.target.value } : item))} />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          )}

          {tab === "profile" && profile && (
            <section className="admin-section">
              <div className="admin-card">
                 <div className="admin-card-body grid-2">
                    <div className="admin-field col-span-2">
                      <label>Hero Title</label>
                      <input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Hero Subtitle (Headline)</label>
                      <input value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>AI Diploma Line</label>
                      <input value={profile.aiDiploma} onChange={(e) => setProfile({ ...profile, aiDiploma: e.target.value })} />
                    </div>
                    
                    <h3 className="col-span-2 mt-4 form-section-title">Social Links</h3>
                    <div className="admin-field">
                      <label>GitHub URL</label>
                      <input value={profile.github} onChange={(e) => setProfile({ ...profile, github: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label>LinkedIn URL</label>
                      <input value={profile.linkedin} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label>Instagram URL</label>
                      <input value={profile.instagram} onChange={(e) => setProfile({ ...profile, instagram: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label>Linktree URL</label>
                      <input value={profile.linktree} onChange={(e) => setProfile({ ...profile, linktree: e.target.value })} />
                    </div>

                    <h3 className="col-span-2 mt-4 form-section-title">printsLB Config</h3>
                    <div className="admin-field">
                      <label>Business Name</label>
                      <input value={profile.printsLb?.name || ''} onChange={(e) => setProfile({ ...profile, printsLb: { ...profile.printsLb, name: e.target.value } })} />
                    </div>
                    <div className="admin-field">
                      <label>Website URL</label>
                      <input value={profile.printsLb?.url || ''} onChange={(e) => setProfile({ ...profile, printsLb: { ...profile.printsLb, url: e.target.value } })} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Tagline</label>
                      <input value={profile.printsLb?.tagline || ''} onChange={(e) => setProfile({ ...profile, printsLb: { ...profile.printsLb, tagline: e.target.value } })} />
                    </div>
                 </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
