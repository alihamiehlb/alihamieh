import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const FOLDERS_ROOT = process.env.FOLDERS_ROOT || "c:\\folders";

const SHOWCASE_DIRS = [
  { slug: "kalo-academy", title: "SSA Academy", tags: ["web", "education"], featured: true },
  { slug: "holy-tunnel-operation", title: "Hash-Sec Tunnel", tags: ["mobile", "security", "azure"], featured: true },
  { slug: "holy_grail", title: "Holy Grail", tags: ["full-stack"] },
  { slug: "automation-pentagon", title: "Khaybar News Bot", tags: ["automation", "python", "ai"] },
  { slug: "automation_secret_mission", title: "Automation Secret Mission", tags: ["automation"] },
  { slug: "web development projects", title: "Web Development Collection", tags: ["web"] },
  { slug: "flutter  projects folder", title: "Flutter Mobile Suite", tags: ["mobile", "flutter"], featured: true },
  { slug: "cnc-project", title: "CNC & Maker Lab", tags: ["hardware", "cnc"] },
  { slug: "trading_bot", title: "RL Trading Agent", tags: ["python", "ml", "finance"] },
  { slug: "data_cleaning", title: "Data Cleaning Pipeline", tags: ["python", "data"] },
  { slug: "arzooni trading proj", title: "Arzooni Trading", tags: ["trading"] },
  {
    slug: "advertisment-proj",
    title: "Hamieh Ads",
    tags: ["mobile", "flutter", "go"],
    base: path.join(root, "..", "advertisment-proj"),
    featured: true,
  },
];

const EXCLUDE_SLUGS = new Set(["final_project", "tzeva_adom_blue_dashboard", "luxe-boutique"]);

const SKIP = new Set([
  "node_modules", ".git", ".next", "dist", "build", ".idea",
  "__pycache__", "venv", ".venv", ".dart_tool", "target",
]);

