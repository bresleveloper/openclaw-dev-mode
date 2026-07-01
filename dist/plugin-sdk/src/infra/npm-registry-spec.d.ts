/**
 * Parsed registry-only npm spec accepted by plugin install flows.
 * Selectors are limited to exact versions and dist-tags; URL/git/file specs
 * are rejected before they can execute on the gateway host.
 */
export type ParsedRegistryNpmSpec = {
    name: string;
    raw: string;
    selector?: string;
    selectorKind: "none" | "exact-version" | "tag";
    selectorIsPrerelease: boolean;
};
/** Parses a registry-only npm package spec into package name and optional selector metadata. */
export declare function parseRegistryNpmSpec(rawSpec: string): ParsedRegistryNpmSpec | null;
/** Returns whether a user-provided npm spec resolves to the official OpenClaw npm scope. */
export declare function isOpenClawOrgNpmSpec(rawSpec: string | undefined): boolean;
/** Validates a registry-only npm spec and returns a user-facing error when rejected. */
export declare function validateRegistryNpmSpec(rawSpec: string): string | null;
/** Returns whether a value is an exact semver selector, with optional leading `v`. */
export declare function isExactSemverVersion(value: string): boolean;
/** Returns whether a version is an OpenClaw monthly patch stable correction release. */
export declare function isOpenClawStableCorrectionVersion(value: string): boolean;
/** Compares OpenClaw monthly patch release versions across alpha, beta, stable, and corrections. */
export declare function compareOpenClawReleaseVersions(left: string, right: string): number | null;
/** Returns whether an exact semver value is a prerelease, excluding stable correction releases. */
export declare function isPrereleaseSemverVersion(value: string): boolean;
/**
 * Enforces explicit opt-in before an npm spec may resolve to a prerelease.
 * Bare specs and `latest` stay on stable releases unless the resolved version
 * is an OpenClaw stable correction.
 */
export declare function isPrereleaseResolutionAllowed(params: {
    spec: ParsedRegistryNpmSpec;
    resolvedVersion?: string;
}): boolean;
/** Formats the install error shown when a registry spec resolves to a disallowed prerelease. */
export declare function formatPrereleaseResolutionError(params: {
    spec: ParsedRegistryNpmSpec;
    resolvedVersion: string;
}): string;
