import type { SessionContextBudgetStatus } from "../../../config/sessions.js";
import type { AgentMessage } from "../../runtime/index.js";
import type { PreemptiveCompactionRoute } from "./preemptive-compaction.types.js";
export declare const PREEMPTIVE_OVERFLOW_ERROR_TEXT = "Context overflow: prompt too large for the model (precheck).";
/** Pre-prompt routing decision plus the budget facts used to explain it in logs and session state. */
export type PreemptiveCompactionDecision = {
    route: PreemptiveCompactionRoute;
    shouldCompact: boolean;
    estimatedPromptTokens: number;
    pressureSource?: string;
    promptBudgetBeforeReserve: number;
    overflowTokens: number;
    toolResultReducibleChars: number;
    effectiveReserveTokens: number;
};
/** Token pressure reported by the rendered provider-boundary prompt when available. */
export type LlmBoundaryTokenPressure = {
    estimatedPromptTokens: number;
    source: string;
    renderedChars?: number;
};
/**
 * Estimates the prompt pressure at the LLM boundary from transcript messages,
 * optional system prompt, and current prompt text. The result intentionally
 * includes a safety margin because this path runs before provider tokenization.
 */
export declare function estimateLlmBoundaryTokenPressure(params: {
    messages: AgentMessage[];
    systemPrompt?: string;
    prompt: string;
}): number;
/** Estimates only the rendered prompt/system portion when history has already been accounted for. */
export declare function estimateRenderedLlmBoundaryTokenPressure(params: {
    systemPrompt?: string;
    prompt: string;
}): number;
/**
 * Decides whether a run should compact before submitting the prompt, and
 * whether reducible tool results can avoid or follow compaction. Rendered LLM
 * boundary pressure wins over local transcript estimates when supplied.
 */
export declare function shouldPreemptivelyCompactBeforePrompt(params: {
    messages: AgentMessage[];
    unwindowedMessages?: AgentMessage[];
    systemPrompt?: string;
    prompt: string;
    contextTokenBudget: number;
    reserveTokens: number;
    toolResultMaxChars?: number;
    llmBoundaryTokenPressure?: LlmBoundaryTokenPressure;
}): PreemptiveCompactionDecision;
/** Formats the compact operator log line for one pre-prompt budget check. */
export declare function formatPrePromptPrecheckLog(params: {
    result: PreemptiveCompactionDecision;
    sessionKey?: string;
    sessionId?: string;
    provider: string;
    modelId: string;
    messageCount: number;
    unwindowedMessageCount?: number;
    contextTokenBudget: number;
    reserveTokens: number;
    sessionFile?: string;
}): string;
/** Converts the pre-prompt decision into the persisted session context-budget status record. */
export declare function buildPrePromptContextBudgetStatus(params: {
    result: PreemptiveCompactionDecision;
    provider: string;
    modelId: string;
    messageCount: number;
    unwindowedMessageCount?: number;
    contextTokenBudget: number;
    reserveTokens: number;
    sessionId?: string;
    now?: number;
}): SessionContextBudgetStatus;
