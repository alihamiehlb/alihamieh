import fs from "fs";
const p = "src/components/AchievementsSection.tsx";
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);
lines[67] = "              </div>";
lines[81] = "              </div>";
fs.writeFileSync(p, lines.join("\n"));
