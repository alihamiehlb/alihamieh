const fs = require('fs');
let c = fs.readFileSync('src/components/ScrollSections.tsx', 'utf8');
const lines = c.split('\n');

// Find the projects section
const projStart = lines.findIndex(l => l.includes('SectionPanel id="projects"'));
// Find its closing tag
let depth = 0;
let projEnd = -1;
for (let i = projStart; i < lines.length; i++) {
  if (lines[i].includes('<SectionPanel')) depth++;
  if (lines[i].includes('</SectionPanel>')) {
    depth--;
    if (depth === 0) { projEnd = i; break; }
  }
}

console.log('projStart:', projStart, 'projEnd:', projEnd);
console.log('Project block lines:', projEnd - projStart + 1);

// Extract project block
const projBlock = lines.slice(projStart, projEnd + 1);

// Remove from current position (plus empty line after)
lines.splice(projStart, projEnd - projStart + 2);

// Find the about section
const aboutIdx = lines.findIndex(l => l.includes('SectionPanel id="about"'));
console.log('aboutIdx:', aboutIdx);

// Insert projects before about
lines.splice(aboutIdx, 0, ...projBlock, '');

fs.writeFileSync('src/components/ScrollSections.tsx', lines.join('\n'));
console.log('Done! Projects now before About.');
