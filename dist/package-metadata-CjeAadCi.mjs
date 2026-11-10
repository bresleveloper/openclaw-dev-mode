import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
//#region src/agents/package-metadata.ts
/** Package metadata and assets without runtime configuration dependencies. */
const currentDir = dirname(fileURLToPath(import.meta.url));
/** Bun compiled binaries use virtual filesystem URLs. */
const isBunBinary = import.meta.url.includes("$bunfs") || import.meta.url.includes("~BUN") || import.meta.url.includes("%7EBUN");
function getPackageDir() {
	const envDir = process.env.OPENCLAW_PACKAGE_DIR;
	if (envDir) {
		if (envDir === "~") return homedir();
		if (envDir.startsWith("~/")) return homedir() + envDir.slice(1);
		return envDir;
	}
	if (isBunBinary) return dirname(process.execPath);
	let dir = currentDir;
	while (dir !== dirname(dir)) {
		if (existsSync(join(dir, "package.json"))) return dir;
		dir = dirname(dir);
	}
	return currentDir;
}
function getReadmePath() {
	return resolve(join(getPackageDir(), "README.md"));
}
function getDocsPath() {
	return resolve(join(getPackageDir(), "docs"));
}
const pkg = (typeof WORKER_DEPLOY_VERSION === "string" ? WORKER_DEPLOY_VERSION : void 0) ? {} : JSON.parse(readFileSync(join(getPackageDir(), "package.json"), "utf-8"));
const APP_NAME = pkg.openclawConfig?.name || "openclaw";
const CONFIG_DIR_NAME = pkg.openclawConfig?.configDir || ".openclaw";
//#endregion
export { getReadmePath as i, CONFIG_DIR_NAME as n, getDocsPath as r, APP_NAME as t };
