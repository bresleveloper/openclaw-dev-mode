import { type ActiveEmbeddedRunSnapshot, type AbandonedEmbeddedRun, type EmbeddedAgentQueueHandle, type EmbeddedAgentQueueMessageOptions } from "./run-state.js";
export { getActiveEmbeddedRunCount, listActiveEmbeddedRunSessionIds, listActiveEmbeddedRunSessionKeys, resolveActiveEmbeddedRunSessionId, type ActiveEmbeddedRunSnapshot, type EmbeddedAgentQueueHandle, type EmbeddedAgentQueueMessageOptions, } from "./run-state.js";
export type EmbeddedAgentQueueFailureReason = "no_active_run" | "not_streaming" | "compacting" | "source_reply_delivery_mode_mismatch" | "transcript_commit_wait_unsupported" | "runtime_rejected";
export type EmbeddedAgentQueueMessageOutcome = {
    queued: true;
    sessionId: string;
    target: "embedded_run" | "reply_run";
    gatewayHealth: "live";
    deliveredAtMs?: number;
    enqueuedAtMs?: number;
} | {
    queued: false;
    sessionId: string;
    reason: EmbeddedAgentQueueFailureReason;
    gatewayHealth: "live";
    errorMessage?: string;
};
export declare function formatEmbeddedAgentQueueFailureSummary(outcome: EmbeddedAgentQueueMessageOutcome): string | undefined;
export declare function clearEmbeddedRunAbandonment(params: {
    sessionId?: string;
    sessionKey?: string;
    sessionFile?: string;
}): void;
export declare function markEmbeddedRunAbandoned(params: {
    sessionId: string;
    sessionKey?: string;
    sessionFile?: string;
    reason: AbandonedEmbeddedRun["reason"];
}): void;
export declare function markActiveEmbeddedRunAbandoned(params: {
    sessionId: string;
    handle: EmbeddedAgentQueueHandle;
    sessionKey?: string;
    sessionFile?: string;
    reason: AbandonedEmbeddedRun["reason"];
}): boolean;
export declare function isEmbeddedRunAbandoned(params: {
    sessionId?: string;
    sessionKey?: string;
    sessionFile?: string;
}): boolean;
/**
 * @deprecated Use queueEmbeddedAgentMessageWithOutcomeAsync for delivery decisions.
 * This boolean helper only reports immediate queue eligibility; it cannot surface
 * async runtime rejection from the active run.
 */
export declare function queueEmbeddedAgentMessage(sessionId: string, text: string, options?: EmbeddedAgentQueueMessageOptions): boolean;
/**
 * @deprecated Prefer queueEmbeddedAgentMessageWithOutcomeAsync when callers need to
 * know whether steering was accepted. This sync helper is fire-and-forget after
 * initial eligibility and only logs later runtime rejection.
 */
export declare function queueEmbeddedAgentMessageWithOutcome(sessionId: string, text: string, options?: EmbeddedAgentQueueMessageOptions): EmbeddedAgentQueueMessageOutcome;
export declare function queueEmbeddedAgentMessageWithOutcomeAsync(sessionId: string, text: string, options?: EmbeddedAgentQueueMessageOptions): Promise<EmbeddedAgentQueueMessageOutcome>;
/**
 * Abort embedded OpenClaw runs.
 *
 * - With a sessionId, aborts that single run.
 * - With no sessionId, supports targeted abort modes (for example, compacting runs only).
 */
export declare function abortEmbeddedAgentRun(sessionId: string): boolean;
export declare function abortEmbeddedAgentRun(sessionId: undefined, opts: {
    mode: "all" | "compacting";
    reason?: "restart";
}): boolean;
export declare function isEmbeddedAgentRunActive(sessionId: string): boolean;
export declare function isEmbeddedAgentRunHandleActive(sessionId: string): boolean;
export declare function isEmbeddedAgentRunAbortableForCompaction(sessionId: string): boolean;
export declare function isEmbeddedAgentRunStreaming(sessionId: string): boolean;
export declare function resolveActiveEmbeddedRunHandleSessionId(sessionKey: string): string | undefined;
export declare function resolveActiveEmbeddedRunHandleSessionIdBySessionFile(sessionFile: string): string | undefined;
export declare function resolveActiveEmbeddedRunSessionIdBySessionFile(sessionFile: string): string | undefined;
export declare function getActiveEmbeddedRunSnapshot(sessionId: string): ActiveEmbeddedRunSnapshot | undefined;
/**
 * Wait for active embedded runs to drain.
 *
 * Used during restarts so in-flight runs can release session write locks before
 * the next lifecycle starts. If no timeout is passed, waits indefinitely.
 */
export declare function waitForActiveEmbeddedRuns(timeoutMs?: number, opts?: {
    pollMs?: number;
}): Promise<{
    drained: boolean;
}>;
export declare function waitForEmbeddedAgentRunEnd(sessionId: string, timeoutMs?: number): Promise<boolean>;
export type AbortAndDrainEmbeddedAgentRunResult = {
    aborted: boolean;
    drained: boolean;
    forceCleared: boolean;
};
export declare function abortAndDrainEmbeddedAgentRun(params: {
    sessionId: string;
    sessionKey?: string;
    settleMs?: number;
    forceClear?: boolean;
    reason?: string;
}): Promise<AbortAndDrainEmbeddedAgentRunResult>;
export declare function setActiveEmbeddedRun(sessionId: string, handle: EmbeddedAgentQueueHandle, sessionKey?: string, sessionFile?: string): void;
export declare function updateActiveEmbeddedRunSnapshot(sessionId: string, snapshot: ActiveEmbeddedRunSnapshot): void;
export declare function updateActiveEmbeddedRunSessionFile(sessionId: string, sessionFile: string | undefined): void;
export declare function clearActiveEmbeddedRun(sessionId: string, handle: EmbeddedAgentQueueHandle, sessionKey?: string, sessionFile?: string): void;
export declare function forceClearEmbeddedAgentRun(sessionId: string, sessionKey?: string, reason?: string): boolean;
export declare const testing: {
    resetActiveEmbeddedRuns(): void;
};
export { testing as __testing };
