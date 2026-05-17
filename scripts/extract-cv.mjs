import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdf from "pdf-parse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const portfolioDir = root;

const PDF_PRIORITY = [
  "Ali_Hamieh_Professional_CV_Final.pdf",
  "Profile.pdf",
  "ali_hamieh_cv_not_all_complete_8_11_2024.pdf",
];

function parseCvText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const emailMatch = text.match(/[\w.+-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/
  );
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  const githubMatch = text.match(/github\.com\/[\w-]+/i);

  const name =
    lines.find((l) => /^ali\s+hamieh/i.test(l)) ||
    lines.find((l) => l.split(" ").length <= 4 && /^[A-Z]/.test(l)) ||
    "Ali Hamieh";

  const skills = [];
  const skillSection = text.match(
    /skills?[:\s]*([\s\S]*?)(?:experience|education|projects|$)/i
  );
  if (skillSection) {
    const chunk = skillSection[1];
    chunk
      .split(/[,•|·\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 40)
      .forEach((s) => {
        if (!skills.includes(s)) skills.push(s);
      });
  }

  const commonTech = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Flutter",
    "Dart",
    "C",
    "C++",
    "SQL",
    "Git",
    "Docker",
    "Firebase",
    "Three.js",
    "HTML",
    "CSS",
    "Tailwind",
    "Arduino",
    "Unity",
    "Go",
    "Linux",
    "REST",
    "GraphQL",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Vercel",
    "Figma",
    "Blender",
    "Fusion 360",
    "CNC",
    "OSINT",
    "Cybersecurity",
  ];
  commonTech.forEach((t) => {
    if (new RegExp(`\\b${t.replace(/[.+]/g, "\\$&")}\\b`, "i").test(text)) {
      if (!skills.some((s) => s.toLowerCase() === t.toLowerCase())) skills.push(t);
    }
  });

  const EXTRA_SKILLS = [
    "3D Modeling",
    "PCB Design",
    "Phone Repair",
    "KiCad",
    "Blender",
    "Fusion 360",
  ];

  const LINUX_SKILLS = [
    "Linux (2+ years)",
    "Arch Linux",
    "Garuda Linux",
    "Ubuntu",
    "Kali Linux",
    "Parrot OS",
    "Kali NetHunter",
    "Bash / Shell",
    "System administration",
  ];

  const SOFT_SKILLS = [
    "Team collaboration",
    "Fast learner",
    "Public speaking",
    "Communication",
    "Problem solving",
    "Adaptability",
    "Time management",
  ];

  const EMBEDDED_SKILLS = [
    "Embedded Systems",
    "ESP32",
    "Arduino",
    "Microcontrollers",
    "Embedded firmware",
    "ESP32 Marauder",
    "DSAI Mochi",
    "IoT prototyping",
    "Sensors & actuators",
    "Hardware prototyping",
  ];

  const cleanedSkills = [
    ...new Set(
      [
        ...skills
          .map((s) => s.replace(/^[-•]\s*/, "").replace(/^[^:]+:\s*/, "").trim())
          .filter((s) => s.length > 1 && s.length < 36 && !/^persian/i.test(s)),
        ...EXTRA_SKILLS,
        ...EMBEDDED_SKILLS,
        ...LINUX_SKILLS,
        ...SOFT_SKILLS,
      ].map((s) =>
        s.replace(/^fast learning$/i, "Fast learner").replace(/^Python$/i, "Python")
      )
    ),
  ];
  // Dedupe Python variants
  const seen = new Set();
  const dedupedSkills = cleanedSkills.filter((s) => {
    const key = s.toLowerCase().replace(/\s*\(advanced\)\s*/i, "").trim();
    if (key === "python" && seen.has("python")) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const experience = [];
  const expBlocks = text.match(
    /(?:experience|work history|employment)[:\s]*([\s\S]*?)(?:education|skills|projects|certifications|$)/i
  );
  if (expBlocks) {
    const bullets = expBlocks[1].split(/\n{2,}|\n(?=[A-Z])/);
    bullets.slice(0, 8).forEach((block) => {
      const b = block.trim();
      if (b.length > 20) {
        experience.push({
          title: b.split("\n")[0]?.slice(0, 80) || "Role",
          summary: b.slice(0, 400),
        });
      }
    });
  }

  const education = [];
  const eduMatch = text.match(
    /(?:education)[:\s]*([\s\S]*?)(?:skills|experience|projects|$)/i
  );
  if (eduMatch) {
    eduMatch[1]
      .split(/\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 5)
      .slice(0, 6)
      .forEach((line) => education.push({ school: line, detail: "" }));
  }

  const summaryMatch = text.match(
    /(?:summary|profile|about)[:\s]*([\s\S]{50,500}?)(?:\n\n|skills|experience)/i
  );

  return {
    name,
    birthDate: "2009-05-14",
    title: "Student at Al Mahdi School · Developer & Maker",
    email: emailMatch?.[0] || "",
    phone: phoneMatch?.[0] || "",
    linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : "",
    github: githubMatch ? `https://${githubMatch[0]}` : "",
    location: lines.find((l) => /lebanon|beirut/i.test(l)) || "Lebanon",
    summary:
      summaryMatch?.[1]?.replace(/\s+/g, " ").trim() ||
      lines.find((l) => l.length > 80 && !/@/.test(l))?.slice(0, 320) ||
      "Creative developer building web, mobile, automation, and hardware projects.",
    skills: dedupedSkills.slice(0, 48),
    experience: experience.slice(0, 6),
    education: education.slice(0, 4),
    learningSources: [
      {
        name: "Innovators Academy",
        focus: "Robotics, innovation, and competition-ready engineering",
      },
      {
        name: "Semicolon",
        focus: "Offensive cybersecurity and secure development",
      },
      {
        name: "STEAM Center AIO",
        focus: "Cybersecurity certifications and STEAM security tracks",
      },
      {
        name: "Hexapi Academy",
        focus: "PCB design, electronics, and hardware prototyping",
      },
      {
        name: "Alison",
        focus: "Online courses, certifications, and self-paced learning",
      },
    ],
    rawLineCount: lines.length,
  };
}

async function main() {
  const outPath = path.join(root, "content", "cv.json");
  let curated = null;
  if (fs.existsSync(outPath)) {
    try {
      curated = JSON.parse(fs.readFileSync(outPath, "utf8"));
    } catch {
      curated = null;
    }
  }

  const pdfs = PDF_PRIORITY.filter((f) =>
    fs.existsSync(path.join(portfolioDir, f))
  );

  let parsed = curated;
  if (pdfs.length) {
    let mergedText = "";
    for (const pdfName of pdfs) {
      const buf = fs.readFileSync(path.join(portfolioDir, pdfName));
      const data = await pdf(buf);
      mergedText += `\n\n--- ${pdfName} ---\n\n${data.text}`;
    }
    const fromPdf = parseCvText(mergedText);
    if (curated?.skillGroups) {
      parsed = {
        ...curated,
        birthDate: curated.birthDate || "2009-05-14",
        email: fromPdf.email || curated.email,
        phone: fromPdf.phone || curated.phone,
        linkedin: fromPdf.linkedin || curated.linkedin,
        github: fromPdf.github || curated.github,
        sourcePdfs: pdfs,
        lastUpdated: new Date().toISOString().slice(0, 10),
      };
    } else {
      parsed = { ...fromPdf, sourcePdfs: pdfs };
    }
  }

  if (!parsed) {
    throw new Error("No CV data — add content/cv.json or CV PDFs in portfolio directory");
  }

  parsed.lastUpdated = new Date().toISOString().slice(0, 10);
  fs.mkdirSync(path.join(root, "content"), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), "utf8");
  console.log(
    "Wrote content/cv.json —",
    parsed.name,
    curated?.skillGroups ? "(curated, contact synced from PDF)" : `(${parsed.skills?.length || 0} skills)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
