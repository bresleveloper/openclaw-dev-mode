import type { AuthProfileCredential } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/config.js";
export type { OpenClawConfig } from "../config/config.js";
export type { SecretInput } from "../config/types.secrets.js";
export type { SecretInputMode } from "../plugins/provider-auth-types.js";
export type { ProviderAuthResult } from "../plugins/types.js";
export type { ProviderAuthContext } from "../plugins/types.js";
export type { AuthProfileStore, OAuthCredential } from "../agents/auth-profiles/types.js";
export { CLAUDE_CLI_PROFILE_ID, CODEX_CLI_PROFILE_ID } from "../agents/auth-profiles/constants.js";
export { ensureAuthProfileStore, ensureAuthProfileStoreForLocalUpdate, updateAuthProfileStoreWithLock, } from "../agents/auth-profiles/store.js";
export { listProfilesForProvider, removeProviderAuthProfilesWithLock, upsertAuthProfile, upsertAuthProfileWithLock, } from "../agents/auth-profiles/profiles.js";
export { resolveEnvApiKey } from "../agents/model-auth-env.js";
export { readClaudeCliCredentialsCached, readCodexCliCredentialsCached, } from "../agents/cli-credentials.js";
export { suggestOAuthProfileIdForLegacyDefault } from "../agents/auth-profiles/repair.js";
export { CUSTOM_LOCAL_AUTH_MARKER, MINIMAX_OAUTH_MARKER, isKnownEnvApiKeyMarker, isNonSecretApiKeyMarker, resolveOAuthApiKeyMarker, resolveNonEnvSecretRefApiKeyMarker, } from "../agents/model-auth-markers.js";
export { formatApiKeyPreview, normalizeApiKeyInput, validateApiKeyInput, } from "../plugins/provider-auth-input.js";
export { ensureApiKeyFromEnvOrPrompt, ensureApiKeyFromOptionEnvOrPrompt, normalizeSecretInputModeInput, promptSecretRefForSetup, resolveSecretInputModeForEnvSelection, } from "../plugins/provider-auth-input.js";
export { normalizeApiKeyConfig } from "../agents/models-config.providers.secrets.js";
export { buildTokenProfileId, validateAnthropicSetupToken, } from "../plugins/provider-auth-token.js";
export { applyAuthProfileConfig, buildApiKeyCredential, upsertApiKeyProfile, writeOAuthCredentials, type ApiKeyStorageOptions, type WriteOAuthCredentialsOptions, } from "../plugins/provider-auth-helpers.js";
export { createProviderApiKeyAuthMethod } from "../plugins/provider-api-key-auth.js";
export { coerceSecretRef, hasConfiguredSecretInput } from "../config/types.secrets.js";
export { resolveDefaultSecretProviderAlias } from "../secrets/ref-contract.js";
export { resolveRequiredHomeDir } from "../infra/home-dir.js";
export { resolveOpenClawAgentDir } from "./agent-dir-compat.js";
export { normalizeOptionalSecretInput, normalizeSecretInput, } from "../utils/normalize-secret-input.js";
export { listKnownProviderAuthEnvVarNames, omitEnvKeysCaseInsensitive, } from "../secrets/provider-env-vars.js";
export { buildOauthProviderAuthResult } from "./provider-auth-result.js";
export { buildOpenAICodexCredentialExtra, decodeOpenAICodexJwtPayload, resolveOpenAICodexAccessTokenExpiry, resolveOpenAICodexAuthIdentity, resolveOpenAICodexImportProfileName, type OpenAICodexAuthIdentity, } from "./provider-openai-chatgpt-auth.js";
export { generateHexPkceVerifierChallenge, generatePkceVerifierChallenge, toFormUrlEncoded, } from "./oauth-utils.js";
export { DEFAULT_OAUTH_REFRESH_MARGIN_MS, hasUsableOAuthCredential, } from "../agents/auth-profiles/credential-state.js";
export { COPILOT_EDITOR_PLUGIN_VERSION, COPILOT_EDITOR_VERSION, COPILOT_GITHUB_API_VERSION, COPILOT_INTEGRATION_ID, COPILOT_USER_AGENT, buildCopilotIdeHeaders, } from "../agents/copilot-dynamic-headers.js";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
export declare const DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
export type CachedCopilotToken = {
    /** Copilot API token returned by GitHub's internal exchange endpoint. */
    token: string;
    /** Absolute epoch milliseconds when the Copilot API token expires. */
    expiresAt: number;
    /** Absolute epoch milliseconds when this cache entry was written. */
    updatedAt: number;
    /** Copilot integration id that produced this cached token. */
    integrationId?: string;
};
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
export declare function deriveCopilotApiBaseUrlFromToken(
/** Copilot API token text that may contain a `proxy-ep` attribute. */
token: string): string | null;
/**
 * @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins.
 */
