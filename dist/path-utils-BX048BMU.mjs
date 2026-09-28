import { r as resolveOsHomeDir } from "./home-dir-D0b-ywue.mjs";
import { t as expandHomePrefix } from "./home-dir-BKwhAL2c.mjs";
import { o as normalizeFileReferencePrefix } from "./sandbox-paths-BZ4BvxS2.mjs";
import { t as preserveAtPrefixedRelativePath } from "./path-policy-BUkUD6xH.mjs";
import { fileURLToPath } from "node:url";
import { basename, isAbsolute, resolve } from "node:path";
//#region src/agents/sessions/tools/path-utils.ts
/**
* Session tool path normalization helpers.
*
* Expands user/file URL inputs and resolves read/write paths against the active cwd with macOS filename variants.
*/
const UNICODE_SPACES = /[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g;
const NARROW_NO_BREAK_SPACE = " ";
function normalizeUnicodeSpaces(str) {
	return str.replace(UNICODE_SPACES, " ");
}
function tryMacOSScreenshotPath(filePath) {
	return filePath.replace(/ (?=(?:AM|PM)(?:\b|\.))/gi, NARROW_NO_BREAK_SPACE);
}
/** Expand OS-home syntax without treating a POSIX backslash as a separator. */
function expandOsHomePrefix(filePath) {
	if (!(filePath === "~" || filePath.startsWith("~/") || process.platform === "win32" && filePath.startsWith("~\\"))) return filePath;
	const home = resolveOsHomeDir();
	return home ? expandHomePrefix(filePath, { home }) : filePath;
}
function expandPath(filePath) {
	const normalized = normalizeFileReferencePrefix(filePath);
	if (normalized.startsWith("file://")) try {
		return fileURLToPath(normalized);
	} catch {
		return normalized;
	}
	return expandOsHomePrefix(normalized);
}
/**
* Resolve a path relative to the given cwd.
* Handles ~ expansion and absolute paths.
*/
function resolveToCwd(filePath, cwd) {
	const expanded = expandPath(filePath);
	return isAbsolute(expanded) ? expanded : resolve(cwd, expanded);
}
/** Resolve local file paths using the filesystem that owns literal @ names. */
function resolveLocalPathToCwd(filePath, cwd) {
	return resolveToCwd(preserveAtPrefixedRelativePath(filePath, cwd), cwd);
}
function collectReadPathVariants(filePath, includeNfd) {
	const variants = /* @__PURE__ */ new Set();
	const fileName = basename(filePath);
	const parentPrefix = filePath.slice(0, filePath.length - fileName.length);
	const asciiSpace = normalizeUnicodeSpaces(fileName);
	for (const spaced of [asciiSpace, tryMacOSScreenshotPath(asciiSpace)]) {
		const straightQuotes = spaced.replace(/[\u2018\u2019]/g, "'");
		const curlyQuotes = spaced.replace(/['\u2018]/g, "’");
		for (const quoted of [straightQuotes, curlyQuotes]) {
			variants.add(`${parentPrefix}${quoted.normalize("NFC")}`);
			if (includeNfd) variants.add(`${parentPrefix}${quoted.normalize("NFD")}`);
		}
	}
	variants.delete(filePath);
	return [...variants];
}
/** Equivalent filename spellings worth probing after an exact read path misses. */
function getReadPathVariants(filePath) {
	return collectReadPathVariants(filePath, process.platform !== "darwin");
}
/** Every spelling an exact read or its fallback probes can accept. */
function getReadQueuePaths(filePath) {
	return [filePath, ...collectReadPathVariants(filePath, true)];
}
//#endregion
export { resolveToCwd as a, resolveLocalPathToCwd as i, getReadPathVariants as n, getReadQueuePaths as r, expandOsHomePrefix as t };
