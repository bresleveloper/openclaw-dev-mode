export declare const DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS = 8000;
/** Resolve the text cap used when projecting chat history for display. */
export declare function resolveEffectiveChatHistoryMaxChars(_cfg: unknown, maxChars?: number): number;
/** Return true for known tool-call/tool-result block type spellings in transcripts. */
export declare function isToolHistoryBlockType(type: unknown): boolean;
export declare function augmentChatHistoryWithCanvasBlocks(messages: unknown[]): unknown[];
export declare function sanitizeChatHistoryMessages(messages: unknown[], maxChars?: number): unknown[];
export declare function dropPreSessionStartAnnouncePairs(messages: unknown[], sessionStartedAt: number | undefined): unknown[];
export declare function projectChatDisplayMessages(messages: unknown[], options?: {
    maxChars?: number;
    stripEnvelope?: boolean;
}): Array<Record<string, unknown>>;
export declare function projectRecentChatDisplayMessages(messages: unknown[], options?: {
    maxChars?: number;
    maxMessages?: number;
    stripEnvelope?: boolean;
}): Array<Record<string, unknown>>;
export declare function projectChatDisplayMessage(message: unknown, options?: {
    maxChars?: number;
    stripEnvelope?: boolean;
}): Record<string, unknown> | undefined;
