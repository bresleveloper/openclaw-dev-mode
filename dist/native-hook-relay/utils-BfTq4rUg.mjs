import { S as resolveGlobalSingleton, h as resolveTimerTimeoutMs } from "./number-coercion-CmpLVzZ6.mjs";
import { n as createAbortError, o as sleepWithAbort } from "./src-DTVzOLXp.mjs";
import "node:fs";
import path from "node:path";
import os from "node:os";
import "@openclaw/fs-safe/advanced";
import { AsyncLocalStorage } from "node:async_hooks";
import { isNotFoundPathError, isPathInside as isPathInside$1, normalizeWindowsPathForComparison as normalizeWindowsPathForComparison$1 } from "@openclaw/fs-safe/path";
//#region src/infra/abort-signal.ts
function isAbortError(error) {
	if (!error || typeof error !== "object") return false;
	try {
		if (("name" in error ? String(error.name) : "") === "AbortError") return true;
		return ("message" in error && typeof error.message === "string" ? error.message : "") === "This operation was aborted";
	} catch {
		return false;
	}
}
//#endregion
//#region src/utils/sleep.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
function sleep(ms, signal) {
	const delayMs = resolveTimerTimeoutMs(ms, 0, 0);
	if (signal) {
		if (signal.aborted) return Promise.reject(createAbortError("aborted", { cause: signal.reason ?? /* @__PURE__ */ new Error("aborted") }));
		return sleepWithAbort(delayMs, signal);
	}
	return new Promise((resolve) => {
		setTimeout(resolve, delayMs);
	});
}
//#endregion
//#region packages/normalization-core/src/home-dir.ts
function normalizeHomeDirValue(value) {
	const trimmed = value?.trim();
	return trimmed && trimmed !== "undefined" && trimmed !== "null" ? trimmed : void 0;
}
function normalizeSafe(homedir) {
	try {
		return normalizeHomeDirValue(homedir());
	} catch {
		return;
	}
}
function resolveTermuxHome(env) {
	const prefix = normalizeHomeDirValue(env.PREFIX);
	if (!prefix || !normalizeHomeDirValue(env.ANDROID_DATA)) return;
	if (!/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(prefix.replace(/\\/gu, "/"))) return;
	return path.resolve(prefix, "..", "home");
}
function resolveRawOsHomeDir(env, homedir) {
	return normalizeHomeDirValue(env.HOME) ?? normalizeHomeDirValue(env.USERPROFILE) ?? resolveTermuxHome(env) ?? normalizeSafe(homedir);
}
function resolveOsHomeDir(env = process.env, homedir = os.homedir) {
	const raw = resolveRawOsHomeDir(env, homedir);
	return raw ? path.resolve(raw) : void 0;
}
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir, options) {
	const explicitHome = normalizeHomeDirValue(env.OPENCLAW_HOME);
	if (!explicitHome) return resolveOsHomeDir(env, homedir);
	if (explicitHome === "~" || explicitHome.startsWith("~/") || explicitHome.startsWith("~\\")) {
		const osHome = resolveRawOsHomeDir(env, homedir);
		if (!osHome) return options?.preserveUnresolvedTilde ? path.resolve(explicitHome) : void 0;
		return path.resolve(explicitHome.replace(/^~(?=$|[\\/])/, () => osHome));
	}
	return path.resolve(explicitHome);
}
//#endregion
//#region src/infra/safe-cwd.ts
function tryProcessCwd() {
	try {
		return process.cwd();
	} catch {
		return;
	}
}
//#endregion
//#region src/infra/home-dir.ts
const userPathBaseDirectory = resolveGlobalSingleton(Symbol.for("openclaw.userPathBaseDirectory"), () => new AsyncLocalStorage());
/** Resolves the effective home or falls back to cwd when no home source exists. */
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
	const resolved = resolveEffectiveHomeDir(env, homedir) ?? tryProcessCwd();
	if (resolved) return path.resolve(resolved);
	throw new Error("Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory.");
}
/** Resolves the OS home or falls back to cwd when no OS home source exists. */
function resolveRequiredOsHomeDir(env = process.env, homedir = os.homedir) {
	const resolved = resolveOsHomeDir(env, homedir) ?? tryProcessCwd();
	if (resolved) return path.resolve(resolved);
	throw new Error("Unable to resolve an OS home: set HOME or USERPROFILE, or run from an existing directory.");
}
/** Expands leading `~`, `~/`, or `~\` with the effective home when one is known. */
function expandHomePrefix(input, opts) {
	if (!input.startsWith("~")) return input;
	const home = normalizeHomeDirValue(opts?.home) ?? resolveEffectiveHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir);
	if (!home) return input;
	return input.replace(/^~(?=$|[\\/])/, () => home);
}
function resolvePathWithHome(input, opts, resolveHome) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	const expanded = trimmed.startsWith("~") ? expandHomePrefix(trimmed, {
		home: resolveHome(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
		env: opts?.env,
		homedir: opts?.homedir
	}) : trimmed;
	const base = userPathBaseDirectory.getStore();
	return base ? path.resolve(base, expanded) : path.resolve(expanded);
}
/** Resolves a user-supplied path after trimming and expanding against the effective home. */
function resolveHomeRelativePath(input, opts) {
	return resolvePathWithHome(input, opts, resolveRequiredHomeDir);
}
/** Resolves a user path against the effective home, preserving an empty input. */
function resolveUserPath(input, env = process.env, homedir = os.homedir) {
	if (!input) return "";
	return resolveHomeRelativePath(input, {
		env,
		homedir
	});
}
//#endregion
//#region src/infra/config-dir.ts
/** Resolves the OpenClaw config directory from state/config env overrides or home. */
function resolveConfigDir(env = process.env, homedir = os.homedir) {
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	const configPath = env.OPENCLAW_CONFIG_PATH?.trim();
	if (configPath) return path.dirname(resolveUserPath(configPath, env, homedir));
	return path.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
}
//#endregion
//#region src/infra/path-guards.ts
/**
* Normalize a Windows path for boundary math whose result is handed back to callers.
*
* Unlike `normalizeWindowsPathForComparison`, this preserves case: `path.win32.relative`
* already matches roots case-insensitively, so lowercasing only corrupts the returned
* relative path — and callers create files from it on a case-preserving filesystem.
* Extended-length prefix stripping stays, or `\\?\`-prefixed inputs read as boundary escapes.
*/
function normalizeWindowsPathPreservingCase(input) {
	const normalized = path.win32.normalize(input);
	if (!normalized.startsWith("\\\\?\\")) return normalized;
	const withoutPrefix = normalized.slice(4);
	return withoutPrefix.toUpperCase().startsWith("UNC\\") ? `\\\\${withoutPrefix.slice(4)}` : withoutPrefix;
}
String.raw`(?<=^|[\s"'\x60(\[{<=:;]|file://)`;
String.raw`[\s"'\x60)\]}>]`;
String.raw`[:;](?=[/\\~$]|[A-Za-z]:)`;
let CONFIG_DIR = resolveConfigDir();
//#endregion
export { normalizeWindowsPathPreservingCase as a, resolveHomeRelativePath as c, resolveUserPath as d, tryProcessCwd as f, normalizeWindowsPathForComparison$1 as i, resolveRequiredHomeDir as l, isAbortError as m, isNotFoundPathError as n, resolveConfigDir as o, sleep as p, isPathInside$1 as r, expandHomePrefix as s, CONFIG_DIR as t, resolveRequiredOsHomeDir as u };
