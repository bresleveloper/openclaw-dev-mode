/** Parsed outbound reply directives and media extracted from model text. */
export type ReplyDirectiveParseResult = {
    text: string;
    mediaUrls?: string[];
    mediaUrl?: string;
    reaction?: {
        emoji: string;
        replyToCurrent?: boolean;
        replyToId?: string;
    };
    replyToId?: string;
    replyToCurrent?: boolean;
    replyToTag: boolean;
    audioAsVoice?: boolean;
    isSilent: boolean;
};
/** Options for extracting reply directives from model text. */
type ReplyDirectiveParseOptions = {
    currentMessageId?: string;
    silentToken?: string;
    extractMarkdownImages?: boolean;
    extractMediaDirectives?: boolean;
};
export declare function mergeReactionDirectiveChannelData(channelData: Record<string, unknown> | undefined, reaction: ReplyDirectiveParseResult["reaction"] | undefined): Record<string, unknown> | undefined;
/** Parses media, reply-target, audio, and silent directives from reply text. */
export declare function parseReplyDirectives(raw: string, options?: ReplyDirectiveParseOptions): ReplyDirectiveParseResult;
export {};
