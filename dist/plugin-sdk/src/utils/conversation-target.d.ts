export type ConversationTargetParams = {
    channel?: string;
    conversationId?: string | number;
    parentConversationId?: string | number;
};
export declare function normalizeConversationTargetParams(params: ConversationTargetParams): {
    channel?: string;
    conversationId?: string;
    parentConversationId?: string;
};
