export declare const ANTHROPIC_OMITTED_REASONING_TEXT = "[assistant reasoning omitted]";
/**
 * Anthropic tool results continue the preceding assistant turn. Preserve that
 * turn's signed thinking even when the next request disables new thinking.
 */
export declare function findActiveAnthropicToolTurnAssistantIndex(messages: readonly unknown[]): number;
