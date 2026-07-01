import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AgentMessage } from "../runtime/index.js";
import { type SessionWriteLockAcquireTimeoutConfig } from "../session-write-lock.js";
import { SessionManager } from "../sessions/index.js";
/**
 * Low-context default cap for a single live tool result text block.
 *
 * The session runtime already truncates tool results aggressively when serializing old history
 * for compaction summaries. For the live request path we still keep a bounded
 * request-local ceiling so oversized tool output cannot dominate the next turn.
 */
export declare const DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS = 16000;
type ToolResultTruncationOptions = {
    suffix?: string | ((truncatedChars: number) => string);
    minKeepChars?: number;
};
/**
 * Truncate a single text string to fit within maxChars.
 *
 * Uses a head+tail strategy when the tail contains important content
 * (errors, results, JSON structure), otherwise preserves the beginning.
 * This ensures error messages and summaries at the end of tool output
 * aren't lost during truncation.
 */
export declare function truncateToolResultText(text: string, maxChars: number, options?: ToolResultTruncationOptions): string;
/**
 * Calculate the maximum allowed characters for a single tool result
 * based on the model's context window tokens.
 *
 * Uses a rough 4 chars ≈ 1 token heuristic (conservative for English text;
 * actual ratio varies by tokenizer).
 */
export declare function calculateMaxToolResultChars(contextWindowTokens: number): number;
export declare function resolveAutoLiveToolResultMaxChars(contextWindowTokens: number): number;
export declare function calculateMaxToolResultCharsWithCap(contextWindowTokens: number, hardCapChars: number): number;
export declare function resolveLiveToolResultMaxChars(params: {
    contextWindowTokens: number;
    cfg?: OpenClawConfig;
    agentId?: string | null;
}): number;
/**
 * Get the total character count of text content blocks in a tool result message.
 */
export declare function getToolResultTextLength(msg: AgentMessage): number;
/**
 * Truncate a tool result message's text content blocks to fit within maxChars.
 * Returns a new message (does not mutate the original).
 */
export declare function truncateToolResultMessage(msg: AgentMessage, maxChars: number, options?: ToolResultTruncationOptions): AgentMessage;
/**
 * Truncate oversized tool results in an array of messages (in-memory).
 * Returns a new array with truncated messages.
 *
 * This is used as a pre-emptive guard before sending messages to the LLM,
 * without modifying the session file.
 */
export declare function truncateOversizedToolResultsInMessages(messages: AgentMessage[], contextWindowTokens: number, maxCharsOverride?: number, aggregateMaxCharsOverride?: number, projectionState?: ToolResultPromptProjectionState): {
    messages: AgentMessage[];
    truncatedCount: number;
};
type ToolResultReductionPotential = {
    maxChars: number;
    aggregateBudgetChars: number;
    toolResultCount: number;
    totalToolResultChars: number;
    oversizedCount: number;
    oversizedReducibleChars: number;
    aggregateReducibleChars: number;
    maxReducibleChars: number;
};
export type ToolResultPromptProjectionState = {
    replacements: Map<string, AgentMessage>;
    frozen: Set<string>;
    ambiguousBaseKeys: Set<string>;
    sourceTextByKey: Map<string, string[]>;
};
export declare function createToolResultPromptProjectionState(): ToolResultPromptProjectionState;
export declare function estimateToolResultReductionPotential(params: {
    messages: AgentMessage[];
    contextWindowTokens: number;
    maxCharsOverride?: number;
    aggregateMaxCharsOverride?: number;
}): ToolResultReductionPotential;
export declare function truncateOversizedToolResultsInSessionManager(params: {
    sessionManager: SessionManager;
    contextWindowTokens: number;
    maxCharsOverride?: number;
    aggregateMaxCharsOverride?: number;
    sessionFile?: string;
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
}): {
    truncated: boolean;
    truncatedCount: number;
    reason?: string;
};
/**
 * Truncates a named transcript file artifact.
 */
export declare function truncateOversizedToolResultsInSession(params: {
    sessionFile: string;
    contextWindowTokens: number;
    maxCharsOverride?: number;
    aggregateMaxCharsOverride?: number;
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
    config?: SessionWriteLockAcquireTimeoutConfig;
}): Promise<{
    truncated: boolean;
    truncatedCount: number;
    reason?: string;
}>;
export declare function sessionLikelyHasOversizedToolResults(params: {
    messages: AgentMessage[];
    contextWindowTokens: number;
    maxCharsOverride?: number;
}): boolean;
export {};
