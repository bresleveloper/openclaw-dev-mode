import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { n as resolveEffectiveHomeDir, t as normalizeHomeDirValue } from "./home-dir-D0b-ywue.mjs";
import { i as resolveRequiredHomeDir, o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { o as normalizeWindowsPathPreservingCase, r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { d as sleepWithAbort, i as createAbortError } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { pathExists as pathExists$1 } from "@openclaw/fs-safe/advanced";
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
//#region src/infra/home-display.ts
/** Replace an absolute home path with its display prefix without clipping sibling paths. */
function shortenPathWithHome(input, { home, prefix }) {
	if (input === home) return prefix;
	if (input.startsWith(`${home}/`) || process.platform === "win32" && input.startsWith(`${home}\\`)) return `${prefix}${input.slice(home.length)}`;
	if (process.platform === "win32" && path.win32.isAbsolute(input) && isPathInside(home, input)) {
		const relative = path.win32.relative(normalizeWindowsPathPreservingCase(home), normalizeWindowsPathPreservingCase(input));
		return path.win32.join(prefix, relative);
	}
	return input;
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
//#region src/utils.ts
/** Creates a directory tree if it does not already exist. */
async function ensureDir(dir) {
	await fs.promises.mkdir(dir, { recursive: true });
}
/** Clamps a number to an inclusive min/max range. */
function clampNumber(value, min, max) {
	return Math.max(min, Math.min(max, value));
}
/** Floors a number before clamping it to an inclusive min/max range. */
function clampInt(value, min, max) {
	return clampNumber(Math.floor(value), min, max);
}
/** Alias for clampNumber (shorter, more common name) */
const clamp = clampNumber;
/**
* Safely parse JSON, returning null on error instead of throwing.
*/
function tryParseJson(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
/** Normalizes phone-like input into the loose E.164 shape used by channel helpers. */
function normalizeE164(number) {
	const digits = number.replace(/^[a-z][a-z0-9-]*:/i, "").trim().replace(/\D/g, "");
	return digits ? `+${digits}` : "";
}
/** Resolves the effective OpenClaw home directory, if one can be determined. */
function resolveHomeDir() {
	return resolveEffectiveHomeDir(process.env, os.homedir);
}
const HOME_TEXT_START = String.raw`(?<=^|[\s"'\x60(\[{<=:;]|file://)`;
const HOME_TEXT_DELIMITER = String.raw`[\s"'\x60)\]}>]`;
const HOME_TEXT_LIST_NEXT = String.raw`[:;](?=[/\\~$]|[A-Za-z]:)`;
function resolveHomeDisplayPrefix() {
	const home = resolveHomeDir();
	if (!home) return;
	if (normalizeHomeDirValue(process.env.OPENCLAW_HOME)) return {
		home,
		prefix: "$OPENCLAW_HOME"
	};
	return {
		home,
		prefix: "~"
	};
}
/** Replaces the leading home directory in a path with `~` or `$OPENCLAW_HOME`. */
function shortenHomePath(input) {
	const display = resolveHomeDisplayPrefix();
	if (!display) return input;
	return shortenPathWithHome(input, display);
}
/** Replaces effective-home path occurrences inside a diagnostic string. */
function shortenHomeInString(input) {
	if (!input) return input;
	const display = resolveHomeDisplayPrefix();
	if (!display || path.parse(display.home).root === display.home) return input;
	const pathSeparator = process.platform === "win32" ? String.raw`[\\/]` : "/";
	const homePattern = new RegExp(`${HOME_TEXT_START}${escapeRegExp(display.home)}(?=$|${pathSeparator}|${HOME_TEXT_DELIMITER}|[.,;:](?:$|${HOME_TEXT_DELIMITER})|${HOME_TEXT_LIST_NEXT})`, process.platform === "win32" ? "giu" : "gu");
	return input.replace(homePattern, display.prefix);
}
/** Shortens a path for display without changing non-home paths. */
function displayPath(input) {
	return shortenHomePath(input);
}
/** Shortens home paths embedded in arbitrary display text. */
function displayString(input) {
	return shortenHomeInString(input);
}
let CONFIG_DIR = resolveConfigDir();
function pinConfigDir(env = process.env) {
	CONFIG_DIR = resolveConfigDir(env);
	return CONFIG_DIR;
}
//#endregion
export { resolveConfigDir as _, displayPath as a, normalizeE164 as c, resolveHomeDir as d, shortenHomeInString as f, shortenPathWithHome as g, sleep as h, clampNumber as i, pathExists$1 as l, tryParseJson as m, clamp as n, displayString as o, shortenHomePath as p, clampInt as r, ensureDir as s, CONFIG_DIR as t, pinConfigDir as u };
