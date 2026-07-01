import type { AgentMessage, StreamFn } from "../runtime/index.js";
type AssistantMessage = Extract<AgentMessage, {
    role: "assistant";
}>;
type RecoveryAssessment = "valid" | "incomplete-thinking" | "incomplete-text";
type AnthropicThinkingRecovery = {
    originalMessages: AgentMessage[];
    cleanedMessages: AgentMessage[];
};
type RecoverySessionMeta = {
    id: string;
    recoveredAnthropicThinking?: boolean;
    onRecoveredAnthropicThinking?: (recovery: AnthropicThinkingRecovery) => void | Promise<void>;
};
export declare const OMITTED_ASSISTANT_REASONING_TEXT = "[assistant reasoning omitted]";
export declare function isAssistantMessageWithContent(message: AgentMessage): message is AssistantMessage;
/**
 * Strip all thinking signature fields from a single assistant message.
 *
 * Removes thinkingSignature / signature / thought_signature from thinking blocks and
 * data from redacted_thinking blocks. Thinking text is preserved. If the message
 * becomes thinking-only with no signatures, the downstream stripInvalidThinkingSignatures
 * will convert those unsigned blocks to placeholder text.
 *
 * Returns the original reference when nothing was stripped.
 */
export declare function stripThinkingSignaturesFromMessage(message: AgentMessage): AgentMessage;
/**
 * Strip thinking signatures from assistant messages that predate the latest compaction.
 *
 * Pre-compaction thinking signatures are cryptographically bound to the original context
 * prefix. After compaction the prefix changes (summarized content is replaced by the
 * compaction summary) so those signatures are stale and Anthropic rejects them with
 * "Invalid signature in thinking block". The existing stripInvalidThinkingSignatures only
 * catches absent/blank signatures; this function catches contextually stale ones identified
 * by timestamp comparison with the latest compaction summary.
 *
 * Only strips from assistant messages whose timestamp is strictly before the latest
 * compaction summary timestamp. Messages at or after that timestamp may have been generated
 * in the new context and retain their signatures. Messages with no parseable timestamp are
 * left unchanged.
 *
 * Returns the original array reference when nothing was changed.
 */
export declare function stripStaleThinkingSignaturesForCompactionReplay(messages: AgentMessage[]): AgentMessage[];
/**
 * Strip thinking blocks with clearly invalid replay signatures.
 *
 * Anthropic and Bedrock reject persisted thinking blocks when the signature is
 * absent, empty, or blank. They are also the authority for opaque signature
 * validity, so this intentionally avoids local length or shape heuristics.
 *
 * By default, the latest assistant turn is exempt: providers reject modified
 * latest thinking blocks, so corrupted latest turns must flow through recovery
 * rather than being rewritten before the request. Callers that append a new
 * user turn before provider replay can disable that exemption because the
 * stored assistant turn is no longer latest in the outbound request.
 */
export declare function stripInvalidThinkingSignatures(messages: AgentMessage[], options?: {
    preserveLatestAssistant?: boolean;
}): AgentMessage[];
/**
 * Strip `type: "thinking"` and `type: "redacted_thinking"` content blocks from
 * all assistant messages except the latest one.
 *
 * Thinking blocks in the latest assistant turn are preserved verbatim so
 * providers that require replay signatures can continue the conversation.
 *
 * If a non-latest assistant message becomes empty after stripping, it is
 * replaced with a synthetic non-empty text block to preserve turn structure
 * through provider adapters that filter blank text blocks.
 *
 * Returns the original array reference when nothing was changed (callers can
 * use reference equality to skip downstream work).
 */
export declare function dropThinkingBlocks(messages: AgentMessage[]): AgentMessage[];
export declare function shouldPreserveLatestAssistantThinking(messages: AgentMessage[]): boolean;
export declare function stripThinkingBlocksFromMessage(message: AgentMessage): AgentMessage;
export declare function dropReasoningFromHistory(messages: AgentMessage[]): AgentMessage[];
export declare function assessLastAssistantMessage(message: AgentMessage): RecoveryAssessment;
export declare function wrapAnthropicStreamWithRecovery(innerStreamFn: StreamFn, sessionMeta: RecoverySessionMeta): StreamFn;
export {};
