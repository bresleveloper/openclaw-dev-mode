type AgentDeliveryEvidence = {
    payloads?: unknown;
    deliveryStatus?: {
        status?: unknown;
        errorMessage?: unknown;
    };
    didSendViaMessagingTool?: unknown;
    messagingToolSentTexts?: unknown;
    messagingToolSentMediaUrls?: unknown;
    messagingToolSentTargets?: unknown;
    acceptedSessionSpawns?: unknown;
    successfulCronAdds?: unknown;
    meta?: {
        toolSummary?: {
            calls?: unknown;
        };
    };
};
/** Collects media URLs from agent payloads and committed messaging-tool delivery metadata. */
export declare function collectDeliveredMediaUrls(result: AgentDeliveryEvidence): string[];
/** Collects media URLs recorded by messaging-tool sends and their target attachments. */
export declare function collectMessagingToolDeliveredMediaUrls(result: Pick<AgentDeliveryEvidence, "messagingToolSentMediaUrls" | "messagingToolSentTargets">): string[];
/** Extracts a gateway result payload when the response carries delivery evidence fields. */
export declare function getGatewayAgentResult(response: unknown): AgentDeliveryEvidence | null;
/** Returns whether payload metadata contains visible text, media, presentation, or channel data. */
export declare function hasVisibleAgentPayload(result: Pick<AgentDeliveryEvidence, "payloads">, options?: {
    includeErrorPayloads?: boolean;
    includeReasoningPayloads?: boolean;
}): boolean;
/** Returns whether the messaging tool attempted or committed an outbound delivery. */
export declare function hasMessagingToolDeliveryEvidence(result: AgentDeliveryEvidence): boolean;
/** Returns whether messaging-tool metadata proves committed text, media, or target delivery. */
export declare function hasCommittedMessagingToolDeliveryEvidence(result: Pick<AgentDeliveryEvidence, "messagingToolSentTexts" | "messagingToolSentMediaUrls" | "messagingToolSentTargets">): boolean;
/** Returns whether committed outbound evidence makes replay unsafe. */
export declare function hasCommittedOutboundDeliveryEvidence(result: AgentDeliveryEvidence): boolean;
/** Returns whether any tool progress or outbound side effect makes a retry unsafe. */
export declare function hasOutboundDeliveryEvidence(result: AgentDeliveryEvidence): boolean;
/** Formats an agent-command delivery failure message from delivery status metadata. */
export declare function getAgentCommandDeliveryFailure(result: AgentDeliveryEvidence): string | undefined;
export {};
