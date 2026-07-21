import "./redact-B9QQ4Wyz.js";
import "./errors-sMD712F3.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./fs-safe-defaults-B7hUN42l.js";
import "./fs-safe-RNq3oO57.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import "./replace-file-CaPU6XwS.js";
import "./path-guards-CBe_wA_B.js";
import "./private-file-store-BSksaLX_.js";
import "./shared-BV5NPfdY.js";
import "./runtime-shared-D99zx8IE.js";
import "./fs-safe-advanced-CBe_wA_B.js";
import { r as isDevMode } from "./globals-BElpud1m.js";
import "./ssrf-BayeDjCv.js";
import "./ports-BOOl3rze.js";
import "./sibling-temp-file-CBe_wA_B.js";
import "./channel-secret-collector-runtime-C3Cd4uxZ.js";
import { a as wrapExternalContent } from "./external-content-CycSUXwl.js";
import "./channel-access-compat-Bkekv_zh.js";
//#region src/security/channel-metadata.ts
const DEFAULT_MAX_CHARS = 800;
const DEFAULT_MAX_ENTRY_CHARS = 400;
function normalizeEntry(entry) {
	return entry.replace(/\s+/g, " ").trim();
}
function truncateText(value, maxChars) {
	if (maxChars <= 0) return "";
	if (value.length <= maxChars) return value;
	return `${value.slice(0, Math.max(0, maxChars - 3)).trimEnd()}...`;
}
/**
* Build bounded, externally wrapped channel metadata for prompt context.
* Channel-provided labels can be user-controlled, so callers must treat this as untrusted content.
*/
function buildUntrustedChannelMetadata(params) {
	const deduped = uniqueStrings(params.entries.map((entry) => typeof entry === "string" ? normalizeEntry(entry) : "").filter((entry) => Boolean(entry)).map((entry) => truncateText(entry, DEFAULT_MAX_ENTRY_CHARS)));
	if (deduped.length === 0) return;
	const body = deduped.join("\n");
	if (isDevMode()) return `${params.label}:\n${body}`;
	return wrapExternalContent(truncateText(`${`UNTRUSTED channel metadata (${params.source})`}\n${`${params.label}:\n${body}`}`, params.maxChars ?? DEFAULT_MAX_CHARS), {
		source: "channel_metadata",
		includeWarning: false
	});
}
//#endregion
//#region src/plugin-sdk/security-runtime.ts
/**
* @deprecated Broad public SDK barrel. Prefer focused security/SSRF/secret
* subpaths and avoid adding new imports here.
*/
/** Safely open a path beneath a trusted root while rejecting hardlinks and unsafe symlinks by default. */
async function openFileWithinRoot(params) {
	return await (await root(params.rootDir)).open(params.relativePath, {
		hardlinks: params.rejectHardlinks === false ? "allow" : "reject",
		nonBlockingRead: params.nonBlockingRead,
		symlinks: params.allowSymlinkTargetWithinRoot === true ? "follow-within-root" : "reject"
	});
}
/** Copy a source file into a path beneath a trusted root using fs-safe root policy. */
async function writeFileFromPathWithinRoot(params) {
	await (await root(params.rootDir)).copyIn(params.relativePath, params.sourcePath, {
		mkdir: params.mkdir,
		sourceHardlinks: "reject"
	});
}
//#endregion
export { writeFileFromPathWithinRoot as n, buildUntrustedChannelMetadata as r, openFileWithinRoot as t };
