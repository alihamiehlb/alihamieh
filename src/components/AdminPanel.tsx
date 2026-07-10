"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AchievementRecord,
  AdminContentPayload,
  DeployedRecord,
  ProfileRecord,
  ProjectRecord,
} from "@/lib/types/site";

const GUIDES = {
  achievements: `Add a certificate or award. Required: unique id (slug), title, short description, category, image path or URL. Optional: detail (long text for modal), instagramHighlight, sourceUrl (link to IG post). Upload an image first, then paste the returned URL into image.`,
  deployed: `Live GitHub projects. Required: id, name, description, github URL. Optional: homepage (live site), language, featured, isFounder (only for printsLB).`,
  projects: `Portfolio showcase projects (local work). Required: id, title, description, tags (comma-separated). Optional: featured (true/false). Descriptions are shown on the main site cards.`,
  profile: `Site-wide links and hero text. printsLB url should be https://printslb.com for your domain.`,
  skills: `Skills shown on the site (Skills section). One skill per line — tech (Python, Linux, embedded/ESP32/Arduino), soft skills, tools. If you already saved overrides here, this list replaces the auto CV skills on the live site.`,
};

type Tab = "achievements" | "deployed" | "projects" | "profile" | "skills";

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
  const [skillsText, setSkillsText] = useState("");
  const [summaryText, setSummaryText] = useState("");

  const loadContent = useCallback(async () => {
    const res = await fetch("/api/admin/content");
    if (res.status === 401) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    if (!res.ok) throw new Error("Failed to load");
    const data = await res.json();
    setAchievements(data.content.achievements);
    setDeployed(
      data.content.deployed.map((p: DeployedRecord) => ({
        ...p,
        homepage: p.homepage || "",
      }))
    );
    setProjects(data.content.projects);
    setProfile(data.content.profile);
    setSkillsText((data.content.cv?.skills || []).join("\n"));
    setSummaryText(data.content.cv?.summary || "");
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
    setStatus(`Saved successfully (${data.storage}). Refresh the homepage to see changes.`);
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
          <div className="admin-login-icon">🔒</div>
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
          <button type="submit" className="admin-btn admin-btn--primary">
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
          {(
            [
              ["achievements", "🏆 Achievements"],
              ["deployed", "🌐 Live Projects"],
              ["projects", "💼 Showcase"],
              ["profile", "👤 Profile & Links"],
              ["skills", "⚡ Skills & About"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`admin-nav-item${tab === id ? " active" : ""}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
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
              💾 Save All Changes
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

          {tab === "skills" && (
            <section className="admin-section">
               <div className="admin-card">
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
                      <input value={profile.printsLb.name} onChange={(e) => setProfile({ ...profile, printsLb: { ...profile.printsLb, name: e.target.value } })} />
                    </div>
                    <div className="admin-field">
                      <label>Website URL</label>
                      <input value={profile.printsLb.url} onChange={(e) => setProfile({ ...profile, printsLb: { ...profile.printsLb, url: e.target.value } })} />
                    </div>
                    <div className="admin-field col-span-2">
                      <label>Tagline</label>
                      <input value={profile.printsLb.tagline} onChange={(e) => setProfile({ ...profile, printsLb: { ...profile.printsLb, tagline: e.target.value } })} />
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
