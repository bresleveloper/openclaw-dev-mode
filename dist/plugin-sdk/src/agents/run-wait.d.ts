import { callGateway } from "../gateway/call.js";
import { type AgentRunTimeoutPhase } from "./run-timeout-attribution.js";
type GatewayCaller = typeof callGateway;
/** Latest assistant reply plus a stable fingerprint for baseline comparisons. */
export type AssistantReplySnapshot = {
    text?: string;
    fingerprint?: string;
};
/** Normalized terminal or pending state returned by `agent.wait`. */
export type AgentWaitResult = {
    status: "ok" | "timeout" | "error" | "pending";
    error?: string;
    startedAt?: number;
    endedAt?: number;
    stopReason?: string;
    livenessState?: string;
    yielded?: boolean;
    pendingError?: boolean;
    timeoutPhase?: AgentRunTimeoutPhase;
    providerStarted?: boolean;
};
/** Summary returned after waiting for a dynamic set of pending runs to drain. */
export type AgentRunsDrainResult = {
    timedOut: boolean;
    pendingRunIds: string[];
    deadlineAtMs: number;
};
/** Return true for transient gateway/transport failures that callers may retry. */
export declare function isRecoverableAgentWaitError(error: string | undefined): boolean;
/** Read the latest non-tool assistant message for a session. */
export declare function readLatestAssistantReplySnapshot(params: {
    sessionKey: string;
    limit?: number;
    callGateway?: GatewayCaller;
}): Promise<AssistantReplySnapshot>;
/** Read only the latest assistant text for call sites that do not need fingerprints. */
export declare function readLatestAssistantReply(params: {
    sessionKey: string;
    limit?: number;
    callGateway?: GatewayCaller;
}): Promise<string | undefined>;
/** Wait for one agent run through the gateway and normalize timeout/error states. */
export declare function waitForAgentRun(params: {
    runId: string;
    timeoutMs: number;
    callGateway?: GatewayCaller;
}): Promise<AgentWaitResult>;
/** Wait for a run and return a reply only when it differs from the supplied baseline. */
export declare function waitForAgentRunAndReadUpdatedAssistantReply(params: {
    runId: string;
    sessionKey: string;
    timeoutMs: number;
    limit?: number;
    baseline?: AssistantReplySnapshot;
    callGateway?: GatewayCaller;
}): Promise<AgentWaitResult & {
    replyText?: string;
}>;
/** Wait until the current and newly spawned pending run IDs are drained or timed out. */
export declare function waitForAgentRunsToDrain(params: {
    getPendingRunIds: () => Iterable<string>;
    initialPendingRunIds?: Iterable<string>;
    timeoutMs?: number;
    deadlineAtMs?: number;
    callGateway?: GatewayCaller;
}): Promise<AgentRunsDrainResult>;
/** Test-only dependency injection for gateway calls. */
export declare const testing: {
    setDepsForTest(overrides?: Partial<{
        callGateway: GatewayCaller;
    }>): void;
};
export { testing as __testing };
