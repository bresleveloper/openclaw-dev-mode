/** Minimal chat message shape used by subagent text extraction. */
export type ChatMessage = {
    role?: unknown;
    content?: unknown;
};
/** Extracts sanitized display text from a subagent chat message. */
export declare function extractMessageText(message: ChatMessage): {
    role: string;
    text: string;
} | null;
