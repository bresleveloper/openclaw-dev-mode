import "./types-D7I_F5Ux.js";
import { t as SchemaContract } from "./schema-contract-v05QRSzC.js";
import { d as SecretRef } from "./types.secrets-BcsEzH0R.js";
import { z } from "zod";
//#region src/agents/auth-profiles/credential-schema.d.ts
/** Provider-owned fields retained with OAuth material through storage and refresh. */
declare const oauthCredentialMetadataSchema: z.ZodObject<{
  idToken: z.ZodOptional<z.ZodString>;
  clientId: z.ZodOptional<z.ZodString>;
  authorizationScope: z.ZodOptional<z.ZodString>;
  grantedScope: z.ZodOptional<z.ZodString>;
  enterpriseUrl: z.ZodOptional<z.ZodString>;
  projectId: z.ZodOptional<z.ZodString>;
  accountId: z.ZodOptional<z.ZodString>;
  chatgptPlanType: z.ZodOptional<z.ZodString>;
  subscriptionType: z.ZodOptional<z.ZodString>;
  rateLimitTier: z.ZodOptional<z.ZodString>;
  tokenEndpoint: z.ZodOptional<z.ZodString>;
  deviceAuthorizationEndpoint: z.ZodOptional<z.ZodString>;
  issuer: z.ZodOptional<z.ZodString>;
  authFlow: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type OAuthCredentialMetadata = z.infer<typeof oauthCredentialMetadataSchema>;
/** Current inline credentials, without legacy aliases or host-owned secret references. */
declare const inlineAuthProfileCredentialSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  provider: z.ZodString;
  email: z.ZodOptional<z.ZodString>;
  displayName: z.ZodOptional<z.ZodString>;
  copyToAgents: z.ZodOptional<z.ZodBoolean>;
  type: z.ZodLiteral<"api_key">;
  key: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strict>, z.ZodObject<{
  provider: z.ZodString;
  email: z.ZodOptional<z.ZodString>;
  displayName: z.ZodOptional<z.ZodString>;
  copyToAgents: z.ZodOptional<z.ZodBoolean>;
  type: z.ZodLiteral<"token">;
  token: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodString>;
  expires: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
  idToken: z.ZodOptional<z.ZodString>;
  clientId: z.ZodOptional<z.ZodString>;
  authorizationScope: z.ZodOptional<z.ZodString>;
  grantedScope: z.ZodOptional<z.ZodString>;
  enterpriseUrl: z.ZodOptional<z.ZodString>;
  projectId: z.ZodOptional<z.ZodString>;
  accountId: z.ZodOptional<z.ZodString>;
  chatgptPlanType: z.ZodOptional<z.ZodString>;
  subscriptionType: z.ZodOptional<z.ZodString>;
  rateLimitTier: z.ZodOptional<z.ZodString>;
  tokenEndpoint: z.ZodOptional<z.ZodString>;
  deviceAuthorizationEndpoint: z.ZodOptional<z.ZodString>;
  issuer: z.ZodOptional<z.ZodString>;
  authFlow: z.ZodOptional<z.ZodString>;
  provider: z.ZodString;
  email: z.ZodOptional<z.ZodString>;
  displayName: z.ZodOptional<z.ZodString>;
  copyToAgents: z.ZodOptional<z.ZodBoolean>;
  type: z.ZodLiteral<"oauth">;
  access: z.ZodString;
  refresh: z.ZodString;
  expires: z.ZodNumber;
}, z.core.$strict>], "type">;
//#endregion
//#region src/agents/auth-profiles/legacy-oauth-ref.d.ts
/** Legacy OAuth ref source persisted by older credential stores. */
declare const LEGACY_OAUTH_REF_SOURCE = "openclaw-credentials";
/** Legacy OAuth ref provider persisted by older credential stores. */
declare const LEGACY_OAUTH_REF_PROVIDER = "openai-codex";
type LegacyOAuthRef = {
  source: typeof LEGACY_OAUTH_REF_SOURCE;
  provider: typeof LEGACY_OAUTH_REF_PROVIDER;
  id: string;
};
//#endregion
//#region src/agents/auth-profiles/types.d.ts
type InlineAuthProfileCredential = z.infer<typeof inlineAuthProfileCredentialSchema>;
type SharedAuthStoreOwnership = {
  location: "legacy-main";
} | {
  location: "state-db";
};
/** Internal prepared ownership, carried through commit publication and compensation. */
type AuthProfileStoreOwner = {
  databasePath: string;
  sharedDatabasePath: string;
  location: SharedAuthStoreOwnership["location"];
};
type PreparedAuthProfileStoreOwner = AuthProfileStoreOwner & {
  env: NodeJS.ProcessEnv;
};
/** Provider identifier recorded on auth profile credentials. */
type OAuthProvider = string;
type ApiKeyCredential = SchemaContract<Omit<Extract<InlineAuthProfileCredential, {
  type: "api_key";
}>, "key">> & {
  key?: string;
  keyRef?: SecretRef;
};
/** Static token credential that OpenClaw does not refresh. */
type TokenCredential = SchemaContract<Omit<Extract<InlineAuthProfileCredential, {
  type: "token";
}>, "token">> & {
  token?: string;
  tokenRef?: SecretRef;
};
/**
 * Refreshable OAuth credential plus provider metadata and legacy references.
 * OAuth refresh tokens are not portable by default. Provider-owned flows may
 * set copyToAgents only when copying refresh material across agents is known safe.
 */
