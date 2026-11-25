import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { d as SecretRef } from "./types.secrets-D_jefub3.js";
import { n as PluginManifestRegistry } from "./manifest-registry-CNNq5Vj2.js";
/** Shared per-runtime cache for resolved SecretRefs and file provider payloads. */
type SecretRefResolveCache = {
  /** In-flight or completed resolution promise keyed by `secretRefKey(ref)`. */
  resolvedByRefKey?: Map<string, Promise<unknown>>;
  /** In-flight or completed parsed file-provider payload keyed by provider alias. */
  filePayloadByProvider?: Map<string, Promise<unknown>>;
};
type SecretOwnerKind = "account" | "capability" | "gateway" | "provider" | "route" | "unknown";
type SecretAssignmentDisposition = "fail-closed" | "isolate";
/** Diagnostic codes emitted while selecting runtime web search/fetch providers. */
type RuntimeWebDiagnosticCode = "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT" | "WEB_SEARCH_AUTODETECT_SELECTED" | "WEB_SEARCH_KEY_UNRESOLVED_FALLBACK_USED" | "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK" | "WEB_FETCH_PROVIDER_INVALID_AUTODETECT" | "WEB_FETCH_AUTODETECT_SELECTED" | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_FALLBACK_USED" | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK";
/** User-facing diagnostic attached to runtime web-tool metadata. */
type RuntimeWebDiagnostic = {
  code: RuntimeWebDiagnosticCode;
  message: string;
  path?: string;
};
/** Runtime selection metadata for the web search tool. */
type RuntimeWebSearchMetadata = RuntimeWebFetchMetadata & {
  /** Perplexity transport chosen from provider config or runtime default. */
  perplexityTransport?: "search_api" | "chat_completions";
};
/** Runtime selection metadata for the web fetch tool. */
type RuntimeWebFetchMetadata = {
  /** Provider explicitly configured in source config, before auto-detect fallback. */
  providerConfigured?: string;
  providerSource: "configured" | "auto-detect" | "none";
  /** Provider that runtime calls should use after config validation and credential lookup. */
  selectedProvider?: string;
  /** Source that supplied the selected provider credential, or why it is unavailable. */
  selectedProviderKeySource?: "config" | "secretRef" | "env" | "missing";
  diagnostics: RuntimeWebDiagnostic[];
};
type SecretResolverWarningCode = RuntimeWebDiagnosticCode | "SECRETS_REF_OVERRIDES_PLAINTEXT" | "SECRETS_REF_IGNORED_INACTIVE_SURFACE" | "SECRETS_OWNER_UNAVAILABLE";
type SecretResolverWarning = {
  code: SecretResolverWarningCode;
  path: string;
  message: string;
};
type SecretAssignment = {
  ref: SecretRef;
  path: string;
  expected: "string" | "string-or-object";
  ownerKind: SecretOwnerKind;
  ownerId: string;
  requiredForGateway: boolean;
  disposition: SecretAssignmentDisposition;
  /** Digest of the complete owner config captured before secret materialization. */
  ownerContractDigest?: string;
  apply: (value: unknown) => void;
  /** Applies the canonical unavailable state when this owner must start cold. */
  applyUnavailable?: () => void;
};
type SecretAssignmentOwner = Pick<SecretAssignment, "ownerKind" | "ownerId" | "requiredForGateway" | "disposition"> & {
  /** Complete config that controls where/how this owner uses the credential. */
  contract?: unknown;
};
type ResolverContext = {
  sourceConfig: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  cache: SecretRefResolveCache;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
  managedSyntheticAuthProviders?: ReadonlySet<string>;
  warnings: SecretResolverWarning[];
  warningKeys: Set<string>;
  assignments: SecretAssignment[];
};
type SecretDefaults = NonNullable<OpenClawConfig["secrets"]>["defaults"];
/**
 * Creates the mutable collection context used while preparing a secrets runtime snapshot.
 */
declare function createResolverContext(params: {
  sourceConfig: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): ResolverContext;
/**
 * Records a SecretRef assignment that should be resolved and applied later.
 */
declare function pushAssignment(context: ResolverContext, assignment: SecretAssignment): void;
/**
 * Records a resolver warning once per code/path/message tuple.
 */
declare function pushWarning(context: ResolverContext, warning: SecretResolverWarning): void;
/**
 * Emits the standard warning for refs configured on currently inactive surfaces.
 */
declare function pushInactiveSurfaceWarning(params: {
  context: ResolverContext;
  path: string;
  details?: string;
}): void;
/**
 * Converts an inline SecretInput value into a deferred assignment when its surface is active.
 */
declare function collectCanonicalSecretInputAssignment(params: {
  value: unknown;
  path: string;
  expected: SecretAssignment["expected"];
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
  active?: boolean;
  inactiveReason?: string;
  owner?: SecretAssignmentOwner;
  apply: (value: unknown) => void;
  applyUnavailable?: () => void;
}): void;
/** The public channel SDK collector retains providerless input; core config uses Doctor. */
declare function collectSecretInputAssignment(params: Parameters<typeof collectCanonicalSecretInputAssignment>[0]): void;
/**
 * Applies resolved SecretRef values to their collected config targets with shape validation.
 */
declare function applyResolvedAssignments(params: {
  assignments: SecretAssignment[];
  resolved: Map<string, unknown>;
}): void;
/**
 * Own-property helper used by config collectors that receive unknown object shapes.
 */
declare function hasOwnProperty(record: Record<string, unknown>, key: string): boolean;
/**
 * Treats missing or non-object enabled state as enabled by default.
 */
declare function isEnabledFlag(value: unknown): boolean;
export { createResolverContext as a, pushAssignment as c, RuntimeWebFetchMetadata as d, RuntimeWebSearchMetadata as f, collectSecretInputAssignment as i, pushInactiveSurfaceWarning as l, SecretDefaults as n, hasOwnProperty as o, SecretRefResolveCache as p, applyResolvedAssignments as r, isEnabledFlag as s, ResolverContext as t, pushWarning as u };