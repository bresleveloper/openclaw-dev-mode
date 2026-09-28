import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import "./fs-safe-defaults-D3xd3zKO.mjs";
import "./fs-safe-advanced-CJC-NYf3.mjs";
import "./fs-safe-BAPek8At.mjs";
import "./path-guards-D5kuI0Tv.mjs";
import "./redact-B5EGyLvV.mjs";
import "./errors-DnjwnOju.mjs";
import "./replace-file-DJtj9VLX.mjs";
import { r as isDevMode } from "./globals-QODkv80i.mjs";
import "./proxy-env-BwCPCI9p.mjs";
import "./ports-CDR43XuJ.mjs";
import "./ssrf-BQRtcdBp.mjs";
import "./private-file-store-DcTFLQxK.mjs";
import { a as wrapExternalContent } from "./external-content-CLufk6dK.mjs";
import "./dm-policy-shared-NwS6IC07.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import { pathScope, resolveExistingPathsWithinRoot, resolveStrictExistingPathsWithinRoot } from "@openclaw/fs-safe/advanced";
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
export { buildUntrustedChannelMetadata as a, buildChannelMetadata as i, resolveExistingPathsWithinRoot as n, resolveStrictExistingPathsWithinRoot as r, pathScope as t };
