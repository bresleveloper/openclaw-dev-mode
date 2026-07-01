import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { i as isPathInside } from "./path-BlG8lhgR.js";
import "./path-guards-CBe_wA_B.js";
import path from "node:path";
//#region src/shared/avatar-policy.ts
/**
* Shared avatar source policy for config validation, agent identity loading,
* gateway uploads, and Control UI rendering hints.
*/
/** Maximum avatar payload size accepted by local file and gateway upload paths. */
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const LOCAL_AVATAR_EXTENSIONS = new Set([
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".svg"
]);
/** MIME hints for known image extensions, including formats not accepted for local serving. */
const AVATAR_MIME_BY_EXT = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".bmp": "image/bmp",
	".tif": "image/tiff",
	".tiff": "image/tiff"
};
/** Detects data URLs before image-specific avatar validation. */
const AVATAR_DATA_RE = /^data:/i;
/** Detects inline image data URLs that can be used as avatar sources. */
const AVATAR_IMAGE_DATA_RE = /^data:image\//i;
/** Detects remote avatar URLs served over HTTP(S). */
const AVATAR_HTTP_RE = /^https?:\/\//i;
/** Detects URI schemes so non-path avatar values can be rejected or routed. */
const AVATAR_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
/** Detects Windows absolute paths before URI-scheme classification. */
const WINDOWS_ABS_RE = /^[a-zA-Z]:[\\/]/;
const AVATAR_PATH_EXT_RE = /\.(png|jpe?g|gif|webp|svg|ico)$/i;
/** Resolves a local avatar file MIME type from its extension. */
function resolveAvatarMime(filePath) {
	return AVATAR_MIME_BY_EXT[normalizeLowercaseStringOrEmpty(path.extname(filePath))] ?? "application/octet-stream";
}
/** Detects any data URL value before image-specific validation. */
function isAvatarDataUrl(value) {
	return AVATAR_DATA_RE.test(value);
}
/** Detects image data URLs accepted by avatar sources. */
function isAvatarImageDataUrl(value) {
	return AVATAR_IMAGE_DATA_RE.test(value);
}
/** Detects remote HTTP(S) avatar URLs. */
function isAvatarHttpUrl(value) {
	return AVATAR_HTTP_RE.test(value);
}
/** Detects URI-scheme-like avatar values, including non-HTTP schemes. */
function hasAvatarUriScheme(value) {
	return AVATAR_SCHEME_RE.test(value);
}
/** Detects Windows absolute paths so they are not mistaken for URI schemes. */
function isWindowsAbsolutePath(value) {
	return WINDOWS_ABS_RE.test(value);
}
/** Accepts workspace-relative avatar paths while rejecting home paths and URI values. */
function isWorkspaceRelativeAvatarPath(value) {
	if (!value) return false;
	if (value.startsWith("~")) return false;
	if (hasAvatarUriScheme(value) && !isWindowsAbsolutePath(value)) return false;
	return true;
}
/** Checks that a resolved avatar path remains inside its configured root. */
function isPathWithinRoot(rootDir, targetPath) {
	return isPathInside(rootDir, targetPath);
}
/** Heuristically detects strings that look like local avatar file paths. */
function looksLikeAvatarPath(value) {
	if (/[\\/]/.test(value)) return true;
	return AVATAR_PATH_EXT_RE.test(value);
}
/** Restricts local avatar files to image extensions that can be safely served inline. */
function isSupportedLocalAvatarExtension(filePath) {
	const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
	return LOCAL_AVATAR_EXTENSIONS.has(ext);
}
//#endregion
export { isAvatarImageDataUrl as a, isWindowsAbsolutePath as c, resolveAvatarMime as d, isAvatarHttpUrl as i, isWorkspaceRelativeAvatarPath as l, hasAvatarUriScheme as n, isPathWithinRoot as o, isAvatarDataUrl as r, isSupportedLocalAvatarExtension as s, AVATAR_MAX_BYTES as t, looksLikeAvatarPath as u };
