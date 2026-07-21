/**
 * Compress large images for faster first paint (run on prebuild).
 * Requires: npm install sharp --save-dev
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const achievementsDir = path.join(publicDir, "achievements");

async function getSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    console.warn("optimize-assets: sharp not installed — skip image compression");
    return null;
  }
}

async function writeWebp(sharp, input, output, width, quality = 82) {
  if (!fs.existsSync(input)) return false;
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toFile(output);
  const kb = Math.round(fs.statSync(output).size / 1024);
  console.log(`  → ${path.basename(output)} (${kb} KB)`);
  return true;
}

async function compressInPlace(sharp, filePath, maxWidth, quality = 82) {
  const ext = path.extname(filePath).toLowerCase();
  const tmp = `${filePath}.opt`;
  let pipeline = sharp(filePath).resize({ width: maxWidth, withoutEnlargement: true });
  if (ext === ".png") {
    pipeline = pipeline.png({ quality: Math.min(quality, 90), compressionLevel: 9 });
  } else {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  }
  await pipeline.toFile(tmp);
  fs.renameSync(tmp, filePath);
  const kb = Math.round(fs.statSync(filePath).size / 1024);
  console.log(`  → ${path.basename(filePath)} (${kb} KB)`);
}

async function main() {
  const sharp = await getSharp();
  if (!sharp) return;

  console.log("Optimizing images…");

  const standing = path.join(publicDir, "me_standing.png");
  await writeWebp(sharp, standing, path.join(publicDir, "portrait-poster.webp"), 480, 80);

  if (fs.existsSync(standing)) {
    await compressInPlace(sharp, standing, 800, 85);
  }

  const crossing = path.join(publicDir, "me_crossing.png");
  if (fs.existsSync(crossing)) {
    await compressInPlace(sharp, crossing, 800, 85);
  }

  if (fs.existsSync(achievementsDir)) {
    for (const name of fs.readdirSync(achievementsDir)) {
      const file = path.join(achievementsDir, name);
      if (!fs.statSync(file).isFile()) continue;
      const ext = path.extname(name).toLowerCase();
      if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
      const before = fs.statSync(file).size;
      if (before < 180_000) continue;
      const maxW = ext === ".png" ? 900 : 1200;
      await compressInPlace(sharp, file, maxW, ext === ".png" ? 88 : 82);
    }
  }

  // Convert project images (jpeg/png) to WebP
  const projectsDir = path.join(publicDir, "projects");
  if (fs.existsSync(projectsDir)) {
    for (const name of fs.readdirSync(projectsDir)) {
      const ext = path.extname(name).toLowerCase();
      if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
      const baseName = path.basename(name, ext);
      const outputName = `${baseName}.webp`;
      const outputPath = path.join(projectsDir, outputName);
      if (fs.existsSync(outputPath)) continue; // already converted
      const inputPath = path.join(projectsDir, name);
      await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toFile(outputPath);
      const kb = Math.round(fs.statSync(outputPath).size / 1024);
      console.log(`  → ${outputName} (${kb} KB)`);
    }
  }

  console.log("Image optimization done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
