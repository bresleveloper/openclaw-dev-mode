import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
import { type SubagentRunOrphanReason } from "./subagent-session-reconciliation.js";
export { getSubagentSessionRuntimeMs, getSubagentSessionStartedAt, resolveSubagentSessionStatus, } from "./subagent-session-metrics.js";
export declare const MIN_ANNOUNCE_RETRY_DELAY_MS = 1000;
export declare const MAX_ANNOUNCE_RETRY_COUNT = 3;
export declare const ANNOUNCE_EXPIRY_MS: number;
export declare const ANNOUNCE_COMPLETION_HARD_EXPIRY_MS: number;
/** Caps frozen completion text stored for later announce/recovery delivery. */
export declare function capFrozenResultText(resultText: string): string;
/** Computes bounded exponential backoff for subagent announce retries. */
export declare function resolveAnnounceRetryDelayMs(retryCount: number): number;
/** Logs a sanitized final give-up line for failed subagent announce delivery. */
export declare function logAnnounceGiveUp(entry: SubagentRunRecord, reason: "retry-limit" | "expiry"): void;
/** Persists child session timing/status derived from the subagent registry row. */
export declare function persistSubagentSessionTiming(entry: SubagentRunRecord): Promise<void>;
/** Best-effort async removal for a subagent attachment directory. */
export declare function safeRemoveAttachmentsDir(entry: SubagentRunRecord): Promise<void>;
/** Marks an orphaned registry run finished, cleans attachments, and removes it. */
export declare function reconcileOrphanedRun(params: {
    runId: string;
    entry: SubagentRunRecord;
    reason: SubagentRunOrphanReason;
    source: "restore" | "resume";
    runs: Map<string, SubagentRunRecord>;
    resumedRuns: Set<string>;
}): boolean;
/** Reconciles orphaned runs found when restoring persisted subagent registry state. */
export declare function reconcileOrphanedRestoredRuns(params: {
    runs: Map<string, SubagentRunRecord>;
    resumedRuns: Set<string>;
}): boolean;
/** Resolves the completed subagent archive delay from config. */
export declare function resolveArchiveAfterMs(cfg?: OpenClawConfig): number | undefined;