function readText(p, max = 8000) {
  try {
    return fs.readFileSync(p, "utf8").slice(0, max);
  } catch {
    return "";
  }
}

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function analyzeProject(dir, slug) {
  const readme = ["README.md", "readme.md"].map((n) => readText(path.join(dir, n))).find(Boolean) || "";
  const pkg = readJson(path.join(dir, "package.json"));
  const pubspec = readText(path.join(dir, "pubspec.yaml"), 2000);
  const appPy = readText(path.join(dir, "app.py"), 4000);
  const mainPy = readText(path.join(dir, "main.py"), 4000);
  const appJsx = readText(path.join(dir, "src", "App.jsx"), 12000);

  if (slug === "luxe-boutique" || (appJsx.includes("ShoppingBag") && appJsx.includes("products"))) {
    return {
      description:
        "A full luxury fashion store in the browser — browse dresses and accessories, add to cart, check out, and log in as a customer or admin to manage stock.",
      overview:
        "Built with React and Vite. Shoppers search categories, pick sizes and colors, and use a live cart. Admins edit products, stock, and orders from the same app — it is a complete boutique storefront, not just a landing page.",
    };
  }

  const webReadme = readText(path.join(dir, "web", "README.md"));
  if (slug === "kalo-academy" || webReadme.includes("Shoot Soccer")) {
    if (webReadme.includes("Shoot Soccer") || slug === "kalo-academy") {
      return {
        description:
          "SSA (Shoot Soccer Academy) — staff manage player rosters, guardians, invoices, and stats from one dashboard.",
        overview:
          "Next.js app with Postgres (Prisma): search players, export CSV/JSON, generate invoices, and run the academy back-office. Live at ssa-shoot-score-academy.vercel.app.",
      };
    }
  }

  if (slug === "tzeva_adom_blue_dashboard" || appPy.includes("Tzeva Adom")) {
    return {
      description:
        "A blue-themed dashboard that maps Tzeva Adom alert history — filter by date, see threat types, and compare activity across cities from spreadsheet data.",
      overview:
        "Flask app loads cities, polygons, and historical alerts from Excel, then charts alerts per day, threat breakdowns, and top affected cities. Built to explore real alert datasets interactively in the browser.",
    };
  }

  if (slug === "holy-tunnel-operation" || readme.includes("Hash-Sec Tunnel")) {
    return {
      description:
        "Android VPN app that routes your traffic through your own Azure relay with TLS SNI set to look like Microsoft Teams — sign in with Microsoft and start the tunnel from the phone.",
      overview:
        "Flutter client provisions a VM in your Azure subscription, runs the hamieh relay, and uses Android VpnService + tun2socks so browsing goes through the tunnel. Fork of mission-sni-spoofing with on-device login instead of desktop CLI.",
    };
  }

  if (slug === "automation-pentagon" || readme.includes("Khaybar News")) {
    return {
      description:
        "Telegram-to-WhatsApp news bot — watches channels, filters posts with Gemini AI, translates to Arabic, and forwards text and media to a WhatsApp group.",
      overview:
        "Python bot using Telethon and Green API: urgency detection, bias filtering, media forwarding, and Docker/Railway deployment. Automates a news desk workflow end to end.",
    };
  }

  if (slug === "trading_bot" || fs.existsSync(path.join(dir, "RLTradingAgent"))) {
    return {
      description:
        "Reinforcement-learning forex bot — trains an agent in a custom Gym environment to go long, short, or stay out using historical price windows.",
      overview:
        "RLTradingAgent includes trading_env.py (balance, commission, positions), training scripts, checkpoints, and evaluation plots. It simulates 0.01-lot trades and learns from market features over sliding windows.",
    };
  }

  if (slug === "data_cleaning" || fs.existsSync(path.join(dir, "israel_losses.json"))) {
    return {
      description:
        "Data pipeline that turns raw spreadsheets into cleaned JSON and formatted Word reports with stats and loss summaries.",
      overview:
        "Python scripts extract, aggregate, and document structured datasets (including israel_losses workbooks) — export to DOCX/JSON for analysis and presentation.",
    };
  }

  if (slug === "advertisment-proj" || pubspec.includes("hamieh_ads")) {
    return {
      description:
        "Flutter + Go tooling around WhatsApp automation and ad workflows — mobile UI with native bridges for messaging tasks.",
      overview:
        "Combines a Dart/Flutter front end with Go binaries (whatsapp.go, native libs) for Windows/Android builds. Built for campaign and messaging automation use cases.",
    };
  }

  if (pubspec.includes("flutter:")) {
    return {
      description:
        readText(path.join(dir, "README.md"), 400).split("\n").find((l) => l.length > 30)?.slice(0, 280) ||
        "Flutter mobile application with custom UI and device integrations.",
      overview: readme.slice(0, 900) || "Flutter/Dart project with platform-specific builds and assets.",
    };
  }

  if (pkg?.description && pkg.description.length > 15) {
    return {
      description: pkg.description.slice(0, 280),
      overview: readme.slice(0, 900) || pkg.description,
    };
  }

  if (readme.length > 60) {
    const first = readme.replace(/[#*`]/g, "").split("\n").find((l) => l.trim().length > 40);
    return {
      description: (first || readme).slice(0, 280),
      overview: readme.replace(/\s+/g, " ").slice(0, 900),
    };
  }

  if (mainPy.includes("def ") || appPy.includes("Flask")) {
    return {
      description: "Python application — see repository for automation, APIs, or data processing logic.",
      overview: (mainPy || appPy).slice(0, 500),
    };
  }

  return null;
}

function detectStack(dir) {
  const t = new Set();
  const c = (n) => fs.existsSync(path.join(dir, n));
  if (c("package.json")) t.add("Node.js");
  if (c("pubspec.yaml")) t.add("Flutter");
  if (c("requirements.txt")) t.add("Python");
  if (c("next.config.ts") || c("next.config.js")) t.add("Next.js");
  if (c("vite.config.js") || c("vite.config.ts")) t.add("Vite");
  return [...t];
}

function scanLanguages(dir, depth = 0, acc = {}) {
  if (depth > 3) return acc;
  try {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SKIP.has(ent.name)) continue;
      if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase();
        const map = { ".ts": "TypeScript", ".tsx": "TypeScript", ".js": "JavaScript", ".jsx": "JavaScript", ".py": "Python", ".dart": "Dart" };
        if (map[ext]) acc[map[ext]] = (acc[map[ext]] || 0) + 1;
      } else if (ent.isDirectory()) scanLanguages(path.join(dir, ent.name), depth + 1, acc);
    }
  } catch { /* ignore */ }
  return acc;
}

function scanProject(entry) {
  const dir = entry.base || path.join(FOLDERS_ROOT, entry.slug);
  if (!fs.existsSync(dir)) return null;

  const copy = analyzeProject(dir, entry.slug);
  if (!copy) return null;

  const stack = detectStack(dir);
  const pkg = readJson(path.join(dir, "package.json"));
  const langCounts = scanLanguages(dir);
  const languages = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  return {
    id: entry.slug.replace(/\s+/g, "-").toLowerCase(),
    title: entry.title,
    slug: entry.slug,
    tags: [...new Set([...entry.tags, ...stack.map((s) => s.toLowerCase())])],
    description: copy.description,
    overview: copy.overview,
    techStack: stack,
    dependencies: (pkg?.dependencies ? Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }) : []).slice(0, 24),
    languages,
    highlights: [copy.description],
    structure: [],
    scripts: pkg?.scripts ? Object.keys(pkg.scripts) : [],
    fileCount: 0,
    featured: Boolean(entry.featured),
  };
}

function main() {
  const outPath = path.join(root, "content", "projects.json");
  let projects = SHOWCASE_DIRS.map(scanProject)
    .filter(Boolean)
    .filter((p) => !EXCLUDE_SLUGS.has(p.id));
  if (!projects.length && fs.existsSync(outPath)) {
    try {
      projects = JSON.parse(fs.readFileSync(outPath, "utf8")).projects || [];
    } catch { /* ignore */ }
  }
  projects.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  fs.writeFileSync(outPath, JSON.stringify({ projects }, null, 2), "utf8");
  console.log(`Wrote projects.json — ${projects.length} (repo-analyzed descriptions)`);
}

main();
