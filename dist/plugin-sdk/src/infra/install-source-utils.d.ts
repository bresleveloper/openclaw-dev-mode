import { type NpmProjectInstallEnvOptions } from "./npm-install-env.js";
/** Metadata npm reports when resolving a registry spec or packed archive. */
export type NpmSpecResolution = {
    name?: string;
    version?: string;
    resolvedSpec?: string;
    integrity?: string;
    shasum?: string;
    resolvedAt?: string;
    packageOpenClaw?: Record<string, unknown>;
};
/** Flattened npm resolution fields stored on install results and diagnostics. */
export type NpmResolutionFields = {
    resolvedName?: string;
    resolvedVersion?: string;
    resolvedSpec?: string;
    integrity?: string;
    shasum?: string;
    resolvedAt?: string;
};
/** Converts npm resolution metadata into stable result field names. */
export declare function buildNpmResolutionFields(resolution?: NpmSpecResolution): NpmResolutionFields;
/** Creates a script-free npm environment for metadata and pack commands. */
export declare function createNpmMetadataEnv(scope?: Pick<NpmProjectInstallEnvOptions, "npmConfigCwd">): NodeJS.ProcessEnv;
/** Reads npm registry metadata for a package spec without running package scripts. */
export declare function resolveNpmSpecMetadata(params: {
    spec: string;
    timeoutMs?: number;
}): Promise<{
    ok: true;
    metadata: NpmSpecResolution;
} | {
    ok: false;
    error: string;
}>;
/** Captures expected and actual npm integrity values when an install source drifts. */
export type NpmIntegrityDrift = {
    expectedIntegrity: string;
    actualIntegrity: string;
};
/** Runs a callback in a private temp directory and removes it afterward. */
export declare function withTempDir<T>(prefix: string, fn: (tmpDir: string) => Promise<T>): Promise<T>;
/** Resolves and validates a user-supplied archive path before extraction. */
export declare function resolveArchiveSourcePath(archivePath: string): Promise<{
    ok: true;
    path: string;
} | {
    ok: false;
    error: string;
}>;
/** Packs an npm spec into a tarball in `cwd` and returns archive metadata. */
export declare function packNpmSpecToArchive(params: {
    spec: string;
    timeoutMs: number;
    cwd: string;
}): Promise<{
    ok: true;
    archivePath: string;
    metadata: NpmSpecResolution;
} | {
    ok: false;
    error: string;
}>;
/**
 * Reads package metadata from an existing npm archive using `npm pack --dry-run`.
 * The archive path is validated first so callers get path errors before npm errors.
 */
export declare function resolveNpmPackArchiveMetadata(params: {
    archivePath: string;
    timeoutMs?: number;
}): Promise<{
    ok: true;
    archivePath: string;
    tarballName: string;
    metadata: NpmSpecResolution;
} | {
    ok: false;
    error: string;
}>;
