import { a as MsgContext, aM as ReplyPayload, at as DispatchFromConfigResult, av as InternalGetReplyOptions, f as GetReplyOptions, i as FinalizedMsgContext, iv as InternalGetReplyFromConfig, lv as CommandSessionMetadataChange, nE as ReplyDispatcherOptions, ot as DispatchReplyFromConfig, rE as ReplyDispatcherWithTypingOptions, tE as ReplyDispatcher, v_ as PublicReplyParams } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { y as ReplyToMode } from "./types.base-BJujKINr.js";
import "./types-ACDCRjU-.js";
import { t as getReplyFromConfig } from "./get-reply-C5S9Zf4a.js";
import "./btw-command-QfdMp8Bg.js";
/** Token that marks an auto-reply response as intentionally silent. */
declare const SILENT_REPLY_TOKEN = "NO_REPLY";
/** Returns true only for the exact, case-insensitive whole-reply control token. */
declare function isSilentReplyText(text?: string): boolean;
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
declare function dispatchInboundMessageForSdk(params: PublicReplyParams<Parameters<typeof dispatchInboundMessage>[0]>): Promise<DispatchFromConfigResult>;
declare function dispatchInboundMessageWithBufferedDispatcherForSdk(params: PublicReplyParams<Parameters<typeof dispatchInboundMessageWithBufferedDispatcher>[0]>): Promise<DispatchFromConfigResult>;
declare function dispatchInboundMessageWithDispatcherForSdk(params: PublicReplyParams<Parameters<typeof dispatchInboundMessageWithDispatcher>[0]>): Promise<DispatchFromConfigResult>;
declare function getReplyFromConfigForSdk(ctx: Parameters<typeof getReplyFromConfig>[0], opts?: GetReplyOptions, config?: Parameters<typeof getReplyFromConfig>[2]): Promise<ReplyPayload[] | ReplyPayload | undefined>;
type GroupActivationMode = "mention" | "always";
declare function normalizeGroupActivation(raw?: string | null): GroupActivationMode | undefined;
declare function parseActivationCommand(raw?: string): {
  hasCommand: boolean;
  mode?: GroupActivationMode;
};
declare function resetInboundDedupe(): void;
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
export { dispatchInboundMessageForSdk as a, getReplyFromConfigForSdk as c, parseActivationCommand as i, SILENT_REPLY_TOKEN as l, resetInboundDedupe as n, dispatchInboundMessageWithBufferedDispatcherForSdk as o, normalizeGroupActivation as r, dispatchInboundMessageWithDispatcherForSdk as s, createReplyReferencePlanner as t, isSilentReplyText as u };