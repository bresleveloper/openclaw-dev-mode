/**
 * Channel reply pipeline builder.
 *
 * Resolves source delivery mode, reply prefixing, typing callbacks, and payload transforms.
 */
import type { SourceReplyDeliveryMode } from "../../auto-reply/get-reply-options.types.js";
import type { ReplyPayload } from "../../auto-reply/reply-payload.js";
import { type SourceReplyDeliveryModeContext } from "../../auto-reply/reply/source-reply-delivery-mode.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { createReplyPrefixContext, createReplyPrefixOptions, type ReplyPrefixContextBundle, type ReplyPrefixOptions } from "../reply-prefix.js";
import { createTypingCallbacks, type CreateTypingCallbacksParams, type TypingCallbacks } from "../typing.js";
export type ReplyPrefixContext = ReplyPrefixContextBundle["prefixContext"];
export type { ReplyPrefixContextBundle, ReplyPrefixOptions };
export type { CreateTypingCallbacksParams, TypingCallbacks };
export { createReplyPrefixContext, createReplyPrefixOptions, createTypingCallbacks };
export type { SourceReplyDeliveryMode };
/** Resolves whether a channel reply should use source delivery, message tools, or direct sending. */
export declare function resolveChannelSourceReplyDeliveryMode(params: {
    /** Full config used to inspect source-reply delivery settings. */
    cfg: OpenClawConfig;
    /** Reply delivery context from the current channel turn. */
    ctx: SourceReplyDeliveryModeContext;
    /** Caller-requested delivery mode override. */
    requested?: SourceReplyDeliveryMode;
    /** Whether the message-send tool is available for this turn. */
    messageToolAvailable?: boolean;
}): SourceReplyDeliveryMode;
/** Reply pipeline options shared by core channel turns and plugin SDK callers. */
export type ChannelReplyPipeline = ReplyPrefixOptions & {
    /** Optional typing lifecycle callbacks for reply generation. */
    typingCallbacks?: TypingCallbacks;
    /** Optional payload transform applied before channel delivery. */
    transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
};
/** Parameters for building a channel reply pipeline with prefix, typing, and payload transforms. */
export type CreateChannelReplyPipelineParams = {
    /** Full config used for reply prefix and channel plugin transform resolution. */
    cfg: Parameters<typeof createReplyPrefixOptions>[0]["cfg"];
    /** Agent id used in reply prefix context. */
    agentId: string;
    /** Optional channel id for prefix context and plugin transform lookup. */
    channel?: string;
    /** Optional channel account id for prefix context and plugin transform lookup. */
    accountId?: string;
    /** Typing callback factory input. */
    typing?: CreateTypingCallbacksParams;
    /** Prebuilt typing callbacks that take precedence over `typing`. */
    typingCallbacks?: TypingCallbacks;
    /** Explicit payload transform; avoids channel plugin lookup when provided. */
    transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
};
/** Builds the reply pipeline used by channel turns and plugin SDK reply helpers. */
export declare function createChannelReplyPipeline(params: CreateChannelReplyPipelineParams): ChannelReplyPipeline;
