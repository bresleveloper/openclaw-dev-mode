/**
 * Subagent announcement dispatch strategy.
 *
 * Completion handoff and requester-visible replies use this to choose between
 * steering a subagent and directly delivering a message, with phase evidence.
 */
type SubagentDeliveryPath = "steered" | "direct" | "none";
/** Stable reasons an announcement delivery can fail without throwing. */
export type SubagentAnnounceDeliveryFailureReason = "completion_handoff_pending" | "generated_media_missing" | "message_tool_delivery_missing" | "requester_abandoned" | "visible_reply_missing";
type SubagentAnnounceSteerOutcome = {
    status: "steered";
    deliveredAt?: number;
    enqueuedAt?: number;
} | {
    status: "none" | "dropped";
};
/** Result of trying to deliver a subagent announcement. */
export type SubagentAnnounceDeliveryResult = {
    delivered: boolean;
    path: SubagentDeliveryPath;
    deliveredAt?: number;
    enqueuedAt?: number;
    reason?: SubagentAnnounceDeliveryFailureReason;
    error?: string;
    terminal?: boolean;
    phases?: SubagentAnnounceDispatchPhaseResult[];
};
type SubagentAnnounceDispatchPhase = "steer-primary" | "direct-primary" | "steer-fallback";
type SubagentAnnounceDispatchPhaseResult = {
    phase: SubagentAnnounceDispatchPhase;
    delivered: boolean;
    path: SubagentDeliveryPath;
    deliveredAt?: number;
    enqueuedAt?: number;
    reason?: SubagentAnnounceDeliveryFailureReason;
    error?: string;
};
/** Converts a steer outcome into the shared delivery result shape. */
export declare function mapSteerOutcomeToDeliveryResult(outcome: SubagentAnnounceSteerOutcome): SubagentAnnounceDeliveryResult;
/** Runs the ordered steer/direct announcement delivery strategy. */
export declare function runSubagentAnnounceDispatch(params: {
    expectsCompletionMessage: boolean;
    signal?: AbortSignal;
    steer: () => Promise<SubagentAnnounceSteerOutcome>;
    direct: () => Promise<SubagentAnnounceDeliveryResult>;
}): Promise<SubagentAnnounceDeliveryResult>;
export {};
