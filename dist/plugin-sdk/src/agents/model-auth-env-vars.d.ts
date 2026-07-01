import type { ProviderAuthEvidence, ProviderAuthLookupMaps, ProviderEnvVarLookupParams } from "../secrets/provider-env-vars.js";
/** Resolves both env-var candidates and richer auth evidence from one manifest snapshot. */
export declare function resolveProviderEnvAuthLookupMaps(params?: ProviderEnvVarLookupParams): ProviderAuthLookupMaps;
/** Lists every provider key represented by either env candidates or auth evidence. */
export declare function listProviderEnvAuthLookupKeys(params: {
    envCandidateMap: Readonly<Record<string, readonly string[]>>;
    authEvidenceMap: Readonly<Record<string, readonly ProviderAuthEvidence[]>>;
}): string[];
/** Lists known provider API-key env var names for redaction and marker matching. */
export declare function listKnownProviderEnvApiKeyNames(): string[];
