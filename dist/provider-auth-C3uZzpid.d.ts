import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { g as SecretRefSource } from "./types.secrets-C15Z_eLX.js";
import { i as AuthProfileCredential } from "./types-Dd5DQ7z0.js";
//#region src/agents/models-config.providers.secret-helpers.d.ts
/** Normalizes `${ENV_VAR}` config syntax to the raw environment variable name. */
declare function normalizeApiKeyConfig(value: string): string;
//#endregion
//#region src/plugins/provider-auth-token.d.ts
/** @deprecated Provider-owned setup helper; do not use from third-party plugins. */
declare function buildTokenProfileId(params: {
  provider: string;
  name: string;
}): string;
/** @deprecated Anthropic provider-owned setup helper; do not use from third-party plugins. */
declare function validateAnthropicSetupToken(raw: string): string | undefined;
//#endregion
//#region src/secrets/ref-contract.d.ts
/** Minimal config shape needed to resolve default provider aliases for a secret source. */
type SecretRefDefaultsCarrier = {
  /** Secrets config subset; callers pass full config objects or narrow test doubles. */secrets?: {
    /** Explicit per-source provider aliases selected by the operator. */defaults?: {
      /** Default provider alias for environment-variable secret refs. */env?: string; /** Default provider alias for file-backed secret refs. */
      file?: string; /** Default provider alias for exec-backed secret refs. */
      exec?: string;
    }; /** Provider declarations used only when callers ask to prefer the first matching source. */
    providers?: Record<string, {
      source?: string;
    }>;
  };
};
/** Resolves the default provider alias for one source, falling back to the built-in alias. */
declare function resolveDefaultSecretProviderAlias(config: SecretRefDefaultsCarrier, source: SecretRefSource, options?: {
  preferFirstProviderForSource?: boolean;
}): string;
//#endregion
//#region src/plugin-sdk/provider-openai-chatgpt-auth.d.ts
/**
 * Identity metadata extracted from OpenAI Codex ChatGPT OAuth tokens.
 */
type OpenAICodexAuthIdentity = {
  /**
   * ChatGPT account id used to group imported profiles under the same account.
   */
  accountId?: string;
  /**
   * ChatGPT subscription plan claim captured for diagnostics and credential metadata.
   */
  chatgptPlanType?: string;
  /**
   * Profile email from the OpenAI token profile claim when available.
   */
  email?: string;
  /**
   * Stable local profile name derived from email, account-scoped subject, or fallback id.
   */
  profileName?: string;
};
/**
 * Decodes a JWT payload without verifying signatures for local metadata extraction.
 */
declare function decodeOpenAICodexJwtPayload(token: string): Record<string, unknown> | undefined;
/**
 * Resolves stable account/profile metadata from OpenAI Codex OAuth access-token claims.
 */
declare function resolveOpenAICodexAuthIdentity(params: {
  /**
   * OpenAI Codex OAuth access token containing ChatGPT auth/profile claims.
   */
  access: string;
  /**
   * Account id supplied by the import source when the access token omits one.
   */
  accountId?: string;
}): OpenAICodexAuthIdentity;
/**
 * Resolves the OAuth access-token expiry timestamp in milliseconds.
 */
declare function resolveOpenAICodexAccessTokenExpiry(access: string): number | undefined;
/**
 * Builds persisted credential metadata for OpenAI Codex OAuth profiles.
 */
declare function buildOpenAICodexCredentialExtra(identity: OpenAICodexAuthIdentity & {
  idToken?: string;
}): Record<string, unknown> | undefined;
/**
 * Picks the imported profile name used when migrating OpenAI Codex auth.
 */
declare function resolveOpenAICodexImportProfileName(identity: Pick<OpenAICodexAuthIdentity, "accountId" | "profileName">,
/**
 * Name to use when imported metadata does not contain an account or stable subject.
 */

fallback: string): string;
//#endregion
//#region src/plugin-sdk/oauth-utils.d.ts
/**
 * Encode a flat object as application/x-www-form-urlencoded form data.
 *
 * @deprecated OAuth provider-owned helper; keep this local to provider plugins instead.
 */
declare function toFormUrlEncoded(data: Record<string, string>): string;
/**
 * Generate a PKCE verifier/challenge pair suitable for OAuth authorization flows.
 *
 * @deprecated OAuth provider-owned helper; keep this local to provider plugins instead.
 */
declare function generatePkceVerifierChallenge(): {
  verifier: string;
  challenge: string;
};
/** Generate a PKCE verifier/challenge pair with a 64-character hex verifier. */
declare function generateHexPkceVerifierChallenge(): {
  verifier: string;
  challenge: string;
};
//#endregion
//#region src/agents/copilot-dynamic-headers.d.ts
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const COPILOT_EDITOR_VERSION = "vscode/1.107.0";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const COPILOT_USER_AGENT = "GitHubCopilotChat/0.35.0";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const COPILOT_EDITOR_PLUGIN_VERSION = "copilot-chat/0.35.0";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const COPILOT_GITHUB_API_VERSION = "2025-04-01";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const COPILOT_INTEGRATION_ID = "vscode-chat";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare function buildCopilotIdeHeaders(params?: {
  includeApiVersion?: boolean;
}): Record<string, string>;
//#endregion
//#region src/plugin-sdk/provider-auth.d.ts
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
type CachedCopilotToken = {
  /** Copilot API token returned by GitHub's internal exchange endpoint. */token: string; /** Absolute epoch milliseconds when the Copilot API token expires. */
  expiresAt: number; /** Absolute epoch milliseconds when this cache entry was written. */
  updatedAt: number; /** Copilot integration id that produced this cached token. */
  integrationId?: string;
};
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare function deriveCopilotApiBaseUrlFromToken(/** Copilot API token text that may contain a `proxy-ep` attribute. */

token: string): string | null;
/**
 * @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins.
 */
