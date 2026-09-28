import { Aa as InternalGetReplyOptions, Da as DispatchReplyFromConfig, Ea as DispatchFromConfigResult, Oa as CommandSessionMetadataChange, Sa as createReplyDispatcherWithTyping, _a as DispatchReplyWithBufferedBlockDispatcher, ba as ReplyDispatcherWithTypingOptions, ga as settleReplyDispatcher, ha as finalizeInboundContextForSdk, ka as InternalGetReplyFromConfig, va as DispatchReplyWithDispatcher, xa as createReplyDispatcher, ya as ReplyDispatcherOptions } from "../agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { C as ReplyToMode } from "../types.base-CA0_JvyZ.js";
import { ft as CommandTurnContext, h as GetReplyOptions, l as RuntimeMsgContext, m as BlockReplyContext, n as ChannelStructuredContextEntry, p as UntrustedStructuredContextEntry, r as FinalizedMsgContext, s as MsgContext } from "../templating-OpWn1DzT.js";
import "../types-BnfxNjkF.js";
import "../config-CTir7RIz.js";
import { E as SourceReplyDeliveryMode, h as ReplyPayload$1 } from "../reply-payload-Dv0rYqXd.js";
import "../deliver-types-CDKM8xJ_.js";
import { c as ChunkMode, d as chunkMarkdownText, f as chunkMarkdownTextWithMode, g as resolveTextChunkLimit, h as resolveChunkMode, m as chunkTextWithMode, p as chunkText } from "../outbound.types-HYq1MKG1.js";
import { bt as ReplyFollowupAdmissionBarrierTimeoutPolicy, gt as ReplyDispatchKind, ht as ReplyDispatchBeforeDeliverOptions, vt as ReplyDispatchRuntimeInfo, yt as ReplyDispatcher } from "../hook-runner-global-D5VgWbSn.js";
import { i as isSilentReplyText, n as SILENT_REPLY_TOKEN, t as HEARTBEAT_TOKEN } from "../tokens-CLx0Aap_.js";
import { n as createInboundDebouncer, r as resolveInboundDebounceMs } from "../inbound-debounce-BDWFVTEM.js";
import { i as ReplyPayload } from "../reply-payload-yojyxBLb.js";
import { n as isAbortRequestText, t as isBtwRequestText } from "../btw-command-BWcgfeXP.js";
import { n as generateConversationLabel, t as ConversationLabelParams } from "../conversation-label-generator-DAsSM32S.js";
//#region src/auto-reply/heartbeat.d.ts
/** Default prompt for heartbeat turns when config does not override it. */
export declare const HEARTBEAT_PROMPT = "Follow the heartbeat monitor scratch context when provided. Recurring tasks are automations; create or change their schedules with the automations tool, not heartbeat scratch. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply NO_REPLY.";
export declare const DEFAULT_HEARTBEAT_ACK_MAX_CHARS = 300;
/** Resolves configured heartbeat prompt text with the built-in default fallback. */
export declare function resolveHeartbeatPromptCore(raw?: string): string;
type StripHeartbeatMode = "heartbeat" | "message";
/** Strips HEARTBEAT_OK acknowledgements and decides whether visible notification is needed. */
export declare function stripHeartbeatToken(raw?: string, opts?: {
  mode?: StripHeartbeatMode;
  maxAckChars?: number;
}): {
  shouldSkip: boolean;
  text: string;
  didStrip: boolean;
};
//#endregion
//#region src/auto-reply/dispatch.d.ts
type InternalDispatchReplyOptions = Omit<InternalGetReplyOptions, "onBlockReply" | "onPreparedBlockReply">;
type ReplyPayloadRunState = {
  runId?: string;
};
type DispatchInboundResult = DispatchFromConfigResult;
/** Dispatches one finalized inbound message through reply resolution and queued delivery. */
export declare function dispatchInboundMessage(params: {
  ctx: MsgContext | FinalizedMsgContext;
  cfg: OpenClawConfig;
  dispatcher: ReplyDispatcher;
  toolsAllow?: string[];
  replyOptions?: InternalDispatchReplyOptions;
  replyResolver?: InternalGetReplyFromConfig;
  dispatchReplyFromConfig?: DispatchReplyFromConfig;
  onSessionMetadataChanges?: (changes: CommandSessionMetadataChange[]) => void;
  replyPayloadRunState?: ReplyPayloadRunState;
  /** Observe-only turns run the agent without entering outbound hook stages. */
  outboundHooks?: "enabled" | "disabled";
  onSettled?: () => void | Promise<void>;
}): Promise<DispatchInboundResult>;
type BufferedInboundDispatcherParams = {
  ctx: MsgContext | FinalizedMsgContext;
  cfg: OpenClawConfig;
  dispatcherOptions: ReplyDispatcherWithTypingOptions;
  toolsAllow?: string[];
  replyOptions?: InternalDispatchReplyOptions;
  replyResolver?: InternalGetReplyFromConfig;
  dispatchReplyFromConfig?: DispatchReplyFromConfig;
  onSessionMetadataChanges?: (changes: CommandSessionMetadataChange[]) => void;
};
export declare function dispatchInboundMessageWithBufferedDispatcher(params: BufferedInboundDispatcherParams): Promise<DispatchInboundResult>;
/** Creates a plain dispatcher, installs global send hooks, and dispatches the inbound message. */
export declare function dispatchInboundMessageWithDispatcher(params: {
  ctx: MsgContext | FinalizedMsgContext;
  cfg: OpenClawConfig;
  dispatcherOptions: ReplyDispatcherOptions;
  toolsAllow?: string[];
  replyOptions?: InternalDispatchReplyOptions;
  replyResolver?: InternalGetReplyFromConfig;
}): Promise<DispatchInboundResult>;
//#endregion
//#region src/auto-reply/group-activation.d.ts
/** Supported group activation modes. */
type GroupActivationMode = "mention" | "always";
/** Normalize a raw group activation mode string. */
export declare function normalizeGroupActivation(raw?: string | null): GroupActivationMode | undefined;
/** Parse `/activation` commands from inbound message text. */
export declare function parseActivationCommand(raw?: string): {
  hasCommand: boolean;
  mode?: GroupActivationMode;
};
//#endregion
//#region src/auto-reply/heartbeat-reply-payload.d.ts
/**
 * Pick the last outbound-capable reply payload for heartbeat delivery.
 *
 * Reasoning payloads are skipped using the shared SDK classifier
 * `isReasoningReplyPayload`, which recognizes the `isReasoning` flag plus the
 * common reasoning/thinking text prefixes (including lowercased and Markdown
 * blockquoted forms). Heartbeat delivery keeps separate reasoning payloads
 * internal; without this guard, a trailing reasoning payload (which reasoning
 * models can emit after the final answer) would be selected as the visible
 * heartbeat reply.
 */
