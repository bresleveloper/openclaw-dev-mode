import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "../inbound-debounce-BeTuTnO0.mjs";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText, t as HEARTBEAT_TOKEN } from "../tokens-DHFPcfdZ.mjs";
import { c as resolveHeartbeatPromptCore, n as HEARTBEAT_PROMPT, t as DEFAULT_HEARTBEAT_ACK_MAX_CHARS, u as stripHeartbeatToken } from "../heartbeat-C40cs1ec.mjs";
import { t as createReplyReferencePlanner } from "../reply-reference-CLjC4hNl.mjs";
import { n as finalizeInboundContextForSdk } from "../inbound-context-DnPzLOsP.mjs";
import { a as createReplyDispatcherWithTyping, i as createReplyDispatcher } from "../reply-dispatcher-BW8Y2zzZ.mjs";
import { n as parseActivationCommand, t as normalizeGroupActivation } from "../group-activation-D-hOhHZQ.mjs";
import { n as settleReplyDispatcher } from "../dispatch-dispatcher-CvUZsPeG.mjs";
import { n as dispatchInboundMessageWithBufferedDispatcher, r as dispatchInboundMessageWithDispatcher, t as dispatchInboundMessage } from "../dispatch-CZQ0DxJx.mjs";
import { i as resetInboundDedupe } from "../dispatch-from-config-Cjo1kQIo.mjs";
import { a as chunkText, c as resolveTextChunkLimit, i as chunkMarkdownTextWithMode, o as chunkTextWithMode, r as chunkMarkdownText, s as resolveChunkMode } from "../chunk-qrwWkfC7.mjs";
import { r as publicReplyOptions, t as publicChannelTurn } from "../reply-options-vskFqRCa.mjs";
import { n as isAbortRequestText } from "../abort-primitives-s9GIpM6V.mjs";
import { n as isBtwRequestText } from "../btw-command-BsR1Sazk.mjs";
import { t as getReplyFromConfig } from "../get-reply-BQ6sZ9FP.mjs";
import { t as resolveHeartbeatReplyPayload } from "../heartbeat-reply-payload-D_Pzl8SS.mjs";
import { t as generateConversationLabel } from "../conversation-label-generator-DiWCK6Mo.mjs";
import { n as dispatchReplyWithDispatcher, t as dispatchReplyWithBufferedBlockDispatcher } from "../reply-dispatch-runtime-bOu4Ykpn.mjs";
//#region src/plugin-sdk/reply-runtime-adapters.ts
function dispatchInboundMessageForSdk(params) {
	return dispatchInboundMessage(publicChannelTurn(params));
}
function dispatchInboundMessageWithBufferedDispatcherForSdk(params) {
	return dispatchInboundMessageWithBufferedDispatcher(publicChannelTurn(params));
}
function dispatchInboundMessageWithDispatcherForSdk(params) {
	return dispatchInboundMessageWithDispatcher(publicChannelTurn(params));
}
function getReplyFromConfigForSdk(ctx, opts, config) {
	return getReplyFromConfig(ctx, publicReplyOptions(opts), config);
}
//#endregion
export { DEFAULT_HEARTBEAT_ACK_MAX_CHARS, HEARTBEAT_PROMPT, HEARTBEAT_TOKEN, SILENT_REPLY_TOKEN, chunkMarkdownText, chunkMarkdownTextWithMode, chunkText, chunkTextWithMode, createInboundDebouncer, createReplyDispatcher, createReplyDispatcherWithTyping, createReplyReferencePlanner, dispatchInboundMessageForSdk as dispatchInboundMessage, dispatchInboundMessageWithBufferedDispatcherForSdk as dispatchInboundMessageWithBufferedDispatcher, dispatchInboundMessageWithDispatcherForSdk as dispatchInboundMessageWithDispatcher, dispatchReplyWithBufferedBlockDispatcher, dispatchReplyWithDispatcher, finalizeInboundContextForSdk as finalizeInboundContext, generateConversationLabel, getReplyFromConfigForSdk as getReplyFromConfig, isAbortRequestText, isBtwRequestText, isSilentReplyText, normalizeGroupActivation, parseActivationCommand, resetInboundDedupe, resolveChunkMode, resolveHeartbeatPromptCore, resolveHeartbeatReplyPayload, resolveInboundDebounceMs, resolveTextChunkLimit, settleReplyDispatcher, stripHeartbeatToken };
