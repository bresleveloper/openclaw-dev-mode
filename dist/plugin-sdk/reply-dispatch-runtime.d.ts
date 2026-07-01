import { o as CommandTurnContext } from "./templating-KsALmYhy.js";
import { v as resolveChunkMode } from "./outbound.types-B8rjITVv.js";
import { Gr as DispatchReplyWithDispatcher, Hr as finalizeInboundContext, Wr as DispatchReplyWithBufferedBlockDispatcher } from "./types-CXLy55Xw.js";
import { r as ReplyPayload } from "./reply-payload-D0KRqbvl.js";
import { n as generateConversationLabel } from "./conversation-label-generator-CUxrhiIp.js";

//#region src/plugin-sdk/reply-dispatch-runtime.d.ts
/** Dispatches a reply with buffered block support after lazy-loading the runtime dispatcher. */
declare const dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
/** Dispatches a reply through the provider dispatcher after lazy-loading runtime code. */
declare const dispatchReplyWithDispatcher: DispatchReplyWithDispatcher;
//#endregion
export { type CommandTurnContext, type DispatchReplyWithBufferedBlockDispatcher, type DispatchReplyWithDispatcher, type ReplyPayload, dispatchReplyWithBufferedBlockDispatcher, dispatchReplyWithDispatcher, finalizeInboundContext, generateConversationLabel, resolveChunkMode };