import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ageFromDob(dob) {
  const [y, m, d] = dob.split("-").map(Number);
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d))
    age--;
  return age;
}

function main() {
  const cv = JSON.parse(
    fs.readFileSync(path.join(root, "content", "cv.json"), "utf8")
  );
  const profile = JSON.parse(
    fs.readFileSync(path.join(root, "content", "profile.json"), "utf8")
  );
  const css = fs.readFileSync(
    path.join(root, "src", "app", "cv", "cv-document.css"),
    "utf8"
  );

  const fileName = cv.documentFileName || "Ali_Hamieh_CV_2026.html";
  const age = ageFromDob(cv.birthDate || "2009-12-05");
  const title = profile.title || cv.title;
  const tagline = profile.headline || cv.tagline || "";

  const skillHtml = (cv.skillGroups || [])
    .map(
      (g) =>
        `<motion.div class="cv-skill-group"><h3>${esc(g.label)}</h3><motion.div class="cv-chips">${g.items.map((i) => `<span>${esc(i)}</span>`).join("")}</motion.div></motion.div>`
    )
    .join("");

  const certs = (cv.certifications || []).map((c) => `<li>${esc(c)}</li>`).join("");
  const highlights = (cv.highlights || []).map((h) => `<li>${esc(h)}</li>`).join("");

  const experience = (cv.experience || [])
    .map(
      (e) =>
        `<motion.div class="cv-entry"><motion.div class="cv-entry-head"><strong>${esc(e.title)}</strong>${e.period ? `<em>${esc(e.period)}</em>` : ""}</motion.div><p>${esc(e.summary)}</p></motion.div>`
    )
    .join("");

  const projects = (cv.selectedProjects || [])
    .map(
      (p) =>
        `<motion.div class="cv-project-row"><span><strong>${esc(p.name)}</strong> <span style="color:#4a6b78;font-weight:400">— ${esc(p.role)}</span></span>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noreferrer">View ↗</a>` : ""}</motion.div>`
    )
    .join("");

  const education = (cv.education || [])
    .map(
      (e) =>
        `<motion.div class="cv-entry"><motion.div class="cv-entry-head"><strong>${esc(e.school)}</strong></motion.div>${e.detail ? `<p>${esc(e.detail)}</p>` : ""}</motion.div>`
    )
    .join("");

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(cv.name)} — CV ${cv.lastUpdated || "2026"}</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>body{font-family:'Outfit',system-ui,sans-serif;margin:0}${css}</style>
</head>
<body>
<div class="cv-page">
<div class="cv-toolbar"><a href="/">Portfolio</a>
<button type="button" class="cv-print" onclick="window.print()">Print / Save as PDF</button></div>
<article class="cv-sheet">
<header class="cv-header">
<div><h1>${esc(cv.name)}</h1>${tagline ? `<p class="cv-tagline">${esc(tagline)}</p>` : ""}
<p class="cv-title-line">${esc(title)} · ${age} years old · ${esc(cv.location)}</p></motion.div>
<address class="cv-contact">
<a href="mailto:${esc(cv.email)}">${esc(cv.email)}</a><br>
<a href="tel:${esc(cv.phone).replace(/\s/g, "")}">${esc(cv.phone)}</a><br>
<a href="${esc(profile.linkedin || cv.linkedin)}">LinkedIn</a> · <a href="${esc(profile.github || cv.github)}">GitHub</a><br>
<a href="${esc(profile.linktree || "")}">Linktree</a>
</address></header>
<div class="cv-body"><aside class="cv-sidebar">${skillHtml}
${certs ? `<section class="cv-section"><h2>Certifications</h2><ul class="cv-cert-list">${certs}</ul></section>` : ""}
</aside><main class="cv-main">
<section class="cv-section"><h2>Profile</h2><p class="cv-summary">${esc(cv.summary)}</p></section>
${highlights ? `<section class="cv-section"><h2>Highlights</h2><ul class="cv-highlight-list">${highlights}</ul></section>` : ""}
<section class="cv-section"><h2>Experience</h2>${experience}</section>
${projects ? `<section class="cv-section"><h2>Selected projects</h2>${projects}</section>` : ""}
<section class="cv-section"><h2>Education</h2>${education}</section>
</main></motion.div>
<p class="cv-footer-note">CV updated ${esc(cv.lastUpdated || "2026")} · ${esc(fileName)}</p>
</article></motion.div></body></html>`;

  html = html.replace(/<\/?motion\.div>/gi, (tag) =>
    tag.toLowerCase().includes("</") ? "</div>" : "<div>"
  );

  const out = path.join(root, "public", fileName);
  fs.writeFileSync(out, html, "utf8");
  console.log(`Wrote public/${fileName}`);
}

main();
