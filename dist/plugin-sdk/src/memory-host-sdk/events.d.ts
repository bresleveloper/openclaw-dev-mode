import type { MemoryDreamingPhaseName } from "./dreaming.js";
/** Workspace-relative JSONL audit log for memory recall, promotion, and dream events. */
export declare const MEMORY_HOST_EVENT_LOG_RELATIVE_PATH: string;
/** Event emitted when a recall query records the selected memory snippets. */
export type MemoryHostRecallRecordedEvent = {
    type: "memory.recall.recorded";
    timestamp: string;
    query: string;
    resultCount: number;
    results: Array<{
        path: string;
        startLine: number;
        endLine: number;
        score: number;
    }>;
};
/** Event emitted when recall hits are visible but excluded from short-term promotion. */
export type MemoryHostRecallSkippedEvent = {
    type: "memory.recall.skipped";
    timestamp: string;
    query: string;
    reason: "non-short-term-memory-path";
    eligibleResultCount: number;
    skippedResultCount: number;
    results: Array<{
        path: string;
        startLine: number;
        endLine: number;
        score: number;
        reason: "non-short-term-memory-path";
    }>;
};
/** Event emitted when deep-dream candidates are promoted into durable memory. */
export type MemoryHostPromotionAppliedEvent = {
    type: "memory.promotion.applied";
    timestamp: string;
    memoryPath: string;
    applied: number;
    candidates: Array<{
        key: string;
        path: string;
        startLine: number;
        endLine: number;
        score: number;
        recallCount: number;
    }>;
};
/** Event emitted after a dreaming phase writes inline memory and/or reports. */
export type MemoryHostDreamCompletedEvent = {
    type: "memory.dream.completed";
    timestamp: string;
    phase: MemoryDreamingPhaseName;
    inlinePath?: string;
    reportPath?: string;
    lineCount: number;
    storageMode: "inline" | "separate" | "both";
};
/** Append-only memory host event schema stored as JSONL. */
export type MemoryHostEvent = MemoryHostRecallRecordedEvent | MemoryHostPromotionAppliedEvent | MemoryHostDreamCompletedEvent;
/** Full event-log record schema, including opt-in diagnostic variants. */
export type MemoryHostEventRecord = MemoryHostEvent | MemoryHostRecallSkippedEvent;
/** Resolve the event log path inside a workspace without touching the filesystem. */
export declare function resolveMemoryHostEventLogPath(workspaceDir: string): string;
/** Append one memory host event, creating the dreams directory with symlink-safe writes. */
export declare function appendMemoryHostEvent(workspaceDir: string, event: MemoryHostEventRecord): Promise<void>;
/** Read recent memory host events, ignoring corrupt JSONL lines left by partial writes. */
export declare function readMemoryHostEvents(params: {
    workspaceDir: string;
    limit?: number;
}): Promise<MemoryHostEvent[]>;
/** Read recent memory host event records, including opt-in diagnostic variants. */
export declare function readMemoryHostEventRecords(params: {
    workspaceDir: string;
    limit?: number;
}): Promise<MemoryHostEventRecord[]>;
