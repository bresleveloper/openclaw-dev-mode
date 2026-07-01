import type { NpmIntegrityDrift, NpmSpecResolution } from "./install-source-utils.js";
/** Payload passed to npm integrity drift handlers during archive installs. */
export type NpmIntegrityDriftPayload = {
    spec: string;
    expectedIntegrity: string;
    actualIntegrity: string;
    resolution: NpmSpecResolution;
};
type ResolveNpmIntegrityDriftParams<TPayload> = {
    spec: string;
    expectedIntegrity?: string;
    resolution: NpmSpecResolution;
    createPayload: (params: {
        spec: string;
        expectedIntegrity: string;
        actualIntegrity: string;
        resolution: NpmSpecResolution;
    }) => TPayload;
    onIntegrityDrift?: (payload: TPayload) => boolean | Promise<boolean>;
    warn?: (payload: TPayload) => void;
};
type ResolveNpmIntegrityDriftResult<TPayload> = {
    integrityDrift?: NpmIntegrityDrift;
    proceed: boolean;
    payload?: TPayload;
};
/**
 * Compares expected and resolved npm integrity values and asks the caller
 * whether a drifted archive may still be installed.
 */
export declare function resolveNpmIntegrityDrift<TPayload>(params: ResolveNpmIntegrityDriftParams<TPayload>): Promise<ResolveNpmIntegrityDriftResult<TPayload>>;
type ResolveNpmIntegrityDriftWithDefaultMessageParams = {
    spec: string;
    expectedIntegrity?: string;
    resolution: NpmSpecResolution;
    onIntegrityDrift?: (payload: NpmIntegrityDriftPayload) => boolean | Promise<boolean>;
    warn?: (message: string) => void;
};
/**
 * Resolves integrity drift with OpenClaw's default warning and abort messages.
 * Used by npm archive installers that do not need a custom payload shape.
 */
export declare function resolveNpmIntegrityDriftWithDefaultMessage(params: ResolveNpmIntegrityDriftWithDefaultMessageParams): Promise<{
    integrityDrift?: NpmIntegrityDrift;
    error?: string;
}>;
export {};
