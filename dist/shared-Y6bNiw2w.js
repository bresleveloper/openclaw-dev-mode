import path from "node:path";
export function resolveNodeRunner() {
  const base = path.basename(process.execPath).trim().toLowerCase();
  return base === "node" || base === "node.exe" ? process.execPath : "node";
}
