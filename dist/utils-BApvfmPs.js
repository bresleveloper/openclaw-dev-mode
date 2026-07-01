import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { n as resolveEffectiveHomeDir, o as resolveRequiredHomeDir, r as resolveHomeRelativePath } from "./home-dir-BjcCg_IW.js";
import { w as pathExists$1 } from "./fs-safe-aqmM_n6V.js";
import "./number-coercion-EqFmHmOw.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/infra/plain-object.ts
/**
* Strict plain-object guard (excludes arrays and host objects).
*/
function isPlainObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]";
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
function safeParseJson(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
/**
* Type guard for Record<string, unknown> (less strict than isPlainObject).
* Accepts any non-null object that isn't an array.
*/
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** Normalizes phone-like input into the loose E.164 shape used by channel helpers. */
function normalizeE164(number) {
	const digits = number.replace(/^[a-z][a-z0-9-]*:/i, "").trim().replace(/[^\d+]/g, "");
	if (digits.startsWith("+")) return `+${digits.slice(1)}`;
	return `+${digits}`;
}
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, resolveTimerTimeoutMs(ms, 0, 0));
	});
}
function isHighSurrogate(codeUnit) {
	return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
	return codeUnit >= 56320 && codeUnit <= 57343;
}
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
function sliceUtf16Safe(input, start, end) {
	const len = input.length;
	let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
	let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
	if (to < from) {
		const tmp = from;
		from = to;
		to = tmp;
	}
	if (from > 0 && from < len) {
		if (isLowSurrogate(input.charCodeAt(from)) && isHighSurrogate(input.charCodeAt(from - 1))) from += 1;
	}
	if (to > 0 && to < len) {
		if (isHighSurrogate(input.charCodeAt(to - 1)) && isLowSurrogate(input.charCodeAt(to))) to -= 1;
	}
	return input.slice(from, to);
}
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
function truncateUtf16Safe(input, maxLen) {
	const limit = Math.max(0, Math.floor(maxLen));
	if (input.length <= limit) return input;
	return sliceUtf16Safe(input, 0, limit);
}
/** Resolves `~` and OpenClaw home-relative paths with injectable env/home sources. */
function resolveUserPath(input, env = process.env, homedir = os.homedir) {
	if (!input) return "";
	return resolveHomeRelativePath(input, {
		env,
		homedir
	});
}
/** Resolves the OpenClaw config directory from state/config env overrides or home. */
function resolveConfigDir(env = process.env, homedir = os.homedir) {
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	const configPath = env.OPENCLAW_CONFIG_PATH?.trim();
	if (configPath) return path.dirname(resolveUserPath(configPath, env, homedir));
	const newDir = path.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
	try {
		if (fs.existsSync(newDir)) return newDir;
	} catch {}
	return newDir;
}
/** Resolves the effective OpenClaw home directory, if one can be determined. */
function resolveHomeDir() {
	return resolveEffectiveHomeDir(process.env, os.homedir);
}
function resolveHomeDisplayPrefix() {
	const home = resolveHomeDir();
	if (!home) return;
	if (process.env.OPENCLAW_HOME?.trim()) return {
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
	if (!input) return input;
	const display = resolveHomeDisplayPrefix();
	if (!display) return input;
	const { home, prefix } = display;
	if (input === home) return prefix;
	if (input.startsWith(`${home}/`) || input.startsWith(`${home}\\`)) return `${prefix}${input.slice(home.length)}`;
	return input;
}
/** Replaces all effective-home occurrences inside a diagnostic string. */
function shortenHomeInString(input) {
	if (!input) return input;
	const display = resolveHomeDisplayPrefix();
	if (!display) return input;
	return input.split(display.home).join(display.prefix);
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
/**
* Check if a file or directory exists at the given path.
*/
async function pathExists(targetPath) {
	return await pathExists$1(targetPath);
}
//#endregion
export { shortenHomePath as _, displayPath as a, truncateUtf16Safe as b, isRecord as c, pinConfigDir as d, resolveConfigDir as f, shortenHomeInString as g, safeParseJson as h, clampNumber as i, normalizeE164 as l, resolveUserPath as m, clamp as n, displayString as o, resolveHomeDir as p, clampInt as r, ensureDir as s, CONFIG_DIR as t, pathExists as u, sleep as v, isPlainObject as x, sliceUtf16Safe as y };