export declare function resolveCopilotApiToken(params: {
    /** GitHub OAuth token exchanged for a Copilot API token. */
    githubToken: string;
    /** Environment used to resolve the default token cache path. */
    env?: NodeJS.ProcessEnv;
    /** Fetch implementation used for the Copilot token exchange. */
    fetchImpl?: typeof fetch;
    /** Explicit cache file path for the exchanged Copilot token. */
    cachePath?: string;
    /** Cache reader override for tests and alternate storage backends. */
    loadJsonFileImpl?: (path: string) => unknown;
    /** Cache writer override for tests and alternate storage backends. */
    saveJsonFileImpl?: (path: string, value: CachedCopilotToken) => void;
}): Promise<{
    /** Copilot API token, from cache or fresh exchange. */
    token: string;
    /** Absolute epoch milliseconds when the Copilot API token expires. */
    expiresAt: number;
    /** Source marker identifying cache path or exchange endpoint. */
    source: string;
    /** Copilot API base URL derived from token metadata or default endpoint. */
    baseUrl: string;
}>;
/**
 * Checks whether a provider has either env auth or matching local auth profiles configured.
 */
export declare function isProviderApiKeyConfigured(params: {
    /** Provider id to check for env auth or local auth profiles. */
    provider: string;
    /** Agent directory containing auth profiles. */
    agentDir?: string;
    /** Optional allowed profile credential types. */
    profileTypes?: readonly AuthProfileCredential["type"][];
}): boolean;
/**
 * Lists auth profile ids usable for a provider without throwing on missing stores or keychain access.
 */
export declare function listUsableProviderAuthProfileIds(params: {
    /** Provider id whose usable auth profiles should be listed. */
    provider: string;
    /** Optional runtime config used to resolve auth profile order and default agent dir. */
    cfg?: OpenClawConfig;
    /** Agent directory containing auth profiles. */
    agentDir?: string;
    /** Optional allowed profile credential types. */
    profileTypes?: readonly AuthProfileCredential["type"][];
    /** Whether profile store reads may prompt for keychain-backed credentials. */
    allowKeychainPrompt?: boolean;
    /** Whether external CLI auth profiles may be discovered and included. */
    includeExternalCliAuth?: boolean;
}): {
    agentDir: string;
    profileIds: string[];
};
/**
 * Checks whether any usable auth profile exists for a provider.
 */
export declare function isProviderAuthProfileConfigured(params: {
    /** Provider id to check for usable auth profiles. */
    provider: string;
    /** Optional runtime config used to resolve auth profile order and default agent dir. */
    cfg?: OpenClawConfig;
    /** Agent directory containing auth profiles. */
    agentDir?: string;
    /** Optional allowed profile credential types. */
    profileTypes?: readonly AuthProfileCredential["type"][];
    /** Whether profile store reads may prompt for keychain-backed credentials. */
    allowKeychainPrompt?: boolean;
    /** Whether external CLI auth profiles may be discovered and included. */
    includeExternalCliAuth?: boolean;
}): boolean;
/**
 * Resolves the first usable auth-profile API key for a provider in configured profile order.
 */
export declare function resolveProviderAuthProfileApiKey(params: {
    /** Provider id whose first usable auth profile should resolve to an API key. */
    provider: string;
    /** Optional runtime config used to resolve auth profile order and secret refs. */
    cfg?: OpenClawConfig;
    /** Agent directory containing auth profiles. */
    agentDir?: string;
    /** Optional allowed profile credential types. */
    profileTypes?: readonly AuthProfileCredential["type"][];
    /** Whether profile store reads may prompt for keychain-backed credentials. */
    allowKeychainPrompt?: boolean;
    /** Whether external CLI auth profiles may be discovered and included. */
    includeExternalCliAuth?: boolean;
}): Promise<string | undefined>;
