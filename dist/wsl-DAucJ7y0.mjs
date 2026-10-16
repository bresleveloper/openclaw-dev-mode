import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { readFileSync } from "node:fs";
import fs$1 from "node:fs/promises";
//#region src/infra/wsl.ts
let wslCached = null;
/** Detects WSL from environment variables without touching the filesystem. */
function isWSLEnv(env = process.env) {
	return Boolean(env.WSL_INTEROP || env.WSL_DISTRO_NAME || env.WSLENV);
}
/** Detects WSL2 from kernel-version markers, which also establish WSL itself. */
function isWSL2Sync() {
	if (process.platform !== "linux") return false;
	try {
		const version = normalizeLowercaseStringOrEmpty(readFileSync("/proc/version", "utf8"));
		return version.includes("wsl2") || version.includes("microsoft-standard");
	} catch {
		return false;
	}
}
/** Asynchronously detects WSL from env vars and `/proc/sys/kernel/osrelease`, with process cache. */
async function isWSL(environment = {}) {
	const cacheProcessEnvironment = environment.env === void 0 && environment.platform === void 0;
	if (cacheProcessEnvironment && wslCached !== null) return wslCached;
	let detected = false;
	if ((environment.platform ?? process.platform) === "linux") {
		detected = isWSLEnv(environment.env ?? process.env);
		if (!detected) try {
			const release = normalizeLowercaseStringOrEmpty(await fs$1.readFile("/proc/sys/kernel/osrelease", "utf8"));
			detected = release.includes("microsoft") || release.includes("wsl");
		} catch {}
	}
	if (cacheProcessEnvironment) wslCached = detected;
	return detected;
}
//#endregion
export { isWSL2Sync as n, isWSLEnv as r, isWSL as t };
