import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const interviewsPath = path.join(root, "content", "interviews.json");
const publicInterviewsPath = path.join(root, "public", "interviews");

if (!fs.existsSync(publicInterviewsPath)) {
  fs.mkdirSync(publicInterviewsPath, { recursive: true });
}

async function fetchOgImage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const text = await response.text();
    const match = text.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (match && match[1]) {
      let imgUrl = match[1];
      if (imgUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imgUrl = `${urlObj.origin}${imgUrl}`;
      }
      return imgUrl;
    }
  } catch (error) {
    console.error(`Error fetching og:image for ${url}:`, error.message);
  }
  return null;
}

function getYoutubeId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
}

async function downloadAndProcessImage(url, outputPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toFile(outputPath);
      
    return true;
  } catch (error) {
    console.error(`Error processing image from ${url}:`, error.message);
    return false;
  }
}

// Fallback images for outlets that block scraping like Facebook
const FALLBACKS = {
  "fb": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/1024px-2021_Facebook_icon.svg.png",
};

async function main() {
  const data = JSON.parse(fs.readFileSync(interviewsPath, "utf8"));
  let updatedCount = 0;

  for (const interview of data.interviews) {
    if (interview.image) continue; // Already has an image
    if (!interview.links || interview.links.length === 0) continue;

    console.log(`Processing: ${interview.titleEn || interview.title}`);
    
    // Check first link
    const link = interview.links[0].url;
    let imageUrl = null;
    
    const ytId = getYoutubeId(link);
    if (ytId) {
      imageUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
    } else if (link.includes('facebook.com')) {
      // Facebook blocks programmatic scraping, use a generic FB placeholder or try og:image anyway
      imageUrl = await fetchOgImage(link);
      if (!imageUrl) {
         console.log('Using generic FB placeholder.');
         imageUrl = FALLBACKS.fb;
      }
    } else {
      imageUrl = await fetchOgImage(link);
    }
    
    if (imageUrl) {
      console.log(`Found image URL: ${imageUrl}`);
      const webpName = `${interview.id}.webp`;
      const localPath = path.join(publicInterviewsPath, webpName);
      
      const success = await downloadAndProcessImage(imageUrl, localPath);
      if (success) {
        interview.image = `/interviews/${webpName}`;
        updatedCount++;
        console.log(`Saved as ${interview.image}`);
      } else {
          // Sometimes maxresdefault is not available for all videos, fallback to hqdefault
          if (ytId && imageUrl.includes('maxresdefault')) {
              console.log('Trying hqdefault fallback for youtube...');
              const fallbackYt = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
              const fbSuccess = await downloadAndProcessImage(fallbackYt, localPath);
              if (fbSuccess) {
                  interview.image = `/interviews/${webpName}`;
                  updatedCount++;
                  console.log(`Saved as ${interview.image}`);
              }
          }
      }
    } else {
      console.log(`No image found for ${link}`);
    }
    
    console.log('---');
  }

  if (updatedCount > 0) {
    fs.writeFileSync(interviewsPath, JSON.stringify(data, null, 2), "utf8");
    console.log(`Updated ${updatedCount} interviews with preview images!`);
  } else {
    console.log("No new images to update.");
  }
}

main().catch(console.error);
