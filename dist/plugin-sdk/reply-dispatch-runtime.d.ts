import { _a as DispatchReplyWithBufferedBlockDispatcher, ha as finalizeInboundContextForSdk, va as DispatchReplyWithDispatcher } from "../agent-harness-runtime-wMciqZ6Z.js";
import { ft as CommandTurnContext } from "../templating-0ElMwhje.js";
import { h as resolveChunkMode } from "../outbound.types-DZsrSgdc.js";
import { i as ReplyPayload } from "../reply-payload-DPfgBTIu.js";
import { n as generateConversationLabel } from "../conversation-label-generator-CgHE35t1.js";
//#region src/plugin-sdk/reply-dispatch-runtime.d.ts
/** Dispatches a reply with buffered block support after lazy-loading the runtime dispatcher. */
export declare const dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
/** Dispatches a reply through the provider dispatcher after lazy-loading runtime code. */
export declare const dispatchReplyWithDispatcher: DispatchReplyWithDispatcher;
//#endregion
export { type CommandTurnContext, type DispatchReplyWithBufferedBlockDispatcher, type DispatchReplyWithDispatcher, type ReplyPayload, finalizeInboundContextForSdk as finalizeInboundContext, generateConversationLabel, resolveChunkMode };