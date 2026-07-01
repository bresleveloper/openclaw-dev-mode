/** Coerces arbitrary provider content values into displayable text without throwing. */
export declare function coerceChatContentText(value: unknown): string;
/** Extracts normalized plain text from string content or OpenAI-style text blocks. */
export declare function extractTextFromChatContent(content: unknown, opts?: {
    sanitizeText?: (text: string) => string;
    joinWith?: string;
    normalizeText?: (text: string) => string;
}): string | null;
