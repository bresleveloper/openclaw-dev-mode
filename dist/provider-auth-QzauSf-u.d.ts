import { _A as WizardPrompter, aS as ProviderAuthResult, cS as SecretInputMode, eC as updateAuthProfileStoreWithLock, oC as removeProviderAuthProfilesWithLock, pk as PluginMetadataSnapshot, rS as ProviderAuthMethod, sS as ProviderPluginWizardSetup, yS as ProviderEnvVarLookupParams$1 } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { d as SecretRef, u as SecretInput } from "./types.secrets-D_jefub3.js";
import "./types-ACDCRjU-.js";
import { g as OAuthProvider, p as AuthProfileStore, u as AuthProfileCredential } from "./provider-request-config.types-BDimJcpZ.js";
import "./provider-auth-helpers-D1yG5izX.js";
import "./provider-credential-values-CtEhgdpI.js";
import { execSync } from "node:child_process";
declare function findNormalizedProviderValue<T>(entries: Record<string, T> | undefined, provider: string): T | undefined;
/** @deprecated Anthropic provider-owned CLI profile id; do not use from third-party plugins. */
declare const CLAUDE_CLI_PROFILE_ID = "anthropic:claude-cli";
/** @deprecated OpenAI provider-owned CLI profile id; do not use from third-party plugins. */
declare const CODEX_CLI_PROFILE_ID = "openai:codex-cli";
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
   * Profile email from the OpenAI token profile claim or credential fallback.
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
  /**
   * Email supplied by the credential when the access token omits one.
   */
  email?: string | null;
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
/**
 * Coerce a user/config-supplied GitHub host to a safe bare lowercase hostname.
 *
 * Fails closed to public `github.com`: only the public host and data-residency
 * GHE tenants (`*.ghe.com`) are trusted. Any other value falls back to the
 * default rather than being used verbatim, because the resolved host becomes the
 * `api.<host>` endpoint that receives the GitHub OAuth token during exchange — a
 * typo or injected value like `evil.com` must never redirect that token.
 * (Classic self-hosted GHE Server uses arbitrary hostnames but does not host
 * Copilot, so it is deliberately out of scope.) Config-supplied hosts coerce
 * rather than throw; persisted credential origins are rejected upstream with
 * `isSupportedGithubCopilotDomain` before reaching a token request.
 */
declare function normalizeGithubCopilotDomain(raw: string | undefined | null): string;
type AuthProfileUpsertParams = {
  profileId: string;
  credential: AuthProfileCredential;
  agentDir?: string;
  stateDir?: string;
};
type AuthProfileUpdateParams = Pick<Parameters<typeof updateAuthProfileStoreWithLock>[0], "agentDir" | "profileId" | "sharedStoreWrite" | "stateDir" | "saveOptions"> & {
  updater: (store: AuthProfileStore) => boolean;
};
declare function updateAuthProfileStoreWithLockCompat(params: AuthProfileUpdateParams): Promise<AuthProfileStore | null>;
declare function upsertAuthProfileWithLockCompat({ profileId, credential, agentDir, stateDir }: AuthProfileUpsertParams): Promise<AuthProfileStore | null>;
declare function removeProviderAuthProfilesWithLockCompat(params: Parameters<typeof removeProviderAuthProfilesWithLock>[0]): Promise<AuthProfileStore | null>;
type CodexCliCredential = {
  type: "oauth";
  provider: OAuthProvider;
  access: string;
  refresh: string;
  expires: number;
  accountId?: string;
  idToken?: string;
};
type ExecSyncFn = typeof execSync;
declare function readCodexCliCredentialsCached(options?: {
  codexHome?: string;
  allowKeychainPrompt?: boolean;
  ttlMs?: number;
  platform?: NodeJS.Platform;
  execSync?: ExecSyncFn;
}): CodexCliCredential | null;
/** Retired Claude CLI credential shape kept only for source compatibility. */
type ClaudeCliCredential = {
  type: "oauth";
  provider: "anthropic";
  access: string;
  refresh: string;
  expires: number;
  subscriptionType?: string;
  rateLimitTier?: string;
  email?: string;
} | {
  type: "token";
  provider: "anthropic";
  token: string;
  expires: number;
  subscriptionType?: string;
  rateLimitTier?: string;
  email?: string;
} | {
  type: "api_key_helper";
  provider: "anthropic";
  helperHash: string;
};
type ClaudeCliCredentialReadOptions = {
  allowKeychainPrompt?: boolean;
  tryKeychainWithoutPrompt?: boolean;
  onStoredCredentialUnreadable?: () => void;
  ttlMs?: number;
  platform?: NodeJS.Platform;
  homeDir?: string;
  execSync?: typeof execSync;
};
/**
 * @deprecated Claude CLI owns native login. Kept functional for shipped Plugin SDK callers only.
 * Scheduled for removal after v2026.10.
 */
