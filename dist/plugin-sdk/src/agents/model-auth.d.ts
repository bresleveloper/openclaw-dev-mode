import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { Model } from "../llm/types.js";
import { type AuthProfileCredential, type AuthProfileStore } from "./auth-profiles.js";
import { type EnvApiKeyLookupOptions } from "./model-auth-env.js";
import { type ResolvedProviderAuth } from "./model-auth-runtime-shared.js";
export { ensureAuthProfileStore, ensureAuthProfileStoreWithoutExternalProfiles, resolveAuthProfileOrder, } from "./auth-profiles.js";
export { formatMissingAuthError, isMissingProviderAuthError, isProviderAuthError, MissingProviderAuthError, ProviderAuthError, requireApiKey, resolveAwsSdkEnvVarName, } from "./model-auth-runtime-shared.js";
export type { ResolvedProviderAuth } from "./model-auth-runtime-shared.js";
export type ProviderCredentialPrecedence = "profile-first" | "env-first";
/** Precomputed provider-auth lookup tables reused during one runtime turn. */
export type RuntimeProviderAuthLookup = {
    envApiKey: Pick<EnvApiKeyLookupOptions, "aliasMap" | "candidateMap" | "authEvidenceMap" | "skipSetupProviderFallback">;
    setupProviderFallbackRefs?: readonly string[];
    syntheticAuthProviderRefs?: readonly string[];
    syntheticAuthProviderRefsComplete?: boolean;
};
/** Builds stable env/synthetic auth lookup data for repeated provider checks. */
export declare function createRuntimeProviderAuthLookup(params: {
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    includePluginSyntheticAuth?: boolean;
}): RuntimeProviderAuthLookup;
/** Reads a literal or env-secret marker for a custom provider entry. */
export declare function getCustomProviderApiKey(cfg: OpenClawConfig | undefined, provider: string): string | undefined;
type ResolvedCustomProviderApiKey = {
    apiKey: string;
    source: string;
};
/** Resolves custom provider API keys that are usable without mutating secret stores. */
export declare function resolveUsableCustomProviderApiKey(params: {
    cfg: OpenClawConfig | undefined;
    provider: string;
    env?: NodeJS.ProcessEnv;
}): ResolvedCustomProviderApiKey | null;
/** True when a custom provider has a literal/env/local key available now. */
export declare function hasUsableCustomProviderApiKey(cfg: OpenClawConfig | undefined, provider: string, env?: NodeJS.ProcessEnv): boolean;
/** True when explicit provider config should outrank profile/environment auth. */
export declare function shouldPreferExplicitConfigApiKeyAuth(cfg: OpenClawConfig | undefined, provider: string): boolean;
type ProviderEntryApiKeyProfileReference = {
    kind: "none";
} | {
    kind: "literal";
    apiKey: string;
    source: string;
} | {
    kind: "profile";
    profileId: string;
    credential: AuthProfileCredential;
    mode: ResolvedProviderAuth["mode"];
} | {
    kind: "profile-incompatible";
    profileId: string;
    credentialProvider: string;
    credentialType: AuthProfileCredential["type"];
    reason: "credential-class" | "provider-binding";
} | {
    kind: "marker";
};
export type ProviderEntryApiKeyBindingResolution = {
    kind: "none";
} | {
    kind: "literal";
    apiKey: string;
    source: string;
} | {
    kind: "profile-resolved";
    auth: ResolvedProviderAuth;
} | {
    kind: "profile-incompatible";
    profileId: string;
    credentialProvider: string;
    credentialType: AuthProfileCredential["type"];
    reason: "credential-class" | "provider-binding";
} | {
    kind: "profile-unresolved";
    profileId: string;
    error?: unknown;
};
/** True when a bearer auth profile can safely satisfy a provider-entry apiKey reference. */
export declare function canUseProfileAsProviderEntryApiKey(params: {
    cfg?: OpenClawConfig;
    provider: string;
    credential: AuthProfileCredential;
}): boolean;
/** Classifies a provider entry apiKey as literal/profile/marker before resolving secrets. */
export declare function resolveProviderEntryApiKeyProfileReference(params: {
    cfg?: OpenClawConfig;
    provider: string;
    store: AuthProfileStore;
}): ProviderEntryApiKeyProfileReference;
/** Resolves a provider-entry apiKey profile reference into runtime auth when possible. */
export declare function resolveProviderEntryApiKeyBinding(params: {
    cfg?: OpenClawConfig;
    provider: string;
    store: AuthProfileStore;
    agentDir?: string;
}): Promise<ProviderEntryApiKeyBindingResolution>;
/** True when a custom local provider can use a synthetic no-auth placeholder. */
export declare function hasSyntheticLocalProviderAuthConfig(params: {
    cfg: OpenClawConfig | undefined;
    provider: string;
}): boolean;
/** Fast auth-availability check for runtime provider/model selection. */
export declare function hasRuntimeAvailableProviderAuth(params: {
    provider: string;
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    allowPluginSyntheticAuth?: boolean;
    runtimeLookup?: RuntimeProviderAuthLookup;
    modelApi?: string;
}): boolean;
/** Resolves the credential that should be used for one provider request. */
export declare function resolveApiKeyForProvider(params: {
    provider: string;
    cfg?: OpenClawConfig;
    profileId?: string;
    preferredProfile?: string;
    store?: AuthProfileStore;
    agentDir?: string;
    workspaceDir?: string;
    /** When true, treat profileId as a user-locked selection that must not be
     *  silently overridden by env/config credentials. */
    lockedProfile?: boolean;
    forceRefresh?: boolean;
    credentialPrecedence?: ProviderCredentialPrecedence;
    modelApi?: string;
}): Promise<ResolvedProviderAuth>;
export type ModelAuthMode = "api-key" | "oauth" | "token" | "mixed" | "aws-sdk" | "unknown";
export { resolveEnvApiKey } from "./model-auth-env.js";
export type { EnvApiKeyResult } from "./model-auth-env.js";
/** Reports the strongest configured auth mode for provider-list UI and diagnostics. */
export declare function resolveModelAuthMode(provider?: string, cfg?: OpenClawConfig, store?: AuthProfileStore, options?: {
    workspaceDir?: string;
}): ModelAuthMode | undefined;
/** Checks provider auth availability, including profile fallback order. */
export declare function hasAvailableAuthForProvider(params: {
    provider: string;
    cfg?: OpenClawConfig;
    preferredProfile?: string;
    store?: AuthProfileStore;
    agentDir?: string;
    workspaceDir?: string;
    modelApi?: string;
}): Promise<boolean>;
/** Resolves request credentials from the provider attached to a model descriptor. */
export declare function getApiKeyForModel(params: {
    model: Model;
    cfg?: OpenClawConfig;
    profileId?: string;
    preferredProfile?: string;
    store?: AuthProfileStore;
    agentDir?: string;
    workspaceDir?: string;
    lockedProfile?: boolean;
    credentialPrecedence?: ProviderCredentialPrecedence;
}): Promise<ResolvedProviderAuth>;
/** Clears auth for local OpenAI-compatible servers that explicitly use no auth. */
export declare function applyLocalNoAuthHeaderOverride<T extends Model>(model: T, auth: ResolvedProviderAuth | null | undefined): T;
/**
 * When the provider config sets `authHeader: true`, inject an explicit
 * `Authorization: Bearer <apiKey>` header into the model so downstream SDKs
 * (e.g. `@google/genai`) send credentials via the standard HTTP Authorization
 * header instead of vendor-specific headers like `x-goog-api-key`.
 *
 * This is a no-op when `authHeader` is not `true`, when no API key is
 * available, or when the API key is a synthetic marker (e.g. local-server
 * placeholders) rather than a real credential.
 */
export declare function applyAuthHeaderOverride<T extends Model>(model: T, auth: ResolvedProviderAuth | null | undefined, cfg: OpenClawConfig | undefined): T;
