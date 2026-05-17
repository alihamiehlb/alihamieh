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
    image: "/achievements/wro.jpeg",
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
    setStatus(`Saved (${data.storage}). Refresh the homepage to see changes.`);
    setError(false);
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
  }

  if (loading) {
    return (
      <div className="admin-root">
        <p>Loading admin…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="admin-root">
        <form className="admin-login" onSubmit={login}>
          <h1>Portfolio admin</h1>
          <p>Private panel — not visible to visitors. Sign in with your admin password.</p>
          <div className="admin-field">
            <label htmlFor="admin-pw">Password</label>
            <input
              id="admin-pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {loginError && (
            <p className="admin-status error">{loginError}</p>
          )}
          <button type="submit" className="admin-btn admin-btn--primary">
            Sign in
          </button>
        </form>
        <a href="/" className="admin-back">
          ← Back to site
        </a>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <a href="/" className="admin-back">
        ← View site
      </a>
      <header className="admin-header">
        <h1>Portfolio admin</h1>
        <p className="admin-storage">{storageHint}</p>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={logout}
        >
          Sign out
        </button>
      </header>

      <nav className="admin-tabs" aria-label="Admin sections">
        {(
          [
            ["achievements", "Achievements"],
            ["deployed", "Live projects"],
            ["projects", "Showcase"],
            ["profile", "Profile & links"],
            ["skills", "Skills & about"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`admin-tab${tab === id ? " active" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "achievements" && (
        <section className="admin-panel">
          <h2>Achievements</h2>
          <p className="admin-guide">{GUIDES.achievements}</p>
          <label className="admin-field">
            <span>Upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f, () => {});
              }}
            />
            <small>Use upload URL in the image field below</small>
          </label>
          <div className="admin-list">
            {achievements.map((a, i) => (
              <div key={a.id} className="admin-item">
                <div className="admin-item-head">
                  <strong>{a.title || a.id}</strong>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger"
                    onClick={() =>
                      setAchievements(achievements.filter((_, j) => j !== i))
                    }
                  >
                    Remove
                  </button>
                </div>
                {(
                  [
                    ["id", "id", "Unique slug"],
                    ["title", "title", "Card title"],
                    ["category", "category", "Robotics, Academy, …"],
                    ["image", "image", "Path or uploaded URL"],
                    ["description", "description", "Short card text"],
                    ["detail", "detail", "Modal long text"],
                    ["instagramHighlight", "instagramHighlight", "IG highlight note"],
                    ["sourceUrl", "sourceUrl", "Optional IG post URL"],
                  ] as const
                ).map(([key, field, hint]) => (
                  <div key={key} className="admin-field">
                    <label>{field}</label>
                    <input
                      value={String(a[key as keyof AchievementRecord] ?? "")}
                      onChange={(e) => {
                        const next = [...achievements];
                        next[i] = { ...a, [key]: e.target.value };
                        setAchievements(next);
                      }}
                    />
                    <small>{hint}</small>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => setAchievements([...achievements, emptyAchievement()])}
          >
            + Add achievement
          </button>
        </section>
      )}

      {tab === "deployed" && (
        <section className="admin-panel">
          <h2>Live projects (GitHub)</h2>
          <p className="admin-guide">{GUIDES.deployed}</p>
          <div className="admin-list">
            {deployed.map((p, i) => (
              <div key={p.id} className="admin-item">
                <div className="admin-item-head">
                  <strong>{p.name || p.id}</strong>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger"
                    onClick={() => setDeployed(deployed.filter((_, j) => j !== i))}
                  >
                    Remove
                  </button>
                </div>
                {(
                  [
                    ["id", "id"],
                    ["name", "name"],
                    ["description", "description"],
                    ["homepage", "homepage"],
                    ["github", "github"],
                    ["language", "language"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="admin-field">
                    <label>{label}</label>
                    <input
                      value={String(p[key] ?? "")}
                      onChange={(e) => {
                        const next = [...deployed];
                        next[i] = { ...p, [key]: e.target.value };
                        setDeployed(next);
                      }}
                    />
                  </div>
                ))}
                <label className="admin-field">
                  <span>featured</span>
                  <select
                    value={p.featured ? "yes" : "no"}
                    onChange={(e) => {
                      const next = [...deployed];
                      next[i] = { ...p, featured: e.target.value === "yes" };
                      setDeployed(next);
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label className="admin-field">
                  <span>isFounder (printsLB only)</span>
                  <select
                    value={p.isFounder ? "yes" : "no"}
                    onChange={(e) => {
                      const next = [...deployed];
                      next[i] = { ...p, isFounder: e.target.value === "yes" };
                      setDeployed(next);
                    }}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </label>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => setDeployed([...deployed, emptyDeployed()])}
          >
            + Add live project
          </button>
        </section>
      )}

      {tab === "projects" && (
        <section className="admin-panel">
          <h2>Showcase projects</h2>
          <p className="admin-guide">{GUIDES.projects}</p>
          <div className="admin-list">
            {projects.map((p, i) => (
              <div key={p.id} className="admin-item">
                <div className="admin-item-head">
                  <strong>{p.title || p.id}</strong>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger"
                    onClick={() => setProjects(projects.filter((_, j) => j !== i))}
                  >
                    Remove
                  </button>
                </div>
                <div className="admin-field">
                  <label>id</label>
                  <input
                    value={p.id}
                    onChange={(e) => {
                      const next = [...projects];
                      next[i] = { ...p, id: e.target.value };
                      setProjects(next);
                    }}
                  />
                </div>
                <div className="admin-field">
                  <label>title</label>
                  <input
                    value={p.title}
                    onChange={(e) => {
                      const next = [...projects];
                      next[i] = { ...p, title: e.target.value };
                      setProjects(next);
                    }}
                  />
                </div>
                <div className="admin-field">
                  <label>description</label>
                  <textarea
                    value={p.description}
                    onChange={(e) => {
                      const next = [...projects];
                      next[i] = { ...p, description: e.target.value };
                      setProjects(next);
                    }}
                  />
                </div>
                <div className="admin-field">
                  <label>tags (comma-separated)</label>
                  <input
                    value={Array.isArray(p.tags) ? p.tags.join(", ") : ""}
                    onChange={(e) => {
                      const next = [...projects];
                      next[i] = {
                        ...p,
                        tags: e.target.value.split(",").map((t) => t.trim()),
                      };
                      setProjects(next);
                    }}
                  />
                </div>
                <label className="admin-field">
                  <span>featured</span>
                  <select
                    value={p.featured ? "yes" : "no"}
                    onChange={(e) => {
                      const next = [...projects];
                      next[i] = { ...p, featured: e.target.value === "yes" };
                      setProjects(next);
                    }}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </label>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => setProjects([...projects, emptyProject()])}
          >
            + Add showcase project
          </button>
        </section>
      )}

      {tab === "skills" && (
        <section className="admin-panel">
          <h2>Skills & summary</h2>
          <p className="admin-guide">{GUIDES.skills}</p>
          <div className="admin-field">
            <label>About summary (optional)</label>
            <textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              rows={4}
            />
            <small>Shown in the About section on the homepage.</small>
          </div>
          <div className="admin-field">
            <label>Skills (one per line)</label>
            <textarea
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              rows={16}
              spellCheck={false}
            />
            <small>
              Linux distros, programming languages, cybersecurity, soft skills, etc.
            </small>
          </div>
        </section>
      )}

      {tab === "profile" && profile && (
        <section className="admin-panel">
          <h2>Profile & social links</h2>
          <p className="admin-guide">{GUIDES.profile}</p>
          {(
            [
              ["title", "Hero title"],
              ["headline", "Hero subtitle"],
              ["aiDiploma", "AI diploma line"],
              ["github", "GitHub URL"],
              ["linkedin", "LinkedIn URL"],
              ["instagram", "Instagram URL"],
              ["linktree", "Linktree URL"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="admin-field">
              <label>{label}</label>
              <input
                value={String(profile[key] ?? "")}
                onChange={(e) =>
                  setProfile({ ...profile, [key]: e.target.value })
                }
              />
            </div>
          ))}
          <h3 style={{ marginTop: "1rem", fontSize: "0.95rem" }}>printsLB</h3>
          <div className="admin-field">
            <label>Business name</label>
            <input
              value={profile.printsLb.name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  printsLb: { ...profile.printsLb, name: e.target.value },
                })
              }
            />
          </div>
          <div className="admin-field">
            <label>Website (printslb.com)</label>
            <input
              value={profile.printsLb.url}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  printsLb: { ...profile.printsLb, url: e.target.value },
                })
              }
            />
          </div>
          <div className="admin-field">
            <label>Tagline</label>
            <input
              value={profile.printsLb.tagline}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  printsLb: { ...profile.printsLb, tagline: e.target.value },
                })
              }
            />
          </div>
        </section>
      )}

      <div className="admin-toolbar">
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={saveAll}
        >
          Save all changes
        </button>
      </div>
      {status && (
        <p className={`admin-status${error ? " error" : ""}`}>{status}</p>
      )}
    </div>
  );
}