declare function resolveCopilotApiToken(params: {
  /** GitHub OAuth token exchanged for a Copilot API token. */githubToken: string; /** Environment used to resolve the default token cache path. */
  env?: NodeJS.ProcessEnv; /** Fetch implementation used for the Copilot token exchange. */
  fetchImpl?: typeof fetch; /** Explicit cache file path for the exchanged Copilot token. */
  cachePath?: string; /** Cache reader override for tests and alternate storage backends. */
  loadJsonFileImpl?: (path: string) => unknown; /** Cache writer override for tests and alternate storage backends. */
  saveJsonFileImpl?: (path: string, value: CachedCopilotToken) => void;
}): Promise<{
  /** Copilot API token, from cache or fresh exchange. */token: string; /** Absolute epoch milliseconds when the Copilot API token expires. */
  expiresAt: number; /** Source marker identifying cache path or exchange endpoint. */
  source: string; /** Copilot API base URL derived from token metadata or default endpoint. */
  baseUrl: string;
}>;
/**
 * Checks whether a provider has either env auth or matching local auth profiles configured.
 */
declare function isProviderApiKeyConfigured(params: {
  /** Provider id to check for env auth or local auth profiles. */provider: string; /** Agent directory containing auth profiles. */
  agentDir?: string; /** Optional allowed profile credential types. */
  profileTypes?: readonly AuthProfileCredential["type"][];
}): boolean;
/**
 * Lists auth profile ids usable for a provider without throwing on missing stores or keychain access.
 */
declare function listUsableProviderAuthProfileIds(params: {
  /** Provider id whose usable auth profiles should be listed. */provider: string; /** Optional runtime config used to resolve auth profile order and default agent dir. */
  cfg?: OpenClawConfig; /** Agent directory containing auth profiles. */
  agentDir?: string; /** Optional allowed profile credential types. */
  profileTypes?: readonly AuthProfileCredential["type"][]; /** Whether profile store reads may prompt for keychain-backed credentials. */
  allowKeychainPrompt?: boolean; /** Whether external CLI auth profiles may be discovered and included. */
  includeExternalCliAuth?: boolean;
}): {
  agentDir: string;
  profileIds: string[];
};
/**
 * Checks whether any usable auth profile exists for a provider.
 */
declare function isProviderAuthProfileConfigured(params: {
  /** Provider id to check for usable auth profiles. */provider: string; /** Optional runtime config used to resolve auth profile order and default agent dir. */
  cfg?: OpenClawConfig; /** Agent directory containing auth profiles. */
  agentDir?: string; /** Optional allowed profile credential types. */
  profileTypes?: readonly AuthProfileCredential["type"][]; /** Whether profile store reads may prompt for keychain-backed credentials. */
  allowKeychainPrompt?: boolean; /** Whether external CLI auth profiles may be discovered and included. */
  includeExternalCliAuth?: boolean;
}): boolean;
/**
 * Resolves the first usable auth-profile API key for a provider in configured profile order.
 */
declare function resolveProviderAuthProfileApiKey(params: {
  /** Provider id whose first usable auth profile should resolve to an API key. */provider: string; /** Optional runtime config used to resolve auth profile order and secret refs. */
  cfg?: OpenClawConfig; /** Agent directory containing auth profiles. */
  agentDir?: string; /** Optional allowed profile credential types. */
  profileTypes?: readonly AuthProfileCredential["type"][]; /** Whether profile store reads may prompt for keychain-backed credentials. */
  allowKeychainPrompt?: boolean; /** Whether external CLI auth profiles may be discovered and included. */
  includeExternalCliAuth?: boolean;
}): Promise<string | undefined>;
//#endregion
export { resolveOpenAICodexImportProfileName as C, normalizeApiKeyConfig as D, validateAnthropicSetupToken as E, resolveOpenAICodexAuthIdentity as S, buildTokenProfileId as T, toFormUrlEncoded as _, isProviderAuthProfileConfigured as a, decodeOpenAICodexJwtPayload as b, resolveProviderAuthProfileApiKey as c, COPILOT_GITHUB_API_VERSION as d, COPILOT_INTEGRATION_ID as f, generatePkceVerifierChallenge as g, generateHexPkceVerifierChallenge as h, isProviderApiKeyConfigured as i, COPILOT_EDITOR_PLUGIN_VERSION as l, buildCopilotIdeHeaders as m, DEFAULT_COPILOT_API_BASE_URL as n, listUsableProviderAuthProfileIds as o, COPILOT_USER_AGENT as p, deriveCopilotApiBaseUrlFromToken as r, resolveCopilotApiToken as s, CachedCopilotToken as t, COPILOT_EDITOR_VERSION as u, OpenAICodexAuthIdentity as v, resolveDefaultSecretProviderAlias as w, resolveOpenAICodexAccessTokenExpiry as x, buildOpenAICodexCredentialExtra as y };