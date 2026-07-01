/** Validation message for plugin minHostVersion manifest fields. */
export declare const MIN_HOST_VERSION_FORMAT = "openclaw.install.minHostVersion must use a semver floor in the form \">=x.y.z[-prerelease][+build]\"";
/** Parsed plugin minimum host version requirement. */
export type MinHostVersionRequirement = {
    raw: string;
    minimumLabel: string;
};
/** Result of checking a plugin minHostVersion against the current host. */
export type MinHostVersionCheckResult = {
    ok: true;
    requirement: MinHostVersionRequirement | null;
} | {
    ok: false;
    kind: "invalid";
    error: string;
} | {
    ok: false;
    kind: "unknown_host_version";
    requirement: MinHostVersionRequirement;
} | {
    ok: false;
    kind: "incompatible";
    requirement: MinHostVersionRequirement;
    currentVersion: string;
};
/** Parses a plugin minHostVersion manifest field. */
export declare function parseMinHostVersionRequirement(raw: unknown, options?: {
    allowLegacyBareSemver?: boolean;
}): MinHostVersionRequirement | null;
/** Checks whether the current host satisfies a plugin minHostVersion requirement. */
export declare function checkMinHostVersion(params: {
    currentVersion: string | undefined;
    minHostVersion: unknown;
    allowLegacyBareSemver?: boolean;
}): MinHostVersionCheckResult;
