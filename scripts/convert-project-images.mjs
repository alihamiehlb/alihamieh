/**
 * Convert all project images (jpeg/png) in public/projects/ to WebP
 * and update content/projects.json with the new webp paths.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsDir = path.join(__dirname, "..", "public", "projects");
const contentFile = path.join(__dirname, "..", "content", "projects.json");

async function getSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    console.error("sharp not installed — run: npm install -D sharp");
    process.exit(1);
  }
}

async function main() {
  const sharp = await getSharp();
  const files = fs.readdirSync(projectsDir);
  const converted = {};

  for (const name of files) {
    const ext = path.extname(name).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const inputPath = path.join(projectsDir, name);
    const baseName = path.basename(name, ext);
    const outputName = `${baseName}.webp`;
    const outputPath = path.join(projectsDir, outputName);

    if (fs.existsSync(outputPath)) {
      console.log(`  ✓ already exists: ${outputName}`);
    } else {
      await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toFile(outputPath);
      const kb = Math.round(fs.statSync(outputPath).size / 1024);
      const origKb = Math.round(fs.statSync(inputPath).size / 1024);
      console.log(`  → ${name} (${origKb} KB) → ${outputName} (${kb} KB)`);
    }

    converted[`/projects/${name}`] = `/projects/${outputName}`;
  }

  // Update projects.json — replace image paths if any images field exists
  const data = JSON.parse(fs.readFileSync(contentFile, "utf8"));
  let changed = false;

  for (const project of data.projects) {
    if (project.images && Array.isArray(project.images)) {
      project.images = project.images.map((img) => {
        const ext = path.extname(img).toLowerCase();
        if ([".jpg", ".jpeg", ".png"].includes(ext)) {
          const webpPath = img.replace(/\.(jpg|jpeg|png)$/i, ".webp");
          const fullWebpPath = path.join(__dirname, "..", "public", webpPath);
          if (fs.existsSync(fullWebpPath)) {
            changed = true;
            return webpPath;
          }
        }
        return img;
      });
    }
    if (project.image) {
      const ext = path.extname(project.image).toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        const webpPath = project.image.replace(/\.(jpg|jpeg|png)$/i, ".webp");
        const fullWebpPath = path.join(__dirname, "..", "public", webpPath);
        if (fs.existsSync(fullWebpPath)) {
          project.image = webpPath;
          changed = true;
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(contentFile, JSON.stringify(data, null, 2));
    console.log("  ✓ Updated content/projects.json with WebP paths");
  } else {
    console.log("  ℹ No image paths needed updating in projects.json");
  }

  console.log(`\nConverted ${Object.keys(converted).length} image(s) to WebP.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
