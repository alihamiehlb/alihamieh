import fs from "fs";
import path from "path";

const data = JSON.parse(fs.readFileSync('./content/interviews.json', 'utf8'));
let modified = false;
data.forEach((i, idx) => {
  if (i.image && i.image.startsWith('data:image')) {
    const ext = i.image.substring(i.image.indexOf('/') + 1, i.image.indexOf(';'));
    const base64 = i.image.split(',')[1];
    const filename = `interview-${Date.now()}-${idx}.${ext}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    fs.mkdirSync(path.join(process.cwd(), 'public', 'uploads'), { recursive: true });
    fs.writeFileSync(filepath, Buffer.from(base64, 'base64'));
    i.image = `/uploads/${filename}`;
    modified = true;
  }
});
if (modified) {
  fs.writeFileSync('./content/interviews.json', JSON.stringify(data, null, 2));
  console.log('Fixed base64 images in interviews.json');
} else {
  console.log('No base64 images found');
}
