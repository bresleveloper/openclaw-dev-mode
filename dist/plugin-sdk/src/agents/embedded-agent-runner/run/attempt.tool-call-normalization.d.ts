import type { AgentMessage, StreamFn } from "../../runtime/index.js";
import { type ToolCallIdMode } from "../../tool-call-id.js";
import type { TranscriptPolicy } from "../../transcript-policy.js";
/** Promotes standalone plain-text tool-call replies into structured toolCall blocks when safe. */
export declare function wrapStreamFnPromoteStandaloneTextToolCalls(baseFn: StreamFn, allowedToolNames?: Set<string>): StreamFn;
/** Normalizes streamed tool-call names and guards repeated unknown-tool loops. */
export declare function wrapStreamFnTrimToolCallNames(baseFn: StreamFn, allowedToolNames?: Set<string>, guardOptions?: {
    unknownToolThreshold?: number;
}): StreamFn;
type ReplayToolCallIdSanitizerDecision = {
    sanitizeToolCallIds: boolean;
    toolCallIdMode?: ToolCallIdMode;
    isOpenAIResponsesApi: boolean;
};
/** Returns whether replayed tool-call ids should be sanitized for non-Responses providers. */
export declare function shouldApplyReplayToolCallIdSanitizer(params: ReplayToolCallIdSanitizerDecision): params is ReplayToolCallIdSanitizerDecision & {
    toolCallIdMode: ToolCallIdMode;
};
/** Rewrites replayed tool-call ids into provider-safe ids and optionally repairs result pairing. */
export declare function sanitizeReplayToolCallIdsForStream(params: {
    messages: AgentMessage[];
    mode: ToolCallIdMode;
    allowedToolNames?: Set<string>;
    preserveNativeAnthropicToolUseIds?: boolean;
    duplicateToolCallIdStyle?: "openai";
    preserveReplaySafeThinkingToolCallIds?: boolean;
    repairToolUseResultPairing?: boolean;
}): AgentMessage[];
/** Downgrades OpenAI Responses replay turns into the stream format expected by runtime callers. */
export declare function sanitizeOpenAIResponsesReplayForStream(messages: AgentMessage[]): AgentMessage[];
/**
 * Sanitizes malformed replay tool calls before provider submission. The wrapper
 * drops invalid assistant tool calls, repairs adjacent tool results when needed,
 * strips trailing assistant prefill turns for strict providers, and revalidates
 * Anthropic/Gemini transcripts after mutations.
 */
export declare function wrapStreamFnSanitizeMalformedToolCalls(baseFn: StreamFn, allowedToolNames?: Set<string>, transcriptPolicy?: Pick<TranscriptPolicy, "validateGeminiTurns" | "validateAnthropicTurns" | "preserveSignatures" | "dropThinkingBlocks">, provider?: string | null): StreamFn;
export {};
