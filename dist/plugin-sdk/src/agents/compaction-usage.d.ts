/**
 * Shared helpers for clearing assistant usage snapshots invalidated by
 * transcript compaction.
 */
import type { AgentMessage } from "./runtime/index.js";
export declare function stripStaleAssistantUsageBeforeLatestCompaction<TMessage extends AgentMessage>(messages: TMessage[], options?: {
    mutate?: boolean;
    whenMissingCompactionSummary?: "preserve" | "zeroAssistantUsage";
}): TMessage[];
