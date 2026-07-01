/** Extracts inline reply-target tags from outbound reply text. */
export declare function extractReplyToTag(text?: string, currentMessageId?: string): {
    cleaned: string;
    replyToId?: string;
    replyToCurrent: boolean;
    hasTag: boolean;
};
