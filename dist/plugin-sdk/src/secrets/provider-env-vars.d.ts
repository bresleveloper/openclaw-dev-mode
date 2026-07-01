import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type PluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.js";
export type ProviderEnvVarLookupParams = {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    includeUntrustedWorkspacePlugins?: boolean;
    metadataSnapshot?: PluginMetadataSnapshot;
};
/** Manifest-provided evidence that a provider auth credential exists outside config. */
export type ProviderAuthEvidence = {
    type: "local-file-with-env";
    fileEnvVar?: string;
    fallbackPaths?: readonly string[];
    requiresAnyEnv?: readonly string[];
    requiresAllEnv?: readonly string[];
    credentialMarker: string;
    source?: string;
};
/** Provider auth lookup maps resolved from plugin metadata and core fallback rules. */
export type ProviderAuthLookupMaps = {
    aliasMap: Readonly<Record<string, string>>;
    envCandidateMap: Readonly<Record<string, readonly string[]>>;
    authEvidenceMap: Readonly<Record<string, readonly ProviderAuthEvidence[]>>;
    setupProviderFallbackRefs: readonly string[];
};
/** Resolves provider env-var candidates used by generic auth lookup. */
/** Resolves provider auth env-var candidates from core fallbacks and plugin metadata. */
export declare function resolveProviderAuthEnvVarCandidates(params?: ProviderEnvVarLookupParams): Record<string, readonly string[]>;
/** Resolves non-env evidence that provider auth may already be configured. */
export declare function resolveProviderAuthEvidence(params?: ProviderEnvVarLookupParams): Record<string, readonly ProviderAuthEvidence[]>;
/** Resolves all provider auth lookup maps from a single metadata snapshot. */
export declare function resolveProviderAuthLookupMaps(params?: ProviderEnvVarLookupParams): ProviderAuthLookupMaps;
/** Resolves env vars used by setup, default SecretRefs, and broad secret scrubbing. */
export declare function resolveProviderEnvVars(params?: ProviderEnvVarLookupParams): Record<string, readonly string[]>;
/**
 * Provider auth env candidates used by generic auth resolution.
 *
 * Order matters: the first non-empty value wins for helpers such as
 * `resolveEnvApiKey()`. Bundled providers source this from plugin manifest
 * metadata so auth probes do not need to load plugin runtime.
 */
export declare const PROVIDER_AUTH_ENV_VAR_CANDIDATES: Record<string, readonly string[]>;
/**
 * Provider env vars used for setup/default secret refs and broad secret
 * scrubbing. This can include non-model providers and may intentionally choose
 * a different preferred first env var than auth resolution.
 *
 * Bundled provider auth envs come from plugin manifests. The override map here
 * is only for true core/non-plugin providers and a few setup-specific ordering
 * overrides where generic onboarding wants a different preferred env var.
 */
export declare const PROVIDER_ENV_VARS: Record<string, readonly string[]>;
export declare const testing: {
    resetProviderEnvVarCachesForTests(): void;
};
/** Returns known env var candidates for a provider id or alias. */
export declare function getProviderEnvVars(providerId: string, params?: ProviderEnvVarLookupParams): string[];
/** Lists known provider auth env vars without bridge-only env vars. */
export declare function listKnownProviderAuthEnvVarNames(params?: ProviderEnvVarLookupParams): string[];
/** Lists env vars that may contain provider secrets for broad scrubbing. */
export declare function listKnownSecretEnvVarNames(params?: ProviderEnvVarLookupParams): string[];
/** Returns a copy of an env object with denied keys removed case-insensitively. */
export declare function omitEnvKeysCaseInsensitive(baseEnv: NodeJS.ProcessEnv, keys: Iterable<string>): NodeJS.ProcessEnv;
export { testing as __testing };
