/**
 * Channel threading resolver helpers.
 *
 * Builds reply-to-mode resolvers from static, top-level, or account-scoped config.
 */
import type { ReplyToMode } from "../../config/types.base.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ChannelThreadingAdapter } from "./types.core.js";
type ReplyToModeResolver = NonNullable<ChannelThreadingAdapter["resolveReplyToMode"]>;
/**
 * Creates a reply-to-mode resolver that always returns one mode.
 */
export declare function createStaticReplyToModeResolver(mode: ReplyToMode): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from top-level channel config.
 */
export declare function createTopLevelChannelReplyToModeResolver(channelId: string): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from account-scoped config.
 */
export declare function createScopedAccountReplyToModeResolver<TAccount>(params: {
    resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => TAccount;
    resolveReplyToMode: (account: TAccount, chatType?: string | null) => ReplyToMode | null | undefined;
    fallback?: ReplyToMode;
}): ReplyToModeResolver;
export {};
