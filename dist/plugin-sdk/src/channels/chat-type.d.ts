/**
 * Normalized conversation kind shared by channel routing, sessions, and SDK helpers.
 */
export type ChatType = "direct" | "group" | "channel";
/**
 * Normalizes channel-specific chat type labels into OpenClaw conversation kinds.
 */
export declare function normalizeChatType(raw?: string): ChatType | undefined;
