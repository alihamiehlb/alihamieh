import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const USER = process.env.GITHUB_USER || "alihamiehlb";

const SKIP_REPOS = new Set(["contact-me-instagram", "iris"]);

const FEATURED = new Set(["PrintsLB", "ssa-shoot-score-academy", "mission-sni-spoofing"]);

function cleanDesc(text) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "ali-hamieh-portfolio",
    },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function main() {
  const [user, repos] = await Promise.all([
    fetchJson(`https://api.github.com/users/${USER}`),
    fetchJson(
      `https://api.github.com/users/${USER}/repos?sort=updated&per_page=100`
    ),
  ]);

  const deployed = repos
    .filter((r) => !r.fork && !SKIP_REPOS.has(r.name))
    .map((r) => {
      let homepage = r.homepage || null;
      if (r.name === "PrintsLB") {
        homepage = "https://printslb.com";
      }
      return {
      id: r.name,
      name: r.name === "PrintsLB" ? "printsLB" : r.name.replace(/-/g, " "),
      description: cleanDesc(r.description) || "Open-source project on GitHub.",
      homepage,
      github: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      featured: FEATURED.has(r.name) || Boolean(r.homepage),
      isFounder: r.name === "PrintsLB",
    };
    })
    .sort((a, b) => {
      if (a.isFounder !== b.isFounder) return a.isFounder ? -1 : 1;
      if (Boolean(a.homepage) !== Boolean(b.homepage))
        return a.homepage ? -1 : 1;
      return 0;
    });

  const profilePath = path.join(root, "content", "profile.json");
  let profile = {};
  if (fs.existsSync(profilePath)) {
    profile = JSON.parse(fs.readFileSync(profilePath, "utf8"));
  }
  profile.github = user.html_url;
  profile.githubBio = cleanDesc(user.bio);
  profile.publicRepos = user.public_repos;
  profile.avatarUrl = user.avatar_url;

  const cvPath = path.join(root, "content", "cv.json");
  if (fs.existsSync(cvPath)) {
    const cv = JSON.parse(fs.readFileSync(cvPath, "utf8"));
    cv.github = user.html_url;
    cv.title = profile.title || cv.title;
    fs.writeFileSync(cvPath, JSON.stringify(cv, null, 2), "utf8");
  }

  fs.writeFileSync(
    path.join(root, "content", "deployed.json"),
    JSON.stringify(
      {
        username: USER,
        updatedAt: new Date().toISOString().slice(0, 10),
        projects: deployed,
      },
      null,
      2
    ),
    "utf8"
  );
  fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2), "utf8");

  const live = deployed.filter((p) => p.homepage).length;
  console.log(`GitHub sync — ${deployed.length} repos, ${live} live URLs`);
}

main().catch((e) => {
  const deployedPath = path.join(root, "content", "deployed.json");
  if (fs.existsSync(deployedPath)) {
    console.warn("GitHub sync skipped (offline) — using existing deployed.json");
    process.exit(0);
  }
  console.error(e);
  process.exit(1);
});
