import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { readFileSync } from "node:fs";
import fs$1 from "node:fs/promises";
//#region src/infra/wsl.ts
let wslCached = null;
/** Clears the cached async WSL detection result between isolated tests. */
function resetWSLStateForTests() {
	wslCached = null;
}
/** Detects WSL from environment variables without touching the filesystem. */
function isWSLEnv(env = process.env) {
	if (env.WSL_INTEROP || env.WSL_DISTRO_NAME || env.WSLENV) return true;
	return false;
}
/**
* Synchronously detects WSL from env vars first, then `/proc/version`.
*/
function isWSLSync() {
	if (process.platform !== "linux") return false;
	if (isWSLEnv()) return true;
	try {
		const release = normalizeLowercaseStringOrEmpty(readFileSync("/proc/version", "utf8"));
		return release.includes("microsoft") || release.includes("wsl");
	} catch {
		return false;
	}
}
/**
* Synchronously detects WSL2 from kernel-version markers after WSL detection.
*/
function isWSL2Sync() {
	if (!isWSLSync()) return false;
	try {
		const version = normalizeLowercaseStringOrEmpty(readFileSync("/proc/version", "utf8"));
		return version.includes("wsl2") || version.includes("microsoft-standard");
	} catch {
		return false;
	}
}
/** Asynchronously detects WSL from env vars and `/proc/sys/kernel/osrelease`, with process cache. */
async function isWSL() {
	if (wslCached !== null) return wslCached;
	if (process.platform !== "linux") {
		wslCached = false;
		return wslCached;
	}
	if (isWSLEnv()) {
		wslCached = true;
		return wslCached;
	}
	try {
		const release = normalizeLowercaseStringOrEmpty(await fs$1.readFile("/proc/sys/kernel/osrelease", "utf8"));
		wslCached = release.includes("microsoft") || release.includes("wsl");
	} catch {
		wslCached = false;
	}
	return wslCached;
}
//#endregion
export { resetWSLStateForTests as a, isWSLSync as i, isWSL2Sync as n, isWSLEnv as r, isWSL as t };
