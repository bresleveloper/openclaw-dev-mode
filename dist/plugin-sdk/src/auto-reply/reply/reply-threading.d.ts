import type { ChannelThreadingAdapter } from "../../channels/plugins/types.core.js";
import type { ReplyToMode } from "../../config/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type ReplyDeliveryContext } from "../reply-payload.js";
import type { OriginatingChannelType } from "../templating.js";
import type { ReplyPayload, ReplyThreadingPolicy } from "../types.js";
/** Resolve configured reply-to mode from channel and chat-type config. */
export declare function resolveConfiguredReplyToMode(cfg: OpenClawConfig, channel?: OriginatingChannelType, chatType?: string | null): ReplyToMode;
/** Resolve reply-to mode using channel threading adapter override when present. */
export declare function resolveReplyToModeWithThreading(cfg: OpenClawConfig, threading: ChannelThreadingAdapter | undefined, params?: {
    channel?: OriginatingChannelType;
    accountId?: string | null;
    chatType?: string | null;
}): ReplyToMode;
/** Resolve effective reply-to mode for a channel/account/chat tuple. */
export declare function resolveReplyToMode(cfg: OpenClawConfig, channel?: OriginatingChannelType, accountId?: string | null, chatType?: string | null): ReplyToMode;
/** Resolve the account that routed reply delivery will use when none is explicit. */
export declare function resolveReplyDeliveryAccountId(cfg: OpenClawConfig, channel?: OriginatingChannelType, accountId?: string | null): string | undefined;
/** Build the canonical reply policy context consumed by delivery adapters. */
export declare function createReplyDeliveryContext(replyToMode: ReplyToMode, chatType?: string | null): ReplyDeliveryContext;
/** Create a payload filter that strips reply targets according to reply-to mode. */
export declare function createReplyToModeFilter(mode: ReplyToMode, opts?: {
    allowExplicitReplyTagsWhenOff?: boolean;
}): (payload: ReplyPayload) => ReplyPayload;
/** Resolve whether implicit current-message replies are allowed under threading policy. */
export declare function resolveImplicitCurrentMessageReplyAllowance(mode: ReplyToMode | undefined, policy?: ReplyThreadingPolicy): boolean;
/** Build threading policy for batched reply-to mode. */
export declare function resolveBatchedReplyThreadingPolicy(mode: ReplyToMode, isBatched: boolean): ReplyThreadingPolicy | undefined;
/** Create a reply-to filter using channel-specific explicit-tag defaults. */
export declare function createReplyToModeFilterForChannel(mode: ReplyToMode, channel?: OriginatingChannelType): (payload: ReplyPayload) => ReplyPayload;
