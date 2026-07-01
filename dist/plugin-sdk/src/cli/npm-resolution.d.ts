import { type NpmSpecResolution as NpmResolutionMetadata } from "../infra/install-source-utils.js";
/** Choose the install-record spec for an npm package, optionally pinning to the resolved version. */
export declare function resolvePinnedNpmSpec(params: {
    rawSpec: string;
    pin: boolean;
    resolvedSpec?: string;
}): {
    recordSpec: string;
    pinWarning?: string;
    pinNotice?: string;
};
/** Build the npm section of a plugin install record. */
export declare function buildNpmInstallRecordFields(params: {
    spec: string;
    installPath: string;
    version?: string;
    resolution?: NpmResolutionMetadata;
}): {
    source: "npm";
    spec: string;
    installPath: string;
    version?: string;
    resolvedName?: string;
    resolvedVersion?: string;
    resolvedSpec?: string;
    integrity?: string;
    shasum?: string;
    resolvedAt?: string;
};
/** Resolve and log npm pinning decisions before constructing the persisted install record. */
export declare function resolvePinnedNpmInstallRecord(params: {
    rawSpec: string;
    pin: boolean;
    installPath: string;
    version?: string;
    resolution?: NpmResolutionMetadata;
    log: (message: string) => void;
    warn: (message: string) => void;
}): ReturnType<typeof buildNpmInstallRecordFields>;
/** CLI adapter for npm install-record pinning with styled warning output. */
export declare function resolvePinnedNpmInstallRecordForCli(rawSpec: string, pin: boolean, installPath: string, version: string | undefined, resolution: NpmResolutionMetadata | undefined, log: (message: string) => void, warnFormat: (message: string) => string): ReturnType<typeof buildNpmInstallRecordFields>;
/** Emit any user-facing notice or warning from npm pin resolution. */
export declare function logPinnedNpmSpecMessages(pinInfo: {
    pinWarning?: string;
    pinNotice?: string;
}, log: (message: string) => void, logWarn: (message: string) => void): void;
