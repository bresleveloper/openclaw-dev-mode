import type { Model } from "../../../llm/types.js";
import { calculateContextTokens, DEFAULT_COMPACTION_SETTINGS, estimateContextTokens, estimateTokens, findCutPoint, findTurnStartIndex, getLastAssistantUsage, serializeConversation, shouldCompact, type CompactionDetails, type CompactionPreparation, type CompactionResult, type CompactionSettings, type ContextUsageEstimate } from "../../runtime/index.js";
import type { AgentMessage, StreamFn, ThinkingLevel } from "../../runtime/index.js";
import type { SessionEntry } from "../session-manager.js";
export { calculateContextTokens, DEFAULT_COMPACTION_SETTINGS, estimateContextTokens, estimateTokens, findCutPoint, findTurnStartIndex, getLastAssistantUsage, serializeConversation, shouldCompact, type CompactionDetails, type CompactionPreparation, type CompactionResult, type CompactionSettings, type ContextUsageEstimate, };
/** Prepares session entries for compaction using the shared agent-core planner. */
export declare function prepareCompaction(pathEntries: SessionEntry[], settings: CompactionSettings): CompactionPreparation | undefined;
/** Generates a compaction summary through the shared agent-core runtime. */
export declare function generateSummary(currentMessages: AgentMessage[], model: Model, reserveTokens: number, apiKey: string | undefined, headers?: Record<string, string>, signal?: AbortSignal, customInstructions?: string, previousSummary?: string, thinkingLevel?: ThinkingLevel, streamFn?: StreamFn): Promise<string>;
/** Runs full compaction through agent-core and returns the compacted conversation result. */
export declare function compact(preparation: CompactionPreparation, model: Model, apiKey: string | undefined, headers?: Record<string, string>, customInstructions?: string, signal?: AbortSignal, thinkingLevel?: ThinkingLevel, streamFn?: StreamFn): Promise<CompactionResult>;
