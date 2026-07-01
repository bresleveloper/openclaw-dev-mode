/** Shared secrets runtime resolver context, assignments, and warning helpers. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type SecretRef } from "../config/types.secrets.js";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import type { SecretRefResolveCache } from "./resolve-types.js";
export type SecretResolverWarningCode = "SECRETS_REF_OVERRIDES_PLAINTEXT" | "SECRETS_REF_IGNORED_INACTIVE_SURFACE" | "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT" | "WEB_SEARCH_AUTODETECT_SELECTED" | "WEB_SEARCH_KEY_UNRESOLVED_FALLBACK_USED" | "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK" | "WEB_FETCH_PROVIDER_INVALID_AUTODETECT" | "WEB_FETCH_AUTODETECT_SELECTED" | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_FALLBACK_USED" | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK";
export type SecretResolverWarning = {
    code: SecretResolverWarningCode;
    path: string;
    message: string;
};
export type SecretAssignment = {
    ref: SecretRef;
    path: string;
    expected: "string" | "string-or-object";
    apply: (value: unknown) => void;
};
export type ResolverContext = {
    sourceConfig: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    cache: SecretRefResolveCache;
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
    warnings: SecretResolverWarning[];
    warningKeys: Set<string>;
    assignments: SecretAssignment[];
};
export type SecretDefaults = NonNullable<OpenClawConfig["secrets"]>["defaults"];
export type { SecretRefResolveCache } from "./resolve-types.js";
/**
 * Creates the mutable collection context used while preparing a secrets runtime snapshot.
 */
export declare function createResolverContext(params: {
    sourceConfig: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): ResolverContext;
/**
 * Records a SecretRef assignment that should be resolved and applied later.
 */
export declare function pushAssignment(context: ResolverContext, assignment: SecretAssignment): void;
/**
 * Records a resolver warning once per code/path/message tuple.
 */
export declare function pushWarning(context: ResolverContext, warning: SecretResolverWarning): void;
/**
 * Emits the standard warning for refs configured on currently inactive surfaces.
 */
export declare function pushInactiveSurfaceWarning(params: {
    context: ResolverContext;
    path: string;
    details?: string;
}): void;
/**
 * Converts an inline SecretInput value into a deferred assignment when its surface is active.
 */
export declare function collectSecretInputAssignment(params: {
    value: unknown;
    path: string;
    expected: SecretAssignment["expected"];
    defaults: SecretDefaults | undefined;
    context: ResolverContext;
    active?: boolean;
    inactiveReason?: string;
    apply: (value: unknown) => void;
}): void;
/**
 * Applies resolved SecretRef values to their collected config targets with shape validation.
 */
export declare function applyResolvedAssignments(params: {
    assignments: SecretAssignment[];
    resolved: Map<string, unknown>;
}): void;
/**
 * Own-property helper used by config collectors that receive unknown object shapes.
 */
export declare function hasOwnProperty(record: Record<string, unknown>, key: string): boolean;
/**
 * Treats missing or non-object enabled state as enabled by default.
 */
export declare function isEnabledFlag(value: unknown): boolean;
/**
 * Returns whether both a channel and one account are enabled for secret resolution.
 */
export declare function isChannelAccountEffectivelyEnabled(channel: Record<string, unknown>, account: Record<string, unknown>): boolean;
