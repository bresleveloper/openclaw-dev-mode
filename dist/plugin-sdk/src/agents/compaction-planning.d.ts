import type { AgentMessage } from "./runtime/index.js";
/** Default share of context window targeted for compaction chunks. */
export declare const BASE_CHUNK_RATIO = 0.4;
/** Lower bound for adaptive compaction chunk sizing. */
export declare const MIN_CHUNK_RATIO = 0.15;
/** Buffer for estimateTokens() inaccuracy. */
export declare const SAFETY_MARGIN = 1.2;
/**
 * Overhead reserved for summary prompt, system prompt, prior summary, wrapper
 * tags, and high-reasoning summary generation.
 */
export declare const SUMMARIZATION_OVERHEAD_TOKENS = 4096;
/** Decision for whether a summarization stage should run as one chunk or multiple chunks. */
export type StageSplitPlan = {
    mode: "single";
} | {
    mode: "split";
    chunks: AgentMessage[][];
};
/** Messages safe to summarize plus notes for messages too large to fit in a summary request. */
export type OversizedFallbackPlan = {
    smallMessages: AgentMessage[];
    oversizedNotes: string[];
};
/** Token accounting and optional prune result for preserving context-window headroom. */
export type HistoryPrunePlan = {
    summarizableTokens: number;
    newContentTokens: number;
    maxHistoryTokens: number;
    pruned?: ReturnType<typeof pruneHistoryForContextShare>;
};
/** Estimates compaction tokens after removing fields that must not reach summarization. */
export declare function estimateMessagesTokens(messages: AgentMessage[]): number;
/** Removes runtime-only context and tool-result details before token estimates or summaries. */
export declare function sanitizeCompactionMessages(messages: AgentMessage[]): AgentMessage[];
/** Estimates one message using the same sanitization path as multi-message planning. */
export declare function estimateCompactionMessageTokens(message: AgentMessage): number;
/** Clamps requested split parts to a usable count for the available messages. */
export declare function normalizeCompactionParts(parts: number, messageCount: number): number;
/** Splits messages into roughly equal token-share chunks without separating active tool pairs. */
export declare function splitMessagesByTokenShare(messages: AgentMessage[], parts?: number): AgentMessage[][];
/** Chunks messages by a max-token budget while applying the shared estimator safety margin. */
export declare function chunkMessagesByMaxTokens(messages: AgentMessage[], maxTokens: number): AgentMessage[][];
/**
 * Compute adaptive chunk ratio based on average message size.
 * When messages are large, we use smaller chunks to avoid exceeding model limits.
 */
export declare function computeAdaptiveChunkRatio(messages: AgentMessage[], contextWindow: number): number;
/**
 * Check if a single message is too large to summarize.
 * If single message > 50% of context, it can't be summarized safely.
 */
export declare function isOversizedForSummary(msg: AgentMessage, contextWindow: number): boolean;
/** Builds sanitized chunks for summarization prompts. */
export declare function buildSummaryChunks(params: {
    messages: AgentMessage[];
    maxChunkTokens: number;
}): AgentMessage[][];
/** Separates messages too large to summarize and emits compact placeholder notes for them. */
export declare function buildOversizedFallbackPlan(params: {
    messages: AgentMessage[];
    contextWindow: number;
}): OversizedFallbackPlan;
/** Plans whether to split a summarization stage based on message count and token budget. */
export declare function buildStageSplitPlan(params: {
    messages: AgentMessage[];
    maxChunkTokens: number;
    parts?: number;
    minMessagesForSplit?: number;
}): StageSplitPlan;
/** Drops oldest token-share chunks until history fits the requested context share. */
export declare function pruneHistoryForContextShare(params: {
    messages: AgentMessage[];
    maxContextTokens: number;
    maxHistoryShare?: number;
    parts?: number;
    mode?: "share" | "handoff";
}): {
    messages: AgentMessage[];
    droppedMessagesList: AgentMessage[];
    droppedChunks: number;
    droppedMessages: number;
    droppedTokens: number;
    keptTokens: number;
    budgetTokens: number;
};
/** Computes whether new content exceeds the history budget and plans pruning when needed. */
export declare function buildHistoryPrunePlan(params: {
    messagesToSummarize: AgentMessage[];
    turnPrefixMessages: AgentMessage[];
    tokensBefore: number;
    contextWindowTokens: number;
    maxHistoryShare: number;
    parts?: number;
}): HistoryPrunePlan;
