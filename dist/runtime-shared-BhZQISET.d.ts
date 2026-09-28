import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { f as SecretRef } from "./types.secrets-BR-Cncxg.js";
import { n as PluginManifestRegistry } from "./manifest-registry-CMnhqUB6.js";
//#region src/secrets/resolve-types.d.ts
/** Shared per-runtime cache for resolved SecretRefs and file provider payloads. */
type SecretRefResolveCache = {
  /** In-flight or completed resolution promise keyed by `secretRefKey(ref)`. */
  resolvedByRefKey?: Map<string, Promise<unknown>>;
  /** In-flight or completed parsed file-provider payload keyed by provider alias. */
  filePayloadByProvider?: Map<string, Promise<unknown>>;
};
//#endregion
//#region src/secrets/runtime-degraded-state.d.ts
type SecretOwnerKind = "account" | "capability" | "gateway" | "provider" | "route" | "unknown";
type SecretAssignmentDisposition = "fail-closed" | "isolate";
//#endregion
//#region src/secrets/runtime-shared.d.ts
type SecretResolverWarningCode = "SECRETS_REF_OVERRIDES_PLAINTEXT" | "SECRETS_REF_IGNORED_INACTIVE_SURFACE" | "SECRETS_OWNER_UNAVAILABLE" | "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT" | "WEB_SEARCH_AUTODETECT_SELECTED" | "WEB_SEARCH_KEY_UNRESOLVED_FALLBACK_USED" | "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK" | "WEB_FETCH_PROVIDER_INVALID_AUTODETECT" | "WEB_FETCH_AUTODETECT_SELECTED" | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_FALLBACK_USED" | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK";
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
declare function collectSecretInputAssignment(params: {
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
//#endregion
export { createResolverContext as a, pushAssignment as c, SecretRefResolveCache as d, collectSecretInputAssignment as i, pushInactiveSurfaceWarning as l, SecretDefaults as n, hasOwnProperty as o, applyResolvedAssignments as r, isEnabledFlag as s, ResolverContext as t, pushWarning as u };