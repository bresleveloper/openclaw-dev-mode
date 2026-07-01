/**
 * Summarization and fallback helpers for transcript compaction.
 */
import type { AgentCompactionIdentifierPolicy } from "../config/types.agent-defaults.js";
import { BASE_CHUNK_RATIO, chunkMessagesByMaxTokens, computeAdaptiveChunkRatio, estimateMessagesTokens, isOversizedForSummary, MIN_CHUNK_RATIO, pruneHistoryForContextShare, SAFETY_MARGIN, splitMessagesByTokenShare, SUMMARIZATION_OVERHEAD_TOKENS } from "./compaction-planning.js";
import type { AgentMessage } from "./runtime/index.js";
import type { ExtensionContext } from "./sessions/index.js";
export { BASE_CHUNK_RATIO, chunkMessagesByMaxTokens, computeAdaptiveChunkRatio, estimateMessagesTokens, isOversizedForSummary, MIN_CHUNK_RATIO, pruneHistoryForContextShare, SAFETY_MARGIN, splitMessagesByTokenShare, SUMMARIZATION_OVERHEAD_TOKENS, };
/** Optional instruction policy for preserving identifiers during compaction. */
export type CompactionSummarizationInstructions = {
    identifierPolicy?: AgentCompactionIdentifierPolicy;
    identifierInstructions?: string;
};
/** Combines identifier-preservation and caller-provided compaction instructions. */
export declare function buildCompactionSummarizationInstructions(customInstructions?: string, instructions?: CompactionSummarizationInstructions): string | undefined;
/**
 * Summarize with progressive fallback for handling oversized messages.
 * If full summarization fails, tries partial summarization excluding oversized messages.
 */
export declare function summarizeWithFallback(params: {
    messages: AgentMessage[];
    model: NonNullable<ExtensionContext["model"]>;
    apiKey: string;
    headers?: Record<string, string>;
    signal: AbortSignal;
    reserveTokens: number;
    maxChunkTokens: number;
    contextWindow: number;
    customInstructions?: string;
    summarizationInstructions?: CompactionSummarizationInstructions;
    previousSummary?: string;
}): Promise<string>;
/** Summarizes history in multiple stages when a single pass would be too large. */
export declare function summarizeInStages(params: {
    messages: AgentMessage[];
    model: NonNullable<ExtensionContext["model"]>;
    apiKey: string;
    headers?: Record<string, string>;
    signal: AbortSignal;
    reserveTokens: number;
    maxChunkTokens: number;
    contextWindow: number;
    customInstructions?: string;
    summarizationInstructions?: CompactionSummarizationInstructions;
    previousSummary?: string;
    parts?: number;
    minMessagesForSplit?: number;
}): Promise<string>;
/** Resolves a positive context-window token count from model metadata. */
export declare function resolveContextWindowTokens(model?: ExtensionContext["model"]): number;
