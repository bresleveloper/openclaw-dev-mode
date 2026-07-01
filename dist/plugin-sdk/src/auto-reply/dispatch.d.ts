import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { CommandSessionMetadataChange } from "./reply/command-session-metadata.js";
import type { DispatchFromConfigResult } from "./reply/dispatch-from-config.types.js";
import type { InternalGetReplyFromConfig, InternalGetReplyOptions } from "./reply/get-reply.types.js";
import { type ReplyDispatcherOptions, type ReplyDispatcherWithTypingOptions } from "./reply/reply-dispatcher.js";
import type { ReplyDispatcher } from "./reply/reply-dispatcher.types.js";
import type { FinalizedMsgContext, MsgContext } from "./templating.js";
type InternalDispatchReplyOptions = Omit<InternalGetReplyOptions, "onBlockReply">;
type ReplyPayloadRunState = {
    runId?: string;
};
export type DispatchInboundResult = DispatchFromConfigResult;
export { settleReplyDispatcher, withReplyDispatcher } from "./dispatch-dispatcher.js";
/** Dispatches one finalized inbound message through reply resolution and queued delivery. */
export declare function dispatchInboundMessage(params: {
    ctx: MsgContext | FinalizedMsgContext;
    cfg: OpenClawConfig;
    dispatcher: ReplyDispatcher;
    toolsAllow?: string[];
    replyOptions?: InternalDispatchReplyOptions;
    replyResolver?: InternalGetReplyFromConfig;
    onSessionMetadataChanges?: (changes: CommandSessionMetadataChange[]) => void;
    replyPayloadRunState?: ReplyPayloadRunState;
}): Promise<DispatchInboundResult>;
/** Creates a buffered dispatcher with typing, hooks, and stale foreground delivery suppression. */
export declare function dispatchInboundMessageWithBufferedDispatcher(params: {
    ctx: MsgContext | FinalizedMsgContext;
    cfg: OpenClawConfig;
    dispatcherOptions: ReplyDispatcherWithTypingOptions;
    toolsAllow?: string[];
    replyOptions?: InternalDispatchReplyOptions;
    replyResolver?: InternalGetReplyFromConfig;
    onSessionMetadataChanges?: (changes: CommandSessionMetadataChange[]) => void;
}): Promise<DispatchInboundResult>;
/** Creates a plain dispatcher, installs global send hooks, and dispatches the inbound message. */
export declare function dispatchInboundMessageWithDispatcher(params: {
    ctx: MsgContext | FinalizedMsgContext;
    cfg: OpenClawConfig;
    dispatcherOptions: ReplyDispatcherOptions;
    toolsAllow?: string[];
    replyOptions?: InternalDispatchReplyOptions;
    replyResolver?: InternalGetReplyFromConfig;
}): Promise<DispatchInboundResult>;
