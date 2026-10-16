import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import "./fs-safe-BUXBSN-4.mjs";
import "./safe-regex-CLaK5Jxv.mjs";
import "./redact-DJ8j6ADa.mjs";
import "./path-guards-CH7noY0Z.mjs";
import "./errors-O33D01XW.mjs";
import "./proxy-env-DlRjxK5F.mjs";
import "./ssrf-v45DW-yR.mjs";
import { r as isDevMode } from "./globals-BXbZ1A_g.mjs";
import "./private-file-store-DM0i141q.mjs";
import { a as wrapExternalContent } from "./external-content-Bkm4w5qo.mjs";
import "./file-access-runtime-BMp89X4Y.mjs";
import "./ports-D1Nyn7_l.mjs";
import "./dm-policy-shared-W0ZJUdtW.mjs";
import { pathScope as pathScope$1, resolveExistingPathsWithinRoot, resolveStrictExistingPathsWithinRoot, sanitizeUntrustedFileName as sanitizeUntrustedFileName$1 } from "@openclaw/fs-safe/advanced";
import { movePathWithCopyFallback as movePathWithCopyFallback$1, replaceFileAtomic } from "@openclaw/fs-safe/atomic";
//#region src/security/channel-metadata.ts
const DEFAULT_MAX_CHARS = 800;
const DEFAULT_MAX_ENTRY_CHARS = 400;
function normalizeEntry(entry) {
	return entry.replace(/\s+/g, " ").trim();
}
function truncateText(value, maxChars) {
	if (maxChars <= 0) return "";
	return truncateWithMarker(value, maxChars, {
		marker: "...",
		reserve: 3,
		trimEnd: true
	});
}
/**
* Build bounded, externally wrapped channel metadata for prompt context.
* Channel-provided labels can be user-controlled, so keep the result externally wrapped.
*/
function buildChannelMetadata(params) {
	const cleaned = params.entries.map((entry) => typeof entry === "string" ? normalizeEntry(entry) : "").filter((entry) => Boolean(entry)).map((entry) => truncateText(entry, DEFAULT_MAX_ENTRY_CHARS));
	const deduped = uniqueStrings(cleaned);
	if (deduped.length === 0) return;
	const body = deduped.join("\n");
	if (isDevMode()) return `${params.label}:\n${body}`;
	const truncated = truncateText(`${`Channel metadata (${params.source})`}\n${`${params.label}:\n${body}`}`, params.maxChars ?? DEFAULT_MAX_CHARS);
	return wrapExternalContent(truncated, {
		source: "channel_metadata",
		includeWarning: false
	});
}
/** @deprecated Use buildChannelMetadata. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
const buildUntrustedChannelMetadata = buildChannelMetadata;
//#endregion
//#region src/plugin-sdk/security-runtime.ts
/** Public security runtime helpers for plugin-side trust boundaries. */
const replaceFileAtomic$1 = replaceFileAtomic;
//#endregion
export { resolveStrictExistingPathsWithinRoot as a, buildUntrustedChannelMetadata as c, resolveExistingPathsWithinRoot as i, pathScope$1 as n, sanitizeUntrustedFileName$1 as o, replaceFileAtomic$1 as r, buildChannelMetadata as s, movePathWithCopyFallback$1 as t };
