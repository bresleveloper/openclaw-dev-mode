import { assertCanonicalPathWithinBase, resolveSafeInstallDir, safeDirName, safePathSegmentHashed } from "@openclaw/fs-safe/advanced";
//#region src/infra/install-safe-path.ts
/** Returns the package basename for scoped npm names while preserving plain ids. */
function unscopedPackageName(name) {
	const trimmed = name.trim();
	return trimmed.slice(trimmed.lastIndexOf("/") + 1);
}
/** Matches a requested install id against either the full package name or unscoped basename. */
function packageNameMatchesId(packageName, id) {
	const trimmedId = id.trim();
	if (!trimmedId) return false;
	const trimmedPackageName = packageName.trim();
	if (!trimmedPackageName) return false;
	return trimmedId === trimmedPackageName || trimmedId === unscopedPackageName(trimmedPackageName);
}
//#endregion
export { safePathSegmentHashed as a, safeDirName as i, packageNameMatchesId as n, unscopedPackageName as o, resolveSafeInstallDir as r, assertCanonicalPathWithinBase as t };
