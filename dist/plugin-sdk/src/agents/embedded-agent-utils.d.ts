/**
 * Embedded-agent message text utilities.
 * Extracts visible assistant text, reasoning summaries, thinking-tag blocks,
 * and compact tool metadata for channel delivery and transcript replay.
 */
import type { AssistantMessage } from "../llm/types.js";
import type { AgentMessage } from "./runtime/index.js";
export { stripDowngradedToolCallText, stripMinimaxToolCallXml, } from "../shared/text/assistant-visible-text.js";
export { stripModelSpecialTokens } from "../shared/text/model-special-tokens.js";
/** Narrow an agent message to an assistant message. */
export declare function isAssistantMessage(msg: AgentMessage | undefined): msg is AssistantMessage;
/**
 * Strip thinking tags and their content from text.
 * This is a safety net for cases where the model outputs <think> tags
 * that slip through other filtering mechanisms.
 */
export declare function stripThinkingTagsFromText(text: string): string;
export declare function sanitizeAssistantVisibleStreamText(text: string): string;
/** Extract text intended for users, preferring explicit final-answer phase blocks. */
export declare function extractAssistantVisibleText(msg: AssistantMessage): string;
/** Extract sanitized assistant text across all text content blocks. */
export declare function extractAssistantText(msg: AssistantMessage): string;
/** Extract native thinking block text or a placeholder when only signed reasoning exists. */
export declare function extractAssistantThinking(msg: AssistantMessage): string;
/** Format reasoning text for markdown-friendly channel surfaces. */
export declare function formatReasoningMessage(text: string): string;
type ThinkTaggedSplitBlock = {
    type: "thinking";
    thinking: string;
} | {
    type: "text";
    text: string;
};
/** Global regex used to scan provider-emitted thinking tags. */
export declare const THINKING_TAG_SCAN_RE: RegExp;
/** Split text that starts with thinking tags into structured thinking/text blocks. */
export declare function splitThinkingTaggedText(text: string): ThinkTaggedSplitBlock[] | null;
/** Promote inline thinking-tag text blocks into native thinking blocks in place. */
export declare function promoteThinkingTagsToBlocks(message: AssistantMessage): void;
/** Extract closed thinking-tag content from a complete text payload. */
export declare function extractThinkingFromTaggedText(text: string): string;
/** Extract thinking-tag content from a possibly incomplete streaming payload. */
export declare function extractThinkingFromTaggedStream(text: string): string;
/** Infer compact display metadata for a tool call from its args. */
export declare function inferToolMetaFromArgs(toolName: string, args: unknown, options?: {
    detailMode?: "explain" | "raw";
}): string | undefined;
