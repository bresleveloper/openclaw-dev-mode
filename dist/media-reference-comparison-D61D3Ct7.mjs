import { fileURLToPath } from "node:url";
import path from "node:path";
import { hasEncodedFileUrlSeparator } from "@openclaw/fs-safe/advanced";
//#region src/media/media-reference-comparison.ts
const PATH_PARENT_SEGMENT_RE = /(?:^|[\\/])\.\.(?:[\\/]|$)/u;
const FORWARD_NETWORK_PATH_PREFIX_RE = /^\/\//u;
const FILE_URL_PREFIX_RE = /^file:(?:\/\/)?/iu;
const FILE_URL_LOCAL_NETWORK_KEY_PREFIX = "\0file-url-local-network:";
function normalizeAbsoluteLocalPath(value) {
	if (!path.isAbsolute(value) || PATH_PARENT_SEGMENT_RE.test(value) || FORWARD_NETWORK_PATH_PREFIX_RE.test(value)) return value;
	return path.normalize(value);
}
function normalizeFileUrlLocalPath(value) {
	if (!value.startsWith("//")) return normalizeAbsoluteLocalPath(value);
	const normalized = PATH_PARENT_SEGMENT_RE.test(value) ? value : `//${path.normalize(value.slice(2))}`;
	return `${FILE_URL_LOCAL_NETWORK_KEY_PREFIX}${normalized}`;
}
function normalizeMalformedLocalFileUrl(value) {
	const remainder = value.replace(FILE_URL_PREFIX_RE, "");
	let localPath;
	if (remainder.startsWith("/")) localPath = remainder;
	else if (/^localhost(?:\/|$)/iu.test(remainder)) localPath = remainder.slice(9);
	else return;
	if (process.platform === "win32" && /^\/[a-z]:[\\/]/iu.test(localPath)) localPath = localPath.slice(1);
	return normalizeFileUrlLocalPath(localPath);
}
/** Canonicalizes equivalent local media references without resolving the filesystem. */
function normalizeMediaReferenceForComparison(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	if (!FILE_URL_PREFIX_RE.test(trimmed)) return normalizeAbsoluteLocalPath(trimmed);
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol === "file:") {
			if (hasEncodedFileUrlSeparator(parsed.pathname)) return trimmed;
			const windows = process.platform === "win32" && (parsed.hostname !== "" || /^\/[a-z]:[\\/]/iu.test(parsed.pathname));
			return normalizeFileUrlLocalPath(fileURLToPath(parsed, { windows }));
		}
	} catch {}
	return normalizeMalformedLocalFileUrl(trimmed) ?? trimmed;
}
//#endregion
export { normalizeMediaReferenceForComparison as t };
