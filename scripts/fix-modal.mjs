import fs from "fs";
const p = "src/components/ProjectDetailModal.tsx";
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);
const d = "</div>";
const fixes = {
  82: d,
  83: d,
  116: d,
  127: d,
  147: d,
  149: d,
  152: d,
  162: d,
  172: d,
  180: d,
};
for (const [i, val] of Object.entries(fixes)) {
  const n = Number(i);
  if (lines[n]?.includes("motion.div")) lines[n] = lines[n].replace("</motion.div>", d);
}
fs.writeFileSync(p, lines.join("\n"));
