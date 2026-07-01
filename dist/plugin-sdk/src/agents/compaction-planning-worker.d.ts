import { type HistoryPrunePlan, type OversizedFallbackPlan, type StageSplitPlan } from "./compaction-planning.js";
import type { CompactionPlanningWorkerInput, CompactionPlanningWorkerValue } from "./compaction-planning.worker.js";
import type { AgentMessage } from "./runtime/index.js";
declare class CompactionPlanningWorkerError extends Error {
    readonly code: "unavailable" | "timeout" | "failed";
    constructor(message: string, code: "unavailable" | "timeout" | "failed");
}
declare function resolveCompactionPlanningWorkerUrl(currentModuleUrl?: string): URL;
declare function runCompactionPlanningWorker(params: {
    input: CompactionPlanningWorkerInput;
    signal?: AbortSignal;
    timeoutMs?: number;
    workerUrl?: URL;
}): Promise<CompactionPlanningWorkerValue>;
/** Builds summary chunks, offloading large histories to the planning worker. */
export declare function buildSummaryChunksWithWorker(params: {
    messages: AgentMessage[];
    maxChunkTokens: number;
    signal?: AbortSignal;
}): Promise<AgentMessage[][]>;
/** Builds an oversized-message fallback plan, using the worker when worthwhile. */
export declare function buildOversizedFallbackPlanWithWorker(params: {
    messages: AgentMessage[];
    contextWindow: number;
    signal?: AbortSignal;
}): Promise<OversizedFallbackPlan>;
/** Builds a staged summarization split plan with worker fallback. */
export declare function buildStageSplitPlanWithWorker(params: {
    messages: AgentMessage[];
    maxChunkTokens: number;
    parts?: number;
    minMessagesForSplit?: number;
    signal?: AbortSignal;
}): Promise<StageSplitPlan>;
/** Builds a history-pruning plan with worker fallback for large transcripts. */
export declare function buildHistoryPrunePlanWithWorker(params: {
    messagesToSummarize: AgentMessage[];
    turnPrefixMessages: AgentMessage[];
    tokensBefore: number;
    contextWindowTokens: number;
    maxHistoryShare: number;
    parts?: number;
    signal?: AbortSignal;
}): Promise<HistoryPrunePlan>;
/** Computes the adaptive compaction chunk ratio with worker fallback. */
export declare function computeAdaptiveChunkRatioWithWorker(params: {
    messages: AgentMessage[];
    contextWindow: number;
    signal?: AbortSignal;
}): Promise<number>;
/** Test-only worker internals for URL resolution and error-path coverage. */
export declare const compactionPlanningWorkerTesting: {
    resolveCompactionPlanningWorkerUrl: typeof resolveCompactionPlanningWorkerUrl;
    runCompactionPlanningWorker: typeof runCompactionPlanningWorker;
    CompactionPlanningWorkerError: typeof CompactionPlanningWorkerError;
};
export {};
