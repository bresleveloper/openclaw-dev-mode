import { type HistoryPrunePlan, type OversizedFallbackPlan, type StageSplitPlan } from "./compaction-planning.js";
import type { AgentMessage } from "./runtime/index.js";
/** Serializable request accepted by the compaction planning worker. */
export type CompactionPlanningWorkerInput = {
    kind: "summaryChunks";
    messages: AgentMessage[];
    maxChunkTokens: number;
} | {
    kind: "oversizedFallback";
    messages: AgentMessage[];
    contextWindow: number;
} | {
    kind: "stageSplit";
    messages: AgentMessage[];
    maxChunkTokens: number;
    parts?: number;
    minMessagesForSplit?: number;
} | {
    kind: "historyPrune";
    messagesToSummarize: AgentMessage[];
    turnPrefixMessages: AgentMessage[];
    tokensBefore: number;
    contextWindowTokens: number;
    maxHistoryShare: number;
    parts?: number;
} | {
    kind: "adaptiveChunkRatio";
    messages: AgentMessage[];
    contextWindow: number;
};
/** Serializable successful value returned by the compaction planning worker. */
export type CompactionPlanningWorkerValue = {
    kind: "summaryChunks";
    chunks: AgentMessage[][];
} | ({
    kind: "oversizedFallback";
} & OversizedFallbackPlan) | ({
    kind: "stageSplit";
} & StageSplitPlan) | ({
    kind: "historyPrune";
} & HistoryPrunePlan) | {
    kind: "adaptiveChunkRatio";
    ratio: number;
};
/** Serializable success/failure envelope posted by the worker. */
export type CompactionPlanningWorkerResult = {
    status: "ok";
    value: CompactionPlanningWorkerValue;
} | {
    status: "failed";
    error: string;
};
/** Run one compaction planning request and return a serializable result. */
export declare function runCompactionPlanningWorkerInput(input: unknown): CompactionPlanningWorkerResult;
