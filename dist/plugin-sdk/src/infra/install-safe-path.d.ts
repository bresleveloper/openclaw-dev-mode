import "./fs-safe-defaults.js";
export { assertCanonicalPathWithinBase, resolveSafeInstallDir, safeDirName, safePathSegmentHashed, } from "@openclaw/fs-safe/advanced";
/** Returns the package basename for scoped npm names while preserving plain ids. */
export declare function unscopedPackageName(name: string): string;
/** Matches a requested install id against either the full package name or unscoped basename. */
export declare function packageNameMatchesId(packageName: string, id: string): boolean;
