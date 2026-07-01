import type { MessagingToolSend } from "../../agents/embedded-agent-messaging.types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type ReplyDeliveryContext } from "../reply-payload.js";
import type { ReplyPayload } from "../types.js";
/** Removes text payloads already sent by message tools. */
export declare function filterMessagingToolDuplicates(params: {
    payloads: ReplyPayload[];
    sentTexts: string[];
}): ReplyPayload[];
/** Removes media payload URLs already sent by message tools. */
export declare function filterMessagingToolMediaDuplicates(params: {
    payloads: ReplyPayload[];
    sentMediaUrls: string[];
}): ReplyPayload[];
/** Returns true when message-tool route evidence says source replies should be deduped. */
export declare function shouldDedupeMessagingToolRepliesForRoute(params: {
    config?: OpenClawConfig;
    messageProvider?: string;
    messagingToolSentTargets?: MessagingToolSend[];
    originatingTo?: string;
    originatingThreadId?: string | number;
    replyToId?: string;
    replyToIsExplicit?: boolean;
    replyDelivery?: ReplyDeliveryContext;
    accountId?: string;
}): boolean;
/** Finds message-tool sends that target the same channel/account/thread as the source reply. */
export declare function getMatchingMessagingToolReplyTargets(params: {
    config?: OpenClawConfig;
    messageProvider?: string;
    messagingToolSentTargets?: MessagingToolSend[];
    originatingTo?: string;
    originatingThreadId?: string | number;
    replyToId?: string;
    replyToIsExplicit?: boolean;
    replyDelivery?: ReplyDeliveryContext;
    accountId?: string;
}): MessagingToolSend[];
/** Dedupe decision plus route-specific evidence used by final payload filtering. */
export type MessagingToolPayloadDedupeDecision = {
    shouldDedupePayloads: boolean;
    matchingRoute: boolean;
    routeSentTexts: string[];
    routeSentMediaUrls: string[];
    useGlobalSentTextEvidenceFallback: boolean;
    useGlobalSentMediaUrlEvidenceFallback: boolean;
};
/** Resolves whether and how to dedupe final payloads against message-tool sends. */
export declare function resolveMessagingToolPayloadDedupe(params: {
    config?: OpenClawConfig;
    messageProvider?: string;
    messagingToolSentTargets?: MessagingToolSend[];
    originatingTo?: string;
    originatingThreadId?: string | number;
    replyToId?: string;
    replyToIsExplicit?: boolean;
    replyDelivery?: ReplyDeliveryContext;
    accountId?: string;
}): MessagingToolPayloadDedupeDecision;
