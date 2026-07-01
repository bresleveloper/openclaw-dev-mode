import type { MsgContext } from "../auto-reply/templating.js";
import type { OpenClawConfig } from "../config/types.js";
/** Resolves local inbound attachment roots from the channel named in a message context. */
export declare function resolveChannelInboundAttachmentRoots(params: {
    cfg: OpenClawConfig;
    ctx: MsgContext;
}): readonly string[] | undefined;
/** Resolves local inbound attachment roots for callers that already know the channel id. */
export declare function resolveChannelInboundAttachmentRootsForChannel(params: {
    cfg: OpenClawConfig;
    channelId?: string | null;
    accountId?: string | null;
}): readonly string[] | undefined;
/** Resolves remote staging roots for inbound channel attachments without loading full channel code. */
export declare function resolveChannelRemoteInboundAttachmentRoots(params: {
    cfg: OpenClawConfig;
    ctx: MsgContext;
}): readonly string[] | undefined;