type OAuthCredential = OAuthCredentialMetadata & SchemaContract<Omit<Extract<InlineAuthProfileCredential, {
  type: "oauth";
}>, keyof OAuthCredentialMetadata>> & {
  oauthRef?: LegacyOAuthRef;
};
type SavedSetupCredential = {
  apiKeyHeader?: true;
  agentRuntimeId?: string;
  replacement: boolean;
  modelRef: string;
  /** Setup validates the connection config when retrying, outside auth hot paths. */
  configJson: string;
  authChoice?: string;
  pluginId?: string;
};
type AuthProfileCredential = (ApiKeyCredential | TokenCredential | OAuthCredential) & {
  /** Replacement credentials stay unavailable until their verified connection is activated. */
  setup?: SavedSetupCredential;
};
/** Closed reasons that drive cooldown, disable, and failure counters. */
type AuthProfileFailureReason = "auth" | "auth_permanent" | "format" | "overloaded" | "rate_limit" | "billing" | "timeout" | "model_not_found" | "session_expired" | "empty_response" | "no_error_details" | "unclassified" | "unknown";
/** Optional host diagnostic attached to a canonical cooldown reason. */
type AuthProfileCooldownClassification = "wham_token_expired" | "wham_account_dead";
/** Profile-wide blocked reason reported by provider usage probes. */
type AuthProfileBlockedReason = "subscription_limit";
type AuthProfileBlockedSource = "codex_rate_limits" | "wham";
/** Per-profile usage statistics for round-robin and cooldown tracking */
type ProfileUsageStats = {
  lastUsed?: number;
  blockedUntil?: number;
  blockedReason?: AuthProfileBlockedReason;
  blockedSource?: AuthProfileBlockedSource;
  blockedModel?: string;
  blockedScope?: "model";
  cooldownUntil?: number;
  cooldownReason?: AuthProfileFailureReason;
  cooldownClassification?: AuthProfileCooldownClassification;
  cooldownModel?: string;
  disabledUntil?: number;
  disabledReason?: AuthProfileFailureReason;
  /** Counts only locally timed failures; provider timing alone bounds rate limits. */
  errorCount?: number;
  failureCounts?: Partial<Record<Exclude<AuthProfileFailureReason, "rate_limit">, number>>;
  lastFailureAt?: number;
  /** Latest provider rate limit since this profile's last successful request. */
  lastRateLimitAt?: number;
  /** Most recent quota probe or successful provider use. */
  lastProbeAt?: number;
};
/** Durable, non-secret auth profile selection state. */
type AuthProfileState = {
  /**
   * Optional per-agent preferred profile order overrides.
   * This lets you lock/override auth rotation for a specific agent without
   * changing the global config.
   */
  order?: Record<string, string[]>;
  lastGood?: Record<string, string>;
  /** Usage statistics per profile for round-robin rotation */
  usageStats?: Record<string, ProfileUsageStats>;
};
/** Persisted credential payload without runtime-only selection state. */
type AuthProfileSecretsStore = {
  version: number;
  profiles: Record<string, AuthProfileCredential>;
};
/** Effective in-memory auth store combining credentials, state, and overlays. */
type AuthProfileStore = AuthProfileSecretsStore & AuthProfileState & {
  /** Runtime-only provenance for credentials cloned from persisted auth stores. */
  runtimePersistedProfileIds?: string[];
  /** Runtime-only provenance for external OAuth profiles overlaid onto this store. */
  runtimeExternalProfileIds?: string[];
  /** True when the runtime external profile set was freshly resolved, even if empty. */
  runtimeExternalProfileIdsAuthoritative?: boolean;
};
/** Physical origin of a canonical credential selected into a session read view. */
type AuthProfileCredentialSource = {
  readonly databasePath: string;
  readonly provider: string;
};
/** Internal effective-store ownership metadata; never exposed through the plugin SDK. */
type RuntimeAuthProfileStore = AuthProfileStore & {
  /** Physical sources of the selected rows; retained only in session read views. */
  runtimeCredentialSources?: Record<string, AuthProfileCredentialSource>;
  runtimeLocalProfileIds?: string[];
  /** Canonical local OAuth rows may be hidden by shared-store reconciliation. */
  runtimeHasLocalOAuthProfiles?: boolean;
  /** Provider orders stored by this owner; [] means no local override, even with inherited priority. */
  runtimeLocalOrderProviderIds?: string[];
  runtimeInheritsMainState?: boolean;
};
//#endregion
export { AuthProfileFailureReason as a, OAuthCredential as c, RuntimeAuthProfileStore as d, AuthProfileCredentialSource as i, OAuthProvider as l, AuthProfileBlockedSource as n, AuthProfileStore as o, AuthProfileCredential as r, AuthProfileStoreOwner as s, ApiKeyCredential as t, PreparedAuthProfileStoreOwner as u };