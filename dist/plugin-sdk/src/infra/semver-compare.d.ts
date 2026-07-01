type ComparableSemver = {
    major: number;
    minor: number;
    patch: number;
    prerelease: string[] | null;
};
/**
 * Converts legacy OpenClaw `1.2.3.beta.N` tags into semver-compatible `1.2.3-beta.N`.
 */
export declare function normalizeLegacyDotBetaVersion(version: string): string;
/**
 * Parses an exact semver-like version into fields used by update and plugin version ordering.
 */
export declare function parseComparableSemver(version: string | null | undefined, options?: {
    normalizeLegacyDotBeta?: boolean;
}): ComparableSemver | null;
/**
 * Compares semver prerelease identifiers using numeric-before-string semver precedence rules.
 */
export declare function comparePrereleaseIdentifiers(a: string[] | null, b: string[] | null): number;
/**
 * Compares parsed semver values, returning null when either side could not be parsed.
 */
export declare function compareComparableSemver(a: ComparableSemver | null, b: ComparableSemver | null): number | null;
export {};
