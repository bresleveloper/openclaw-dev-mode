type ThreadBindingPlacement = "current" | "child";
type ThreadBindingInboundConversationParams = {
    from?: string;
    to?: string;
    conversationId?: string;
    threadId?: string | number;
    threadParentId?: string | number;
    isGroup: boolean;
};
type ThreadBindingConversationRef = {
    conversationId?: string;
    parentConversationId?: string;
};
/**
 * Resolves the default top-level thread-binding placement for a bundled channel.
 */
export declare function resolveBundledChannelThreadBindingDefaultPlacement(channelId: string): ThreadBindingPlacement | undefined;
/**
 * Resolves inbound conversation refs from a bundled channel thread-binding artifact.
 */
export declare function resolveBundledChannelThreadBindingInboundConversation(params: ThreadBindingInboundConversationParams & {
    channelId: string;
}): ThreadBindingConversationRef | null | undefined;
export {};
