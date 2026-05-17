export function titleCase(name: string) {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bLb\b/g, "LB")
    .replace(/\bSsa\b/g, "SSA");
}

export function deployedDisplayName(project: {
  name: string;
  isFounder?: boolean;
}) {
  if (project.isFounder) return "printsLB";
  return titleCase(project.name);
}

export function clampText(text: string, max = 160) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}
