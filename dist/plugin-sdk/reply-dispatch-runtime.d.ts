import { Kt as CommandTurnContext } from "../reply-payload-DazZPys5.js";
import { co as finalizeInboundContextForSdk, do as DispatchReplyWithDispatcher, uo as DispatchReplyWithBufferedBlockDispatcher } from "../agent-harness-runtime-DZjstJNb.js";
import { h as resolveChunkMode } from "../outbound.types-B8D3jrzb.js";
import { i as ReplyPayload } from "../reply-payload-OW17IyAQ.js";
import { n as generateConversationLabel } from "../conversation-label-generator-DbHk1LJi.js";
//#region src/plugin-sdk/reply-dispatch-runtime.d.ts
/** Dispatches a reply with buffered block support after lazy-loading the runtime dispatcher. */
export declare const dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
/** Dispatches a reply through the provider dispatcher after lazy-loading runtime code. */
export declare const dispatchReplyWithDispatcher: DispatchReplyWithDispatcher;
//#endregion
export { type CommandTurnContext, type DispatchReplyWithBufferedBlockDispatcher, type DispatchReplyWithDispatcher, type ReplyPayload, finalizeInboundContextForSdk as finalizeInboundContext, generateConversationLabel, resolveChunkMode };