declare function readClaudeCliCredentialsCached(options?: ClaudeCliCredentialReadOptions): ClaudeCliCredential | null;
/** Suggests a modern OAuth profile id for a legacy provider:default profile. */
declare function suggestOAuthProfileIdForLegacyDefault(params: {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  legacyProfileId: string;
}): string | null;
/** Copy overrides used while prompting for provider secret-ref setup. */
type SecretRefSetupPromptCopy = {
  sourceMessage?: string;
  envVarMessage?: string;
  envVarPlaceholder?: string;
  envVarFormatError?: string;
  envVarMissingError?: (envVar: string) => string;
  noProvidersMessage?: string;
  envValidatedMessage?: (envVar: string) => string;
  providerValidatedMessage?: (provider: string, id: string, source: "file" | "exec" | "store") => string;
};
declare function promptSecretRefForSetup$1(params: {
  provider: string;
  config: OpenClawConfig;
  prompter: WizardPrompter;
  preferredEnvVar?: string;
  copy?: SecretRefSetupPromptCopy;
  env?: NodeJS.ProcessEnv;
}): Promise<{
  ref: SecretRef;
  resolvedValue: string;
}>;
/** Prompt copy overrides for provider secret input mode selection. */
type SecretInputModePromptCopy = {
  modeMessage?: string;
  plaintextLabel?: string;
  plaintextHint?: string;
  refLabel?: string;
  refHint?: string;
};
/** Resolves provider secret input mode from explicit option or wizard selection. */
declare function resolveSecretInputModeForEnvSelection(params: {
  prompter: Pick<WizardPrompter, "select">;
  explicitMode?: SecretInputMode;
  copy?: SecretInputModePromptCopy;
}): Promise<SecretInputMode>;
/** Keeps secret resolution out of synchronous provider setup metadata imports. */
declare const promptSecretRefForSetup: typeof promptSecretRefForSetup$1;
/** Normalizes pasted API-key input, including shell assignment forms. */
declare function normalizeApiKeyInput(raw: string): string;
/** Validates required API-key input for setup prompts. */
declare const validateApiKeyInput: (value: string) => "Paste the API key value, not an OpenClaw onboarding command." | "Required" | undefined;
/** Formats a redacted API-key preview for setup confirmation prompts. */
declare function formatApiKeyPreview(raw: string, opts?: {
  head?: number;
  tail?: number;
}): string;
/** Resolves an API key from CLI options first, then environment or prompt fallback. */
declare function ensureApiKeyFromOptionEnvOrPrompt(params: Parameters<typeof ensureApiKeyFromEnvOrPrompt>[0] & {
  token: string | undefined;
  tokenProvider: string | undefined;
  expectedProviders: string[];
  noteMessage?: string;
  noteTitle?: string;
}): Promise<string>;
/** Resolves an API key from environment or interactive prompt and records the chosen secret mode. */
declare function ensureApiKeyFromEnvOrPrompt(params: {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  workspaceDir?: string;
  provider: string;
  envLabel: string;
  promptMessage: string;
  normalize: (value: string) => string;
  validate: (value: string) => string | undefined;
  prompter: WizardPrompter;
  secretInputMode?: SecretInputMode;
  setCredential: (apiKey: SecretInput, mode?: SecretInputMode) => Promise<void>;
}): Promise<string>;
/** Normalizes `${ENV_VAR}` config syntax to the raw environment variable name. */
declare function normalizeApiKeyConfig(value: string): string;
/** @deprecated Provider-owned setup helper; do not use from third-party plugins. */
declare function buildTokenProfileId(params: {
  provider: string;
  name: string;
}): string;
/** @deprecated Anthropic provider-owned setup helper; do not use from third-party plugins. */
declare function validateAnthropicSetupToken(raw: string): string | undefined;
type ProviderApiKeyAuthMethodOptions = {
  providerId: string;
  methodId: string;
  label: string;
  hint?: string;
  wizard?: ProviderPluginWizardSetup;
  optionKey: string;
  flagName: `--${string}`;
  envVar: string;
  promptMessage: string;
  validateApiKey?: (apiKey: string) => string | undefined;
  profileId?: string;
  profileIds?: string[];
  allowProfile?: boolean;
  defaultModel?: string;
  preserveExistingPrimary?: boolean;
  expectedProviders?: string[];
  metadata?: Record<string, string>;
  noteMessage?: string;
  noteTitle?: string;
  applyConfig?: (cfg: OpenClawConfig) => OpenClawConfig;
  resolveDefaultModel?: (params: {
    apiKey: string;
    config: OpenClawConfig;
    signal?: AbortSignal;
  }) => Promise<string | undefined>;
};
/** Creates a provider auth method that captures, stores, and configures API-key credentials. */
declare function createProviderApiKeyAuthMethod(params: ProviderApiKeyAuthMethodOptions): ProviderAuthMethod;
type ProviderEnvVarLookupParams = ProviderEnvVarLookupParams$1 | (Omit<ProviderEnvVarLookupParams$1, "metadataSnapshot"> & {
  metadataSnapshot: Omit<PluginMetadataSnapshot, "owners"> & {
    owners: Omit<PluginMetadataSnapshot["owners"], "providerAuthContributions">;
  };
});
declare function listKnownProviderAuthEnvVarNames(params?: ProviderEnvVarLookupParams): string[];
type AuthConfigPatch = NonNullable<ProviderAuthResult["configPatch"]>;
/**
 * Builds the standard auth result payload for OAuth-style provider login flows.
 *
 * The helper emits both the credential profile and the config patch expected by setup callers,
 * while normalizing model refs so OAuth imports do not persist retired catalog ids.
 */
