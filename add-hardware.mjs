import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsPath = path.join(__dirname, 'content', 'projects.json');

const hardwareProjects = [
  {
    id: "hamieh-jammer",
    title: "Hamieh Jammer",
    slug: "hamieh-jammer",
    tags: ["hardware", "rf", "security"],
    description: "A custom hardware jammer and RF testing tool, built as a fork of nrfbox.",
    images: ["/projects/hamieh-jammer-fork-of-nrfbox.webp"],
    featured: true,
    manual: true
  },
  {
    id: "dasai-hamieh",
    title: "Dasai Hamieh",
    slug: "dasai-hamieh",
    tags: ["hardware", "3d-printing", "electronics"],
    description: "A hardware companion display with custom 3D printed casing and light-up electronics. Fully modeled in Fusion 360 and assembled by hand.",
    images: ["/projects/dasai-hamieh-fork-of-dasaimochi-withcase.webp", "/projects/dasai-hamieh-without-case-light-up.webp", "/projects/in-fusion-360-dasaihamieh.webp", "/projects/sketching-of-dasai-hamieh.webp", "/projects/v1-dasai-hamieh-case.webp"],
    featured: true,
    manual: true
  },
  {
    id: "hobby-rocket",
    title: "Hobby Rocket",
    slug: "hobby-rocket",
    tags: ["hardware", "3d-printing", "aerospace"],
    description: "A fully custom 3D printed hobby rocket designed from scratch with aerodynamic considerations.",
    images: ["/projects/hobby-3d-printed-rocket-hamiehrocketv1.webp"],
    featured: true,
    manual: true
  },
  {
    id: "electric-boat",
    title: "Electric Boat Project",
    slug: "electric-boat",
    tags: ["hardware", "rc", "engineering"],
    description: "An RC electric boat project featuring custom propulsion and hull design.",
    images: ["/projects/electric-boat-project.webp"],
    featured: true,
    manual: true
  },
  {
    id: "morse-code-trainer",
    title: "Morse Code Trainer",
    slug: "morse-code-trainer",
    tags: ["hardware", "arduino"],
    description: "A physical morse code trainer device developed entirely from scratch.",
    images: ["/projects/mores-code-tranier-allme-developed.webp"],
    featured: true,
    manual: true
  }
];

try {
  const data = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
  const existing = data.projects || [];
  
  // Filter out existing manual projects to prevent duplicates
  const nonManual = existing.filter(p => !p.manual);
  
  data.projects = [...nonManual, ...hardwareProjects];
  fs.writeFileSync(projectsPath, JSON.stringify(data, null, 2), 'utf8');
  console.log("Hardware projects added successfully!");
} catch (e) {
  console.error("Error writing projects:", e);
}
