import fs from "fs";
const p = "src/components/CharacterAvatar.tsx";
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);
const i = lines.findIndex((l) => l.includes("character-loading"));
if (i >= 0) {
  lines[i] = '          <div className="character-loading">Loading portrait…</motion.div>'.replace(
    "</motion.div>",
    "</" + "div" + ">"
  );
}
fs.writeFileSync(p, lines.join("\n"));
