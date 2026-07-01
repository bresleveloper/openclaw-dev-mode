/**
 * Channel message adapter contract verification helpers.
 *
 * Runs proof callbacks for declared durable, live-preview, live-message, and receive capabilities.
 */
import type { ChannelMessageAdapterShape, ChannelMessageLiveCapability, ChannelMessageReceiveAckPolicy, DurableFinalDeliveryCapability, DurableFinalDeliveryRequirementMap, LivePreviewFinalizerCapability, LivePreviewFinalizerCapabilityMap } from "./types.js";
/**
 * Proof callback used to verify one declared durable-final delivery capability.
 */
export type DurableFinalCapabilityProof = () => Promise<void> | void;
/**
 * Proof callbacks keyed by durable-final delivery capability.
 */
export type DurableFinalCapabilityProofMap = Partial<Record<DurableFinalDeliveryCapability, DurableFinalCapabilityProof>>;
/**
 * Verification result for one durable-final delivery capability.
 */
export type DurableFinalCapabilityProofResult = {
    capability: DurableFinalDeliveryCapability;
    status: "verified" | "not_declared";
};
/**
 * Proof callback used to verify one live-preview finalizer capability.
 */
export type LivePreviewFinalizerCapabilityProof = () => Promise<void> | void;
/**
 * Proof callback used to verify one live message capability.
 */
export type ChannelMessageLiveCapabilityProof = () => Promise<void> | void;
/**
 * Proof callback used to verify one receive acknowledgement policy.
 */
export type ChannelMessageReceiveAckPolicyProof = () => Promise<void> | void;
/**
 * Proof callbacks keyed by live-preview finalizer capability.
 */
export type LivePreviewFinalizerCapabilityProofMap = Partial<Record<LivePreviewFinalizerCapability, LivePreviewFinalizerCapabilityProof>>;
/**
 * Proof callbacks keyed by live message capability.
 */
export type ChannelMessageLiveCapabilityProofMap = Partial<Record<ChannelMessageLiveCapability, ChannelMessageLiveCapabilityProof>>;
/**
 * Proof callbacks keyed by receive acknowledgement policy.
 */
export type ChannelMessageReceiveAckPolicyProofMap = Partial<Record<ChannelMessageReceiveAckPolicy, ChannelMessageReceiveAckPolicyProof>>;
/**
 * Verification result for one live-preview finalizer capability.
 */
export type LivePreviewFinalizerCapabilityProofResult = {
    capability: LivePreviewFinalizerCapability;
    status: "verified" | "not_declared";
};
/**
 * Verification result for one live message capability.
 */
export type ChannelMessageLiveCapabilityProofResult = {
    capability: ChannelMessageLiveCapability;
    status: "verified" | "not_declared";
};
/**
 * Verification result for one receive acknowledgement policy.
 */
export type ChannelMessageReceiveAckPolicyProofResult = {
    policy: ChannelMessageReceiveAckPolicy;
    status: "verified" | "not_declared";
};
/**
 * Lists declared durable-final delivery capabilities in stable contract order.
 */
export declare function listDeclaredDurableFinalCapabilities(capabilities: DurableFinalDeliveryRequirementMap | undefined): DurableFinalDeliveryCapability[];
/**
 * Lists declared live-preview finalizer capabilities in stable contract order.
 */
export declare function listDeclaredLivePreviewFinalizerCapabilities(capabilities: LivePreviewFinalizerCapabilityMap | undefined): LivePreviewFinalizerCapability[];
/**
 * Lists declared live message capabilities in stable contract order.
 */
export declare function listDeclaredChannelMessageLiveCapabilities(capabilities: Partial<Record<ChannelMessageLiveCapability, boolean>> | undefined): ChannelMessageLiveCapability[];
/**
 * Lists declared receive acknowledgement policies, including the default policy fallback.
 */
export declare function listDeclaredReceiveAckPolicies(receive: ChannelMessageAdapterShape["receive"] | undefined): ChannelMessageReceiveAckPolicy[];
/**
 * Verifies proof callbacks for every declared durable-final delivery capability.
 */
export declare function verifyDurableFinalCapabilityProofs(params: {
    adapterName: string;
    capabilities?: DurableFinalDeliveryRequirementMap;
    proofs: DurableFinalCapabilityProofMap;
}): Promise<DurableFinalCapabilityProofResult[]>;
/**
 * Verifies proof callbacks for every declared live-preview finalizer capability.
 */
export declare function verifyLivePreviewFinalizerCapabilityProofs(params: {
    adapterName: string;
    capabilities?: LivePreviewFinalizerCapabilityMap;
    proofs: LivePreviewFinalizerCapabilityProofMap;
}): Promise<LivePreviewFinalizerCapabilityProofResult[]>;
/**
 * Verifies proof callbacks for every declared live message capability.
 */
export declare function verifyChannelMessageLiveCapabilityProofs(params: {
    adapterName: string;
    capabilities?: Partial<Record<ChannelMessageLiveCapability, boolean>>;
    proofs: ChannelMessageLiveCapabilityProofMap;
}): Promise<ChannelMessageLiveCapabilityProofResult[]>;
/**
 * Verifies proof callbacks for every declared receive acknowledgement policy.
 */
export declare function verifyChannelMessageReceiveAckPolicyProofs(params: {
    adapterName: string;
    receive?: ChannelMessageAdapterShape["receive"];
    proofs: ChannelMessageReceiveAckPolicyProofMap;
}): Promise<ChannelMessageReceiveAckPolicyProofResult[]>;
/**
 * Verifies durable-final proofs from a channel message adapter declaration.
 */
export declare function verifyChannelMessageAdapterCapabilityProofs(params: {
    adapterName: string;
    adapter: Pick<ChannelMessageAdapterShape, "durableFinal">;
    proofs: DurableFinalCapabilityProofMap;
}): Promise<DurableFinalCapabilityProofResult[]>;
/**
 * Verifies receive acknowledgement proofs from a channel message adapter declaration.
 */
export declare function verifyChannelMessageReceiveAckPolicyAdapterProofs(params: {
    adapterName: string;
    adapter: Pick<ChannelMessageAdapterShape, "receive">;
    proofs: ChannelMessageReceiveAckPolicyProofMap;
}): Promise<ChannelMessageReceiveAckPolicyProofResult[]>;
/**
 * Verifies live-preview finalizer proofs from a channel message adapter declaration.
 */
export declare function verifyChannelMessageLiveFinalizerProofs(params: {
    adapterName: string;
    adapter: Pick<ChannelMessageAdapterShape, "live">;
    proofs: LivePreviewFinalizerCapabilityProofMap;
}): Promise<LivePreviewFinalizerCapabilityProofResult[]>;
/**
 * Verifies live message capability proofs from a channel message adapter declaration.
 */
export declare function verifyChannelMessageLiveCapabilityAdapterProofs(params: {
    adapterName: string;
    adapter: Pick<ChannelMessageAdapterShape, "live">;
    proofs: ChannelMessageLiveCapabilityProofMap;
}): Promise<ChannelMessageLiveCapabilityProofResult[]>;