export declare function resolveHeartbeatReplyPayload(replyResult: ReplyPayload$1 | ReplyPayload$1[] | undefined): ReplyPayload$1 | undefined;
//#endregion
//#region src/auto-reply/reply/get-reply.d.ts
export declare function getReplyFromConfig(ctx: RuntimeMsgContext, options?: GetReplyOptions, configOverride?: OpenClawConfig): Promise<ReplyPayload$1 | ReplyPayload$1[] | undefined>;
//#endregion
//#region src/auto-reply/reply/inbound-dedupe.d.ts
export declare function resetInboundDedupe(): void;
//#endregion
//#region src/auto-reply/reply/provider-dispatcher.d.ts
/** Dispatch a reply using the buffered block dispatcher path. */
declare const dispatchReplyWithBufferedBlockDispatcherCore: DispatchReplyWithBufferedBlockDispatcher;
/** Dispatch a reply using the standard dispatcher path. */
declare const dispatchReplyWithDispatcherCore: DispatchReplyWithDispatcher;
//#endregion
//#region src/auto-reply/reply/reply-reference.d.ts
/** Stateful planner for reply-to ids across one delivery flow. */
type ReplyReferencePlanner = {
  /** Returns the effective reply/thread id for the next send without updating state. */
  peek(): string | undefined;
  /** Returns the effective reply/thread id for the next send and updates state. */
  use(): string | undefined;
  /** Mark that a reply was sent (needed when no reference is used). */
  markSent(): void;
  /** Whether a reply has been sent in this flow. */
  hasReplied(): boolean;
};
/** Creates a planner that tracks whether a reply reference has already been consumed. */
export declare function createReplyReferencePlanner(options: {
  replyToMode: ReplyToMode;
  /** Existing thread/reference id (preferred when allowed by replyToMode). */
  existingId?: string;
  /** Id to start a new thread/reference when allowed (e.g., parent message id). */
  startId?: string;
  /** Disable reply references entirely (e.g., when posting inside a new thread). */
  allowReference?: boolean;
  /** Seed the planner with prior reply state. */
  hasReplied?: boolean;
}): ReplyReferencePlanner;
//#endregion
export { type BlockReplyContext, type ChannelStructuredContextEntry, type ChunkMode, type CommandTurnContext, type ConversationLabelParams, type FinalizedMsgContext, type GetReplyOptions, HEARTBEAT_TOKEN, type MsgContext, type ReplyDispatchBeforeDeliverOptions, type ReplyDispatchKind, type ReplyDispatchRuntimeInfo, type ReplyDispatcher, type ReplyDispatcherOptions, type ReplyDispatcherWithTypingOptions, type ReplyFollowupAdmissionBarrierTimeoutPolicy, type ReplyPayload, SILENT_REPLY_TOKEN, type SourceReplyDeliveryMode, type UntrustedStructuredContextEntry, chunkMarkdownText, chunkMarkdownTextWithMode, chunkText, chunkTextWithMode, createInboundDebouncer, createReplyDispatcher, createReplyDispatcherWithTyping, dispatchReplyWithBufferedBlockDispatcherCore as dispatchReplyWithBufferedBlockDispatcher, dispatchReplyWithDispatcherCore as dispatchReplyWithDispatcher, finalizeInboundContextForSdk as finalizeInboundContext, generateConversationLabel, isAbortRequestText, isBtwRequestText, isSilentReplyText, resolveChunkMode, resolveInboundDebounceMs, resolveTextChunkLimit, settleReplyDispatcher };