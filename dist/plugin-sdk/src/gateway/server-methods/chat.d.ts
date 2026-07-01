import type { GatewayRequestHandlers } from "./types.js";
export { augmentChatHistoryWithCanvasBlocks, DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS, dropPreSessionStartAnnouncePairs, resolveEffectiveChatHistoryMaxChars, sanitizeChatHistoryMessages, } from "../chat-display-projection.js";
export { sanitizeChatSendMessageInput } from "../chat-input-sanitize.js";
export declare const CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES: number;
export declare function buildOversizedHistoryPlaceholder(message?: unknown): Record<string, unknown>;
export declare function replaceOversizedChatHistoryMessages(params: {
    messages: unknown[];
    maxSingleMessageBytes: number;
}): {
    messages: unknown[];
    replacedCount: number;
};
export declare function enforceChatHistoryFinalBudget(params: {
    messages: unknown[];
    maxBytes: number;
}): {
    messages: unknown[];
    placeholderCount: number;
};
export declare const chatHandlers: GatewayRequestHandlers;
