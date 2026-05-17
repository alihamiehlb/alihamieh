import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const CERTS_DIR = process.env.CERTS_DIR || "c:\\folders\\certificates";
const POSTS_FILE = path.join(root, "content", "instagram-posts.json");
const OUT_FILE = path.join(root, "content", "achievements.json");
const PUBLIC_DIR = path.join(root, "public", "achievements");

const INSTAGRAM = "https://www.instagram.com/alihamiehlb/";

const CERT_CATALOG = [
  {
    file: "wro.jpeg",
    title: "World Robot Olympiad",
    description: "Robotics competition — design, build, and program competition robots.",
    category: "Robotics",
    detail:
      "Featured on my Instagram highlights (robotics). WRO pushed my mechanical design, sensors, and coding under real competition pressure.",
    instagramHighlight: "Robotics highlight reel on @alihamiehlb",
  },
  {
    file: "completing olympiad.jpeg",
    title: "STEAM Center AIO — Cybersecurity & Olympiad",
    description:
      "Cybersecurity certifications and olympiad completion at STEAM Center AIO (same program).",
    category: "Cybersecurity",
    detail:
      "Certificate from STEAM Center AIO for cybersecurity training and academic olympiad completion — this is one program, not two separate entries.",
    instagramHighlight: "Certificates highlight · @alihamiehlb",
  },
  {
    file: "participation in olempiad.jpeg",
    title: "Olympiad participation",
    description: "Competed in multi-round olympiad challenges.",
    category: "Academic",
    detail:
      "Participation badge from national-style olympiad rounds in Lebanon — part of the same awards story I share on Instagram.",
    instagramHighlight: "Certificates highlight",
  },
  {
    file: "innovators_all.jpeg",
    title: "Innovators Academy",
    description: "Innovators Academy — robotics, Flutter, Python, web, and AI tracks.",
    category: "Academy",
    detail:
      "Years of Innovators Academy training (also on my CV): programming fundamentals through robotics and modern dev stacks. Posted on IG as part of my learning journey.",
    instagramHighlight: "Academy & robotics posts",
  },
  {
    file: "semi colon certificate.png",
    title: "Semicolon — Cybersecurity",
    description: "Offensive cybersecurity program at Semicolon Academy.",
    category: "Academy",
    detail:
      "One-year offensive security track — the certificate in my highlights matches the Semicolon line on my CV and portfolio.",
    instagramHighlight: "Certificates highlight",
  },
  {
    file: "alison_python_certificate.png",
    title: "Alison — Python",
    description: "Python fundamentals certification (Alison).",
    category: "Certification",
    detail:
      "Early formal Python credential — complements self-taught work and is listed under my Alison learning path on the site.",
    instagramHighlight: "Certificates highlight",
  },
  {
    file: "phone fixing.jpeg",
    title: "Phone repair",
    description: "Real device repair — screens, boards, and diagnostics.",
    category: "Hardware",
    detail:
      "Hands-on phone repair is in my Instagram bio skills. These photos are workshop practice I share with followers.",
    instagramHighlight: "Bio: phone repair · ML · Arduino",
  },
  {
    file: "another phone fixing.jpeg",
    title: "Mobile repair workshop",
    description: "More advanced handset repair sessions.",
    category: "Hardware",
    detail:
      "Additional repair work documenting teardowns and fixes — part of the same hardware story on @alihamiehlb.",
    instagramHighlight: "Personal / maker highlights",
  },
  {
    file: "arc.jpeg",
    title: "ARC robotics event",
    description: "ARC-style robotics event and team engineering.",
    category: "Robotics",
    detail:
      "Event photo from robotics community work — aligned with WRO/Innovators path and my IG robotics highlight.",
    instagramHighlight: "Robotics highlight",
  },
];

function safeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
}

function certImagePath(item) {
  const destName = safeName(item.file);
  const dest = path.join(PUBLIC_DIR, destName);
  const webPath = `/achievements/${destName}`;
  const src = path.join(CERTS_DIR, item.file);
  if (fs.existsSync(src)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    fs.copyFileSync(src, dest);
    return webPath;
  }
  /* On Vercel there is no local certs folder — use images already in git */
  if (fs.existsSync(dest)) return webPath;
  return null;
}

async function fetchInstagramThumb(postUrl) {
  try {
    const res = await fetch(postUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();
    const og =
      html.match(/property="og:image" content="([^"]+)"/) ||
      html.match(/content="([^"]+)" property="og:image"/);
    const title =
      html.match(/property="og:title" content="([^"]+)"/)?.[1] ||
      html.match(/<title>([^<]+)<\/title>/)?.[1];
    return {
      imageUrl: og?.[1]?.replace(/&amp;/g, "&") || null,
      title: title?.replace(/&quot;/g, '"').slice(0, 120) || "Instagram post",
    };
  } catch {
    return null;
  }
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return true;
}

async function syncInstagramPosts() {
  if (!fs.existsSync(POSTS_FILE)) return [];
  let posts = [];
  try {
    posts = JSON.parse(fs.readFileSync(POSTS_FILE, "utf8")).posts || [];
  } catch {
    return [];
  }

  const results = [];
  for (let i = 0; i < posts.length; i++) {
    const url = typeof posts[i] === "string" ? posts[i] : posts[i]?.url;
    if (!url) continue;
    const meta = await fetchInstagramThumb(url);
    if (!meta?.imageUrl) continue;
    const dest = path.join(PUBLIC_DIR, `instagram-${i + 1}.jpg`);
    const ok = await downloadImage(meta.imageUrl, dest);
    if (!ok) continue;
    results.push({
      id: `instagram-${i + 1}`,
      title: meta.title,
      description: "From @alihamiehlb on Instagram.",
      category: "Instagram",
      image: `/achievements/instagram-${i + 1}.jpg`,
      sourceUrl: url,
    });
  }
  return results;
}

async function main() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const achievements = [];

  for (const item of CERT_CATALOG) {
    const image = certImagePath(item);
    if (!image) continue;
    achievements.push({
      id: safeName(item.file).replace(/\.[a-z]+$/, ""),
      title: item.title,
      description: item.description,
      detail: item.detail || item.description,
      instagramHighlight: item.instagramHighlight || "",
      category: item.category,
      image,
      source: "certificate",
    });
  }

  const insta = await syncInstagramPosts();
  achievements.push(...insta);

  const payload = {
    instagram: INSTAGRAM,
    updatedAt: new Date().toISOString().slice(0, 10),
    achievements,
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), "utf8");
  console.log(
    `Wrote achievements.json — ${achievements.length} items (${insta.length} from Instagram URLs)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
