import { type NpmIntegrityDrift, type NpmSpecResolution } from "./install-source-utils.js";
import { type NpmIntegrityDriftPayload } from "./npm-integrity.js";
type NpmSpecArchiveInstallFlowResult<TResult extends {
    ok: boolean;
}> = {
    ok: false;
    error: string;
} | {
    ok: true;
    installResult: TResult;
    npmResolution: NpmSpecResolution;
    integrityDrift?: NpmIntegrityDrift;
};
/**
 * Adapts installers with additional domain params to the shared npm-pack flow.
 * The archive path stays owned by this module so callers cannot install a stale
 * or caller-supplied tarball while reusing the npm resolution checks.
 */
export declare function installFromNpmSpecArchiveWithInstaller<TResult extends {
    ok: boolean;
}, TArchiveInstallParams extends {
    archivePath: string;
}>(params: {
    tempDirPrefix: string;
    spec: string;
    timeoutMs: number;
    expectedIntegrity?: string;
    onIntegrityDrift?: (payload: NpmIntegrityDriftPayload) => boolean | Promise<boolean>;
    warn?: (message: string) => void;
    installFromArchive: (params: TArchiveInstallParams) => Promise<TResult>;
    archiveInstallParams: Omit<TArchiveInstallParams, "archivePath">;
}): Promise<NpmSpecArchiveInstallFlowResult<TResult>>;
/**
 * Final caller-facing result after a packed npm spec install.
 * Failed pack/validation results and installer failures keep their original
 * shapes; successful installs gain the npm resolution metadata.
 */
export type NpmSpecArchiveFinalInstallResult<TResult extends {
    ok: boolean;
}> = {
    ok: false;
    error: string;
} | Exclude<TResult, {
    ok: true;
}> | (Extract<TResult, {
    ok: true;
}> & {
    npmResolution: NpmSpecResolution;
    integrityDrift?: NpmIntegrityDrift;
});
/**
 * Collapses the shared flow result back into the installer's result union while
 * preserving npm metadata only for a successful install.
 */
export declare function finalizeNpmSpecArchiveInstall<TResult extends {
    ok: boolean;
}>(flowResult: NpmSpecArchiveInstallFlowResult<TResult>): NpmSpecArchiveFinalInstallResult<TResult>;
/**
 * Packs a validated registry npm spec into a temporary tarball, verifies the
 * resolved package metadata, then delegates archive extraction to the caller.
 */
export declare function installFromNpmSpecArchive<TResult extends {
    ok: boolean;
}>(params: {
    tempDirPrefix: string;
    spec: string;
    timeoutMs: number;
    expectedIntegrity?: string;
    onIntegrityDrift?: (payload: NpmIntegrityDriftPayload) => boolean | Promise<boolean>;
    warn?: (message: string) => void;
    installFromArchive: (params: {
        archivePath: string;
    }) => Promise<TResult>;
}): Promise<NpmSpecArchiveInstallFlowResult<TResult>>;
export {};
