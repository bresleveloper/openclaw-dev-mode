import { a as SourceReplyDeliveryMode, d as ReplyPayload$1, n as GetReplyOptions, t as BlockReplyContext } from "./types-DNy-f8Hr.js";
import { i as MsgContext, o as CommandTurnContext, t as FinalizedMsgContext } from "./templating-KsALmYhy.js";
import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { _ as chunkTextWithMode, f as ChunkMode, g as chunkText, h as chunkMarkdownTextWithMode, m as chunkMarkdownText, v as resolveChunkMode, y as resolveTextChunkLimit } from "./outbound.types-B8rjITVv.js";
import { _n as ReplyDispatchKind, bn as ReplyFollowupAdmissionBarrierTimeoutPolicy, yn as ReplyDispatcher } from "./hook-types-D7oQwM1Q.js";
import { $r as CommandSessionMetadataChange, As as DEFAULT_HEARTBEAT_ACK_MAX_CHARS, Gr as DispatchReplyWithDispatcher, Hr as finalizeInboundContext, Jr as createReplyDispatcher, Kr as ReplyDispatcherOptions, Ms as resolveHeartbeatPrompt, Ns as stripHeartbeatToken, Qr as InternalGetReplyOptions, Ur as settleReplyDispatcher, Wr as DispatchReplyWithBufferedBlockDispatcher, Xr as DispatchFromConfigResult, Yr as createReplyDispatcherWithTyping, Zr as InternalGetReplyFromConfig, js as HEARTBEAT_PROMPT, qr as ReplyDispatcherWithTypingOptions } from "./types-CXLy55Xw.js";
import { r as ReplyPayload } from "./reply-payload-D0KRqbvl.js";
import { i as isSilentReplyText, n as SILENT_REPLY_TOKEN, t as HEARTBEAT_TOKEN } from "./tokens-CLx0Aap_.js";
import { n as createInboundDebouncer, r as resolveInboundDebounceMs } from "./inbound-debounce-CQqct7DU.js";
import { n as isAbortRequestText, t as isBtwRequestText } from "./btw-command-wgRk0LiI.js";
import { n as normalizeGroupActivation, r as parseActivationCommand } from "./group-activation-CvYoinGh.js";
import { t as resetInboundDedupe } from "./inbound-dedupe-ySEx5MpS.js";
import { n as generateConversationLabel, t as ConversationLabelParams } from "./conversation-label-generator-CUxrhiIp.js";
import { t as createReplyReferencePlanner } from "./reply-reference-Cn3MZh92.js";

//#region src/auto-reply/dispatch.d.ts
type InternalDispatchReplyOptions = Omit<InternalGetReplyOptions, "onBlockReply">;
type ReplyPayloadRunState = {
  runId?: string;
};
type DispatchInboundResult = DispatchFromConfigResult;
/** Dispatches one finalized inbound message through reply resolution and queued delivery. */
declare function dispatchInboundMessage(params: {
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
declare function dispatchInboundMessageWithBufferedDispatcher(params: {
  ctx: MsgContext | FinalizedMsgContext;
  cfg: OpenClawConfig;
  dispatcherOptions: ReplyDispatcherWithTypingOptions;
  toolsAllow?: string[];
  replyOptions?: InternalDispatchReplyOptions;
  replyResolver?: InternalGetReplyFromConfig;
  onSessionMetadataChanges?: (changes: CommandSessionMetadataChange[]) => void;
}): Promise<DispatchInboundResult>;
/** Creates a plain dispatcher, installs global send hooks, and dispatches the inbound message. */
declare function dispatchInboundMessageWithDispatcher(params: {
  ctx: MsgContext | FinalizedMsgContext;
  cfg: OpenClawConfig;
  dispatcherOptions: ReplyDispatcherOptions;
  toolsAllow?: string[];
  replyOptions?: InternalDispatchReplyOptions;
  replyResolver?: InternalGetReplyFromConfig;
}): Promise<DispatchInboundResult>;
//#endregion
//#region src/auto-reply/heartbeat-reply-payload.d.ts
/**
 * Pick the last outbound-capable reply payload for heartbeat delivery.
 *
 * Reasoning payloads are skipped using the shared SDK classifier
 * `isReasoningReplyPayload`, which recognizes the `isReasoning` flag plus the
 * common reasoning/thinking text prefixes (including lowercased and Markdown
 * blockquoted forms). Heartbeat reasoning is delivered separately and only when
 * `includeReasoning` is enabled; without this guard a trailing reasoning
 * payload (which reasoning models can emit after the final answer) would be
 * selected as the user-visible heartbeat reply.
 */
declare function resolveHeartbeatReplyPayload(replyResult: ReplyPayload$1 | ReplyPayload$1[] | undefined): ReplyPayload$1 | undefined;
//#endregion
//#region src/auto-reply/reply/get-reply.d.ts
declare function getReplyFromConfig(ctx: MsgContext, opts?: GetReplyOptions, configOverride?: OpenClawConfig): Promise<ReplyPayload$1 | ReplyPayload$1[] | undefined>;
//#endregion
//#region src/auto-reply/reply/provider-dispatcher.d.ts
/** Dispatch a reply using the buffered block dispatcher path. */
declare const dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
/** Dispatch a reply using the standard dispatcher path. */
declare const dispatchReplyWithDispatcher: DispatchReplyWithDispatcher;
//#endregion
export { type BlockReplyContext, type ChunkMode, type CommandTurnContext, type ConversationLabelParams, DEFAULT_HEARTBEAT_ACK_MAX_CHARS, type FinalizedMsgContext, type GetReplyOptions, HEARTBEAT_PROMPT, HEARTBEAT_TOKEN, type MsgContext, type ReplyDispatchKind, type ReplyDispatcher, type ReplyDispatcherOptions, type ReplyDispatcherWithTypingOptions, type ReplyFollowupAdmissionBarrierTimeoutPolicy, type ReplyPayload, SILENT_REPLY_TOKEN, type SourceReplyDeliveryMode, chunkMarkdownText, chunkMarkdownTextWithMode, chunkText, chunkTextWithMode, createInboundDebouncer, createReplyDispatcher, createReplyDispatcherWithTyping, createReplyReferencePlanner, dispatchInboundMessage, dispatchInboundMessageWithBufferedDispatcher, dispatchInboundMessageWithDispatcher, dispatchReplyWithBufferedBlockDispatcher, dispatchReplyWithDispatcher, finalizeInboundContext, generateConversationLabel, getReplyFromConfig, isAbortRequestText, isBtwRequestText, isSilentReplyText, normalizeGroupActivation, parseActivationCommand, resetInboundDedupe, resolveChunkMode, resolveHeartbeatPrompt, resolveHeartbeatReplyPayload, resolveInboundDebounceMs, resolveTextChunkLimit, settleReplyDispatcher, stripHeartbeatToken };