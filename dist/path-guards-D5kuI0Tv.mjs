import "./fs-safe-defaults-D3xd3zKO.mjs";
import path from "node:path";
import { hasNodeErrorCode, isNotFoundPathError, isPathInside, normalizeWindowsPathForComparison as normalizeWindowsPathForComparison$1, safeStatSync } from "@openclaw/fs-safe/path";
//#region src/infra/path-guards.ts
/** Returns true only when target is a descendant of root, not root itself. */
function isPathStrictlyInside(root, target) {
	return isPathInside(root, target) && !isPathInside(target, root);
}
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
//#endregion
export { normalizeWindowsPathForComparison$1 as a, isPathStrictlyInside as i, isNotFoundPathError as n, normalizeWindowsPathPreservingCase as o, isPathInside as r, safeStatSync as s, hasNodeErrorCode as t };
