import { type SubagentLifecycleEndedReason } from "./subagent-lifecycle-events.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
type DeferredCleanupDecision = {
    kind: "defer-descendants";
    delayMs: number;
} | {
    kind: "give-up";
    reason: "retry-limit" | "expiry";
    retryCount?: number;
} | {
    kind: "retry";
    retryCount: number;
    resumeDelayMs?: number;
};
/** Resolve the lifecycle ended reason used when cleaning up a subagent run. */
export declare function resolveCleanupCompletionReason(entry: SubagentRunRecord): SubagentLifecycleEndedReason;
/** Decide whether deferred subagent cleanup should retry, defer, or give up. */
export declare function resolveDeferredCleanupDecision(params: {
    entry: SubagentRunRecord;
    now: number;
    activeDescendantRuns: number;
    announceExpiryMs: number;
    announceCompletionHardExpiryMs: number;
    maxAnnounceRetryCount: number;
    deferDescendantDelayMs: number;
    resolveAnnounceRetryDelayMs: (retryCount: number) => number;
}): DeferredCleanupDecision;
export {};
