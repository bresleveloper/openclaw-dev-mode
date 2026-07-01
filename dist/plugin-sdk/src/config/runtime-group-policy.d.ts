import type { GroupPolicy } from "./types.base.js";
type RuntimeGroupPolicyResolution = {
    groupPolicy: GroupPolicy;
    providerMissingFallbackApplied: boolean;
};
type RuntimeGroupPolicyParams = {
    providerConfigPresent: boolean;
    groupPolicy?: GroupPolicy;
    defaultGroupPolicy?: GroupPolicy;
    configuredFallbackPolicy?: GroupPolicy;
    missingProviderFallbackPolicy?: GroupPolicy;
};
/**
 * Resolve the effective group policy for a channel/provider runtime.
 * Missing provider config can fail closed separately from configured providers.
 */
export declare function resolveRuntimeGroupPolicy(params: RuntimeGroupPolicyParams): RuntimeGroupPolicyResolution;
type ResolveProviderRuntimeGroupPolicyParams = {
    providerConfigPresent: boolean;
    groupPolicy?: GroupPolicy;
    defaultGroupPolicy?: GroupPolicy;
};
type GroupPolicyDefaultsConfig = {
    channels?: {
        defaults?: {
            groupPolicy?: GroupPolicy;
        };
    };
};
/** Read the shared channels default group policy used by provider-specific resolvers. */
export declare function resolveDefaultGroupPolicy(cfg: GroupPolicyDefaultsConfig): GroupPolicy | undefined;
/** Human labels for the access surface blocked by a missing-provider fallback. */
export declare const GROUP_POLICY_BLOCKED_LABEL: {
    readonly group: "group messages";
    readonly guild: "guild messages";
    readonly room: "room messages";
    readonly channel: "channel messages";
    readonly space: "space messages";
};
/**
 * Resolve the standard channel-provider policy.
 * Configured providers default open; missing provider config defaults allowlist.
 */
export declare function resolveOpenProviderRuntimeGroupPolicy(params: ResolveProviderRuntimeGroupPolicyParams): RuntimeGroupPolicyResolution;
/**
 * Resolve the strict channel-provider policy.
 * Configured and missing provider config both default allowlist.
 */
export declare function resolveAllowlistProviderRuntimeGroupPolicy(params: ResolveProviderRuntimeGroupPolicyParams): RuntimeGroupPolicyResolution;
/**
 * Log the missing-provider fail-closed fallback once per provider/account.
 * Returns true only when this call emitted the warning.
 */
export declare function warnMissingProviderGroupPolicyFallbackOnce(params: {
    providerMissingFallbackApplied: boolean;
    providerKey: string;
    accountId?: string;
    blockedLabel?: string;
    log: (message: string) => void;
}): boolean;
/**
 * Test helper. Keeps warning-cache state deterministic across test files.
 */
export declare function resetMissingProviderGroupPolicyFallbackWarningsForTesting(): void;
export {};
