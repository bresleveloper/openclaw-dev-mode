import type { ChannelIngressPolicyInput, ChannelIngressState, IngressReasonCode, RedactedIngressAllowlistFacts, ResolvedIngressAllowlist } from "./types.js";
/**
 * Returns the first access-group related failure reason for an allowlist.
 */
export declare function allowlistFailureReason(allowlist: ResolvedIngressAllowlist): IngressReasonCode | null;
/**
 * Projects an allowlist into redacted diagnostics safe for ingress access graphs.
 */
export declare function redactedAllowlistDiagnostics(allowlist: ResolvedIngressAllowlist, reasonCode: IngressReasonCode): RedactedIngressAllowlistFacts;
/**
 * Applies mutable identifier matching policy to an already-resolved allowlist.
 */
export declare function applyMutableIdentifierPolicy(allowlist: ResolvedIngressAllowlist, policy: ChannelIngressPolicyInput): ResolvedIngressAllowlist;
/**
 * Resolves the sender allowlist used for group/channel ingress after route overrides.
 */
export declare function effectiveGroupSenderAllowlist(params: {
    state: ChannelIngressState;
    policy: ChannelIngressPolicyInput;
}): ResolvedIngressAllowlist;
