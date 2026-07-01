import type { AccessGraphGate, ChannelIngressPolicyInput, ChannelIngressState } from "./types.js";
/**
 * Evaluates direct-message sender policy against DM and pairing-store allowlists.
 */
export declare function senderGateForDirect(params: {
    state: ChannelIngressState;
    policy: ChannelIngressPolicyInput;
}): AccessGraphGate;
/**
 * Evaluates group/channel sender policy after route sender allowlist overrides are applied.
 */
export declare function senderGateForGroup(params: {
    state: ChannelIngressState;
    policy: ChannelIngressPolicyInput;
}): AccessGraphGate;
/**
 * Applies event auth mode to sender gates for non-message callbacks.
 */
export declare function applyEventAuthModeToSenderGate(params: {
    state: ChannelIngressState;
    senderGate: AccessGraphGate;
}): AccessGraphGate;
