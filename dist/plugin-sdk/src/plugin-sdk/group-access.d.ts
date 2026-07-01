/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Use resolveChannelMessageIngress from channel-ingress-runtime instead.
 */
import { resolveOpenProviderRuntimeGroupPolicy } from "../config/runtime-group-policy.js";
import type { GroupPolicy } from "../config/types.base.js";
export { resolveOpenProviderRuntimeGroupPolicy };
export type { GroupPolicy };
/** Reason code returned when evaluating a sender against group policy. */
export type SenderGroupAccessReason = "allowed" | "disabled" | "empty_allowlist" | "sender_not_allowlisted";
/** Sender-level group access decision plus the effective group policy. */
export type SenderGroupAccessDecision = {
    allowed: boolean;
    groupPolicy: GroupPolicy;
    providerMissingFallbackApplied: boolean;
    reason: SenderGroupAccessReason;
};
/** Reason code returned when evaluating a configured group route. */
export type GroupRouteAccessReason = "allowed" | "disabled" | "empty_allowlist" | "route_not_allowlisted" | "route_disabled";
/** Route-level group access decision plus the effective group policy. */
export type GroupRouteAccessDecision = {
    allowed: boolean;
    groupPolicy: GroupPolicy;
    reason: GroupRouteAccessReason;
};
/** Reason code returned when evaluating a precomputed allowlist match. */
export type MatchedGroupAccessReason = "allowed" | "disabled" | "missing_match_input" | "empty_allowlist" | "not_allowlisted";
/** Matched-input group access decision plus the effective group policy. */
export type MatchedGroupAccessDecision = {
    allowed: boolean;
    groupPolicy: GroupPolicy;
    reason: MatchedGroupAccessReason;
};
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
export declare function resolveSenderScopedGroupPolicy(params: {
    groupPolicy: GroupPolicy;
    groupAllowFrom: string[];
}): GroupPolicy;
/** @deprecated Use route descriptors with `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
export declare function evaluateGroupRouteAccessForPolicy(params: {
    groupPolicy: GroupPolicy;
    routeAllowlistConfigured: boolean;
    routeMatched: boolean;
    routeEnabled?: boolean;
}): GroupRouteAccessDecision;
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
export declare function evaluateMatchedGroupAccessForPolicy(params: {
    groupPolicy: GroupPolicy;
    allowlistConfigured: boolean;
    allowlistMatched: boolean;
    requireMatchInput?: boolean;
    hasMatchInput?: boolean;
}): MatchedGroupAccessDecision;
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
export declare function evaluateSenderGroupAccessForPolicy(params: {
    groupPolicy: GroupPolicy;
    providerMissingFallbackApplied?: boolean;
    groupAllowFrom: string[];
    senderId: string;
    isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
}): SenderGroupAccessDecision;
/** @deprecated Use `resolveOpenProviderRuntimeGroupPolicy` plus `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
export declare function evaluateSenderGroupAccess(params: {
    providerConfigPresent: boolean;
    configuredGroupPolicy?: GroupPolicy;
    defaultGroupPolicy?: GroupPolicy;
    groupAllowFrom: string[];
    senderId: string;
    isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
}): SenderGroupAccessDecision;
