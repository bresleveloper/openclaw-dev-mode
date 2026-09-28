import { _a as DispatchReplyWithBufferedBlockDispatcher, ha as finalizeInboundContextForSdk, va as DispatchReplyWithDispatcher } from "../agent-harness-runtime-CWL0fcg5.js";
import { ft as CommandTurnContext } from "../templating-OpWn1DzT.js";
import { h as resolveChunkMode } from "../outbound.types-HYq1MKG1.js";
import { i as ReplyPayload } from "../reply-payload-yojyxBLb.js";
import { n as generateConversationLabel } from "../conversation-label-generator-DAsSM32S.js";
//#region src/plugin-sdk/reply-dispatch-runtime.d.ts
/** Dispatches a reply with buffered block support after lazy-loading the runtime dispatcher. */
export declare const dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
/** Dispatches a reply through the provider dispatcher after lazy-loading runtime code. */
export declare const dispatchReplyWithDispatcher: DispatchReplyWithDispatcher;
//#endregion
export { type CommandTurnContext, type DispatchReplyWithBufferedBlockDispatcher, type DispatchReplyWithDispatcher, type ReplyPayload, finalizeInboundContextForSdk as finalizeInboundContext, generateConversationLabel, resolveChunkMode };