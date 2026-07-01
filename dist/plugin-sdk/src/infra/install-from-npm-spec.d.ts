import type { NpmIntegrityDriftPayload } from "./npm-integrity.js";
import { type NpmSpecArchiveFinalInstallResult } from "./npm-pack-install.js";
/**
 * Validates a registry npm spec, downloads its archive, and delegates final installation.
 * The caller supplies archive-specific params without `archivePath`; this helper injects
 * the downloaded archive path and normalizes the npm archive flow result.
 */
export declare function installFromValidatedNpmSpecArchive<TResult extends {
    ok: boolean;
}, TArchiveInstallParams extends {
    archivePath: string;
}>(params: {
    spec: string;
    timeoutMs: number;
    tempDirPrefix: string;
    expectedIntegrity?: string;
    onIntegrityDrift?: (payload: NpmIntegrityDriftPayload) => boolean | Promise<boolean>;
    warn?: (message: string) => void;
    installFromArchive: (params: TArchiveInstallParams) => Promise<TResult>;
    archiveInstallParams: Omit<TArchiveInstallParams, "archivePath">;
}): Promise<NpmSpecArchiveFinalInstallResult<TResult>>;
