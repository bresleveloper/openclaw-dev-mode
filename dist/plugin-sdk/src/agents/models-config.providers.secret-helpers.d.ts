import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AuthProfileStore } from "./auth-profiles/types.js";
import { type EnvApiKeyLookupOptions } from "./model-auth-env.js";
/**
 * Secret-aware provider config helpers.
 *
 * The exported helpers normalize user config, auth profiles, and environment
 * lookups into provider apiKey/header values while preserving non-printable
 * markers for secrets managed outside plain environment variables.
 */
type ModelsConfig = NonNullable<OpenClawConfig["models"]>;
/** Provider config entry from the canonical OpenClaw models config. */
export type ProviderConfig = NonNullable<ModelsConfig["providers"]>[string];
/** Default secret reference sources applied when config omits an explicit source. */
export type SecretDefaults = {
    env?: string;
    file?: string;
    exec?: string;
};
/** Resolved API key value plus provenance for discovery and secret-marker handling. */
type ProfileApiKeyResolution = {
    apiKey: string;
    source: "plaintext" | "env-ref" | "non-env-ref";
    discoveryApiKey?: string;
};
/** Resolves the provider API key value used by model discovery. */
export type ProviderApiKeyResolver = (provider: string) => {
    apiKey: string | undefined;
    discoveryApiKey?: string;
};
/** Resolves full provider auth state for callers that need mode and profile provenance. */
export type ProviderAuthResolver = (provider: string, options?: {
    oauthMarker?: string;
}) => {
    apiKey: string | undefined;
    discoveryApiKey?: string;
    mode: "api_key" | "aws-sdk" | "oauth" | "token" | "none";
    source: "env" | "profile" | "none";
    profileId?: string;
};
/** Normalizes `${ENV_VAR}` config syntax to the raw environment variable name. */
export declare function normalizeApiKeyConfig(value: string): string;
/** Returns a concrete key for discovery, omitting placeholder markers and blanks. */
export declare function toDiscoveryApiKey(value: string | undefined): string | undefined;
/** Resolves which environment variable supplies a provider API key. */
export declare function resolveEnvApiKeyVarName(provider: string, env?: NodeJS.ProcessEnv, options?: EnvApiKeyLookupOptions): string | undefined;
/** Resolves the AWS SDK API key env var used by Bedrock-style auth. */
export declare function resolveAwsSdkApiKeyVarName(env?: NodeJS.ProcessEnv): string | undefined;
/** Rewrites secret-backed provider headers to stable marker values. */
export declare function normalizeHeaderValues(params: {
    headers: ProviderConfig["headers"] | undefined;
    secretDefaults: SecretDefaults | undefined;
}): {
    headers: ProviderConfig["headers"] | undefined;
    mutated: boolean;
};
/** Resolves an auth profile credential into provider apiKey/discovery values. */
export declare function resolveApiKeyFromCredential(cred: AuthProfileStore["profiles"][string] | undefined, env?: NodeJS.ProcessEnv): ProfileApiKeyResolution | undefined;
/** Lists auth profile ids whose provider aliases match the requested provider. */
export declare function listAuthProfilesForProvider(store: AuthProfileStore, provider: string): string[];
/** Resolves the first usable API key from matching auth profiles. */
export declare function resolveApiKeyFromProfiles(params: {
    provider: string;
    store: AuthProfileStore;
    env?: NodeJS.ProcessEnv;
}): ProfileApiKeyResolution | undefined;
/** Normalizes configured provider apiKey values and records providers backed by secret refs. */
export declare function normalizeConfiguredProviderApiKey(params: {
    providerKey: string;
    provider: ProviderConfig;
    secretDefaults: SecretDefaults | undefined;
    profileApiKey: ProfileApiKeyResolution | undefined;
    secretRefManagedProviders?: Set<string>;
}): ProviderConfig;
/** Rewrites literal env-derived keys back to env variable names when provenance is clear. */
export declare function normalizeResolvedEnvApiKey(params: {
    providerKey: string;
    provider: ProviderConfig;
    env: NodeJS.ProcessEnv;
    secretRefManagedProviders?: Set<string>;
}): ProviderConfig;
/** Fills missing provider apiKey values from env, auth profiles, or AWS SDK auth. */
export declare function resolveMissingProviderApiKey(params: {
    providerKey: string;
    provider: ProviderConfig;
    env: NodeJS.ProcessEnv;
    profileApiKey: ProfileApiKeyResolution | undefined;
    secretRefManagedProviders?: Set<string>;
    providerApiKeyResolver?: (env: NodeJS.ProcessEnv) => string | undefined;
}): ProviderConfig;
export {};
