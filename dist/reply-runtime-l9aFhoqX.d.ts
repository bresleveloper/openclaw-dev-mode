import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import { y as ReplyToMode } from "./types.base-6bKsSmWG.js";
import { B_ as ReplyDispatcherWithTypingOptions, Em as DispatchReplyFromConfig, K_ as InternalGetReplyFromConfig, Tm as DispatchFromConfigResult, _E as ReplyDispatcher, _k as ReplyPayload, a as MsgContext, f as GetReplyOptions, i as FinalizedMsgContext, p_ as PublicReplyParams, q_ as InternalGetReplyOptions, rx as CommandSessionMetadataChange, z_ as ReplyDispatcherOptions } from "./config-contracts-CY87ANNp.js";
import "./inbound-debounce-3IFvFm4K.js";
import { t as getReplyFromConfig } from "./get-reply-BOg3LdZK.js";
import "./btw-command-CAuWYXn8.js";
//#region src/auto-reply/dispatch.d.ts
type InternalDispatchReplyOptions = Omit<InternalGetReplyOptions, "onBlockReply" | "onPreparedBlockReply">;
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
  dispatchReplyFromConfig?: DispatchReplyFromConfig;
  onSessionMetadataChanges?: (changes: CommandSessionMetadataChange[]) => void;
  replyPayloadRunState?: ReplyPayloadRunState;
  /** Observe-only turns run the agent without entering outbound hook stages. */
  outboundHooks?: "enabled" | "disabled";
  onSettled?: () => void | Promise<void>;
}): Promise<DispatchInboundResult>;
type BufferedInboundDispatcherParams = Omit<Parameters<typeof dispatchInboundMessage>[0], "dispatcher" | "replyPayloadRunState" | "outboundHooks" | "onSettled"> & {
  dispatcherOptions: ReplyDispatcherWithTypingOptions;
};
declare function dispatchInboundMessageWithBufferedDispatcher(params: BufferedInboundDispatcherParams): Promise<DispatchInboundResult>;
type PlainInboundDispatcherParams = Omit<BufferedInboundDispatcherParams, "dispatcherOptions" | "dispatchReplyFromConfig"> & {
  dispatcherOptions: ReplyDispatcherOptions;
};
/** Creates a plain dispatcher, installs global send hooks, and dispatches the inbound message. */
declare function dispatchInboundMessageWithDispatcher(params: Omit<PlainInboundDispatcherParams, "onSessionMetadataChanges">): Promise<DispatchInboundResult>;
//#endregion
//#region src/plugin-sdk/reply-runtime-adapters.d.ts
declare function dispatchInboundMessageForSdk(params: PublicReplyParams<Parameters<typeof dispatchInboundMessage>[0]>): Promise<DispatchFromConfigResult>;
declare function dispatchInboundMessageWithBufferedDispatcherForSdk(params: PublicReplyParams<Parameters<typeof dispatchInboundMessageWithBufferedDispatcher>[0]>): Promise<DispatchFromConfigResult>;
declare function dispatchInboundMessageWithDispatcherForSdk(params: PublicReplyParams<Parameters<typeof dispatchInboundMessageWithDispatcher>[0]>): Promise<DispatchFromConfigResult>;
declare function getReplyFromConfigForSdk(ctx: Parameters<typeof getReplyFromConfig>[0], opts?: GetReplyOptions, config?: Parameters<typeof getReplyFromConfig>[2]): Promise<ReplyPayload[] | ReplyPayload | undefined>;
//#endregion
//#region src/auto-reply/group-activation.d.ts
type GroupActivationMode = "mention" | "always";
declare function normalizeGroupActivation(raw?: string | null): GroupActivationMode | undefined;
declare function parseActivationCommand(raw?: string): {
  hasCommand: boolean;
  mode?: GroupActivationMode;
};
//#endregion
//#region src/auto-reply/heartbeat.d.ts
/** Default prompt for heartbeat turns when config does not override it. */
declare const HEARTBEAT_PROMPT = "Follow the heartbeat monitor scratch context when provided. Recurring tasks are automations; create or change their schedules with the automations tool, not heartbeat scratch. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply NO_REPLY.";
declare const DEFAULT_HEARTBEAT_ACK_MAX_CHARS = 300;
/** Resolves configured heartbeat prompt text with the built-in default fallback. */
declare function resolveHeartbeatPromptCore(raw?: string): string;
type StripHeartbeatMode = "heartbeat" | "message";
/** Strips HEARTBEAT_OK acknowledgements and decides whether visible notification is needed. */
declare function stripHeartbeatToken(raw?: string, opts?: {
  mode?: StripHeartbeatMode;
  maxAckChars?: number;
}): {
  shouldSkip: boolean;
  text: string;
  didStrip: boolean;
};
//#endregion
//#region src/auto-reply/heartbeat-reply-payload.d.ts
/**
 * Pick the last outbound-capable reply, excluding flagged and text-prefixed reasoning.
 * Scalar replies intentionally need no outbound-content check.
 */
declare function resolveHeartbeatReplyPayload(replyResult: ReplyPayload | ReplyPayload[] | undefined): ReplyPayload | undefined;
//#endregion
//#region src/auto-reply/reply/inbound-dedupe.d.ts
declare function resetInboundDedupe(): void;
//#endregion
//#region src/auto-reply/reply/reply-reference.d.ts
declare function createReplyReferencePlanner(options: {
  replyToMode: ReplyToMode;
  /** Existing thread/reference id (preferred when allowed by replyToMode). */
  existingId?: string;
  /** Id to start a new thread/reference when allowed (e.g., parent message id). */
  startId?: string;
  /** Disable reply references entirely (e.g., when posting inside a new thread). */
  allowReference?: boolean;
  hasReplied?: boolean;
}): {
  /** Read the next reference without consuming the first-reply slot. */
  peek: () => string | undefined;
  use(): string | undefined;
  /** Mark a reply sent even when it used no reference. */
  markSent(): void;
  hasReplied: () => boolean;
};
//#endregion
export { HEARTBEAT_PROMPT as a, normalizeGroupActivation as c, dispatchInboundMessageWithBufferedDispatcherForSdk as d, dispatchInboundMessageWithDispatcherForSdk as f, DEFAULT_HEARTBEAT_ACK_MAX_CHARS as i, parseActivationCommand as l, resetInboundDedupe as n, resolveHeartbeatPromptCore as o, getReplyFromConfigForSdk as p, resolveHeartbeatReplyPayload as r, stripHeartbeatToken as s, createReplyReferencePlanner as t, dispatchInboundMessageForSdk as u };