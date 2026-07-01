import type { BlockReplyContext, ReplyPayload, ReplyThreadingPolicy } from "../types.js";
import type { BlockReplyPipeline } from "./block-reply-pipeline.js";
import type { TypingSignaler } from "./typing-mode.js";
type ReplyDirectiveParseMode = "always" | "auto" | "never";
/** Parses inline reply directives into payload fields and silent-reply state. */
export declare function normalizeReplyPayloadDirectives(params: {
    payload: ReplyPayload;
    currentMessageId?: string;
    silentToken?: string;
    trimLeadingWhitespace?: boolean;
    parseMode?: ReplyDirectiveParseMode;
    extractMarkdownImages?: boolean;
    extractMediaDirectives?: boolean;
}): {
    payload: ReplyPayload;
    isSilent: boolean;
};
/** Creates the handler used for assistant block replies during streaming/tool phases. */
export declare function createBlockReplyDeliveryHandler(params: {
    onBlockReply: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<void> | void;
    currentMessageId?: string;
    replyThreading?: ReplyThreadingPolicy;
    normalizeStreamingText: (payload: ReplyPayload) => {
        text?: string;
        skip: boolean;
    };
    applyReplyToMode: (payload: ReplyPayload) => ReplyPayload;
    normalizeMediaPaths?: (payload: ReplyPayload) => Promise<ReplyPayload>;
    typingSignals: TypingSignaler;
    blockStreamingEnabled: boolean;
    blockReplyPipeline: BlockReplyPipeline | null;
    directlySentBlockKeys: Set<string>;
    directlySentBlockPayloads: Array<ReplyPayload | undefined>;
}): (payload: ReplyPayload) => Promise<void>;
export {};
