/**
 * Minimal conversation shape normalized before binding lookup or storage.
 */
export type ConversationRefShape = {
    channel: string;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
};
type ConversationTargetRefShape = {
    conversationId: string;
    parentConversationId?: string | null;
};
/**
 * Normalizes conversation ids and drops self-referential parent ids.
 */
export declare function normalizeConversationTargetRef<T extends ConversationTargetRefShape>(ref: T): T;
/**
 * Normalizes a full conversation reference for stable binding keys.
 */
export declare function normalizeConversationRef<T extends ConversationRefShape>(ref: T): T;
/**
 * Builds the adapter registry key shared by channel/account scoped bindings.
 */
export declare function buildChannelAccountKey(params: {
    channel: string;
    accountId: string;
}): string;
export {};