declare function buildOauthProviderAuthResult(params: {
  /** Provider id stored on the auth profile credential and profile id. */
  providerId: string;
  /** Default model ref to seed into config when no explicit patch is supplied. */
  defaultModel: string;
  /** OAuth access token persisted in the generated auth profile. */
  access: string;
  /** Optional OAuth refresh token persisted when present. */
  refresh?: string | null;
  /** Optional expiry timestamp or date-like value normalized to Date-safe milliseconds. */
  expires?: number | null;
  /** Account email used for credential metadata and default profile naming. */
  email?: string | null;
  /** Human-readable account label stored in credential metadata. */
  displayName?: string | null;
  /** Explicit profile name used when deriving the auth profile id. */
  profileName?: string | null;
  /** Optional prefix added to the generated auth profile id. */
  profilePrefix?: string;
  /** Provider-specific credential fields merged into the OAuth credential. */
  credentialExtra?: Record<string, unknown>;
  /** Explicit config patch to emit after model-ref normalization. */
  configPatch?: AuthConfigPatch;
  /** Optional setup notes forwarded to provider login callers. */
  notes?: string[];
}): ProviderAuthResult;
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
/** Apply an auth result with the host's header-deletion and model-map merge semantics. */
declare function applyProviderAuthConfigPatch(config: OpenClawConfig, patch: ProviderAuthResult["configPatch"], options?: Pick<ProviderAuthResult, "replaceDefaultModels">): OpenClawConfig;
export { normalizeGithubCopilotDomain as A, resolveSecretInputModeForEnvSelection as C, removeProviderAuthProfilesWithLockCompat as D, readCodexCliCredentialsCached as E, resolveOpenAICodexAuthIdentity as F, resolveOpenAICodexImportProfileName as I, CLAUDE_CLI_PROFILE_ID as L, buildOpenAICodexCredentialExtra as M, decodeOpenAICodexJwtPayload as N, updateAuthProfileStoreWithLockCompat as O, resolveOpenAICodexAccessTokenExpiry as P, CODEX_CLI_PROFILE_ID as R, validateApiKeyInput as S, readClaudeCliCredentialsCached as T, ensureApiKeyFromEnvOrPrompt as _, COPILOT_INTEGRATION_ID as a, normalizeApiKeyInput as b, generateHexPkceVerifierChallenge as c, buildOauthProviderAuthResult as d, listKnownProviderAuthEnvVarNames as f, normalizeApiKeyConfig as g, validateAnthropicSetupToken as h, COPILOT_GITHUB_API_VERSION as i, OpenAICodexAuthIdentity as j, upsertAuthProfileWithLockCompat as k, generatePkceVerifierChallenge as l, buildTokenProfileId as m, COPILOT_EDITOR_PLUGIN_VERSION as n, COPILOT_USER_AGENT as o, createProviderApiKeyAuthMethod as p, COPILOT_EDITOR_VERSION as r, buildCopilotIdeHeaders as s, applyProviderAuthConfigPatch as t, toFormUrlEncoded as u, ensureApiKeyFromOptionEnvOrPrompt as v, suggestOAuthProfileIdForLegacyDefault as w, promptSecretRefForSetup as x, formatApiKeyPreview as y, findNormalizedProviderValue as z };