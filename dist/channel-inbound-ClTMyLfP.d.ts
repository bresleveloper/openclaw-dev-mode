import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { Ct as TurnAdoptionLifecycle, Gt as ResolvedGroupThreadConfig, Wt as GroupThreadMentionFacts, an as InboundEventKind, st as FinalizedMsgContext } from "./reply-payload-DazZPys5.js";
import "./types-C-BtfS0H.js";
import { Aa as filterChannelInboundSupplementalContext, Ca as BuiltChannelInboundEventContext, Ga as PreparedChannelTurn, Ia as ChannelProviderOwnedMessageSendingDeliveryAdapter, Ka as RunChannelTurnParams, Na as AssembledChannelTurn, Pa as ChannelCoreManagedTurnDeliveryAdapter, Sa as BuildChannelInboundEventContextParams, Ua as ConversationFacts, Va as ChannelTurnResult, Wa as InboundMediaFacts, ga as ExplicitMentionSignal, ha as BuildMentionRegexesOptions, ku as appendTranscriptEvent, ma as PluginRuntime, oo as resolveCommandAuthorizedFromAuthorizers, qa as ChannelDeliveryOutcome, yo as DispatchFromConfigResult, za as ChannelTurnPlan } from "./agent-harness-runtime-DZjstJNb.js";
import { i as MediaFactLegacyProjection } from "./media-facts-BUTxYH1x.js";
import { n as HistoryMediaEntry } from "./history.types-gAzBXfec.js";
import { S as MessageReceipt } from "./types-DemD-QhX.js";
import { t as ChannelId } from "./channel-id.types-CM2F8b5e.js";
import "./types.public-DpLTXZT0.js";
import { ht as ReplyDispatchKind } from "./hook-runner-global-Jvv9WFUW.js";
import { C as ResolvedChannelMessageIngress, l as ChannelIngressContextBinding } from "./pairing-store.types-D3p0FhGO.js";
import { a as CommandNormalizeOptions } from "./commands-registry.types-jZJZUR9T.js";
import { n as EnvelopeFormatOptions } from "./envelope-BoZWwAQ5.js";
import { n as createInboundDebouncer, t as InboundDebounceCreateParams } from "./inbound-debounce-4PGNaNEe.js";
import { n as OutboundReplyPayload } from "./reply-payload-OW17IyAQ.js";
import { t as AccessGroupMembershipResolver } from "./access-groups-ohtq1rph.js";
import { n as DmGroupAccessReasonCode } from "./dm-policy-shared-BQETzBuF.js";
import "./channel-access-compat-CuzvLvYk.js";
import "./commands-registry-BaDuTseL.js";
import "./envelope-D2RIXAzx.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-D19RX4vZ.js";
//#region src/channels/turn/dispatch-result.d.ts
/** Minimal dispatch result shape needed to count visible channel deliveries. */
type ChannelTurnDispatchResultLike = {
  queuedFinal?: boolean;
  counts?: Partial<Record<ReplyDispatchKind, number>>;
  settledReceipt?: {
    anyVisibleDelivered: boolean;
    counts: Partial<Record<ReplyDispatchKind, {
      delivered: number;
      failedAfterSend: number;
    }>>;
  };
  observedReplyDelivery?: boolean;
  deferredToActiveRun?: "steer" | "followup";
} | null | undefined;
/** Extra delivery signals observed outside the normal dispatch count payload. */
type ChannelTurnVisibleDeliverySignals = {
  observedReplyDelivery?: boolean;
  fallbackDelivered?: boolean;
  deliverySummaryDelivered?: boolean;
};
type FinalDeliverySignals = Pick<ChannelTurnVisibleDeliverySignals, "fallbackDelivered" | "deliverySummaryDelivered">;
declare function resolveChannelTurnDispatchCounts(result: ChannelTurnDispatchResultLike): {
  tool: number;
  block: number;
  final: number;
};
declare function hasVisibleChannelTurnDispatch(result: ChannelTurnDispatchResultLike, signals?: ChannelTurnVisibleDeliverySignals): boolean;
declare function hasFinalChannelTurnDispatch(result: ChannelTurnDispatchResultLike, signals?: FinalDeliverySignals): boolean;
//#endregion
//#region src/auto-reply/group-thread-context.d.ts
type GroupThreadParticipant = {
  agentId: string;
  name: string;
};
type GroupThreadTurn = GroupThreadParticipant & {
  round: number;
  messageId: string;
  digest?: string;
};
/** Data-only delivery identity, including unlabeled single-participant groups. */
declare function getGroupThreadDeliverySession(): {
  agentId: string;
  sessionKey: string;
} | undefined;
//#endregion
//#region src/auto-reply/group-thread.d.ts
/** One owner reserves participant turns before launch; transports retain delivery ownership. */
declare function runGroupThread<T>(params: {
  cfg: OpenClawConfig;
  group: ResolvedGroupThreadConfig;
  channel: string;
  accountId?: string;
  peerId: string;
  threadId?: string | number;
  messageId?: string;
  text: string;
  mentionedAgentIds?: string[];
  abortSignal?: AbortSignal;
  formatReply?: (text: string, participant: GroupThreadParticipant) => string;
  runTurn: (turn: GroupThreadTurn) => Promise<T>;
  onError?: (error: unknown, turn: GroupThreadTurn) => void;
}): Promise<{
  results: T[];
  turnsStarted: number;
  failedTurns: number;
}>;
//#endregion
//#region src/auto-reply/group-thread-config.d.ts
declare function resolveGroupThreadConfig(params: {
  cfg: OpenClawConfig;
  channel: string;
  peerId: string;
}): ResolvedGroupThreadConfig | undefined;
declare function isGroupThreadRouteExclusive(params: {
  sessionKey?: string;
  acpBinding?: boolean;
}): boolean;
declare function resolveGroupThreadMentionFacts(params: {
  cfg: OpenClawConfig;
  channel: string;
  peerId: string;
  text: string;
  sessionKey?: string;
  acpBinding?: boolean;
}): GroupThreadMentionFacts | undefined;
//#endregion
//#region src/channels/turn/agent-run-terminal-outcome.d.ts
type AgentRunTerminalOutcome = "completed" | "failed";
declare function readAgentRunTerminalOutcome(result: unknown): AgentRunTerminalOutcome | undefined;
//#endregion
//#region src/channels/direct-dm-access.d.ts
/** Runtime hooks needed by the legacy direct-DM access resolver. */
type DirectDmCommandAuthorizationRuntime = {
  shouldComputeCommandAuthorized: (rawBody: string, cfg: OpenClawConfig) => boolean;
  /** @deprecated Command authorization is resolved by channel ingress. Kept for runtime injection compatibility. */
  resolveCommandAuthorizedFromAuthorizers?: typeof resolveCommandAuthorizedFromAuthorizers;
};
/**
 * Legacy direct-DM ingress decision with command-authorization compatibility fields.
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
type ResolvedInboundDirectDmAccess = {
  access: {
    decision: "allow" | "block" | "pairing";
    reasonCode: DmGroupAccessReasonCode;
    reason: string;
    effectiveAllowFrom: string[];
  };
  shouldComputeAuth: boolean;
  senderAllowedForCommands: boolean;
  commandAuthorized: boolean | undefined;
};
/**
 * Resolves legacy direct-DM access lists, pairing-store entries, and command authorization.
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
declare function resolveInboundDirectDmAccessWithRuntime(params: {
  cfg: OpenClawConfig;
  channel: ChannelId;
  accountId: string;
  dmPolicy?: string | null;
  allowFrom?: Array<string | number> | null;
  senderId: string;
  rawBody: string;
  isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
  resolveAccessGroupMembership?: AccessGroupMembershipResolver;
  runtime: DirectDmCommandAuthorizationRuntime;
  modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
  readStoreAllowFrom?: (provider: ChannelId, accountId: string) => Promise<string[]>;
}): Promise<ResolvedInboundDirectDmAccess>;
/**
 * Creates a pre-crypto authorizer that can issue pairing challenges before payload decryption.
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
declare function createPreCryptoDirectDmAuthorizer(params: {
  resolveAccess: (senderId: string) => Promise<Pick<ResolvedInboundDirectDmAccess, "access"> | ResolvedInboundDirectDmAccess>;
  issuePairingChallenge?: (params: {
    senderId: string;
    reply: (text: string) => Promise<void>;
  }) => Promise<void>;
  onBlocked?: (params: {
    senderId: string;
    reason: string;
    reasonCode: DmGroupAccessReasonCode;
  }) => void;
}): (input: {
  senderId: string;
  reply: (text: string) => Promise<void>;
}) => Promise<"allow" | "block" | "pairing">;
//#endregion
//#region src/channels/direct-dm-guard-policy.d.ts
/** Runtime limits applied before direct-DM encrypted payloads are decrypted. */
type DirectDmPreCryptoGuardPolicy = {
  /** Accepted encrypted event kinds before decryption, e.g. Nostr kind 4. */
  allowedKinds: readonly number[];
  /** Maximum sender timestamp skew allowed into the future. */
  maxFutureSkewSec: number;
  /** Maximum encrypted payload bytes accepted before decrypt work starts. */
  maxCiphertextBytes: number;
  /** Maximum decrypted plaintext bytes accepted after decrypt succeeds. */
  maxPlaintextBytes: number;
  /** Per-sender and global throttles for encrypted DM ingress. */
  rateLimit: {
    /** Fixed rate-limit window size. */
    windowMs: number;
    /** Maximum messages per sender key inside one window. */
    maxPerSenderPerWindow: number;
    /** Maximum messages across all sender keys inside one window. */
    maxGlobalPerWindow: number;
    /** Maximum sender keys retained by the in-memory limiter. */
    maxTrackedSenderKeys: number;
  };
};
/** Partial overrides for channel plugins that need stricter pre-crypto limits. */
type DirectDmPreCryptoGuardPolicyOverrides = Partial<Omit<DirectDmPreCryptoGuardPolicy, "rateLimit">> & {
  rateLimit?: Partial<DirectDmPreCryptoGuardPolicy["rateLimit"]>;
};
/** Builds the shared policy object for DM-style pre-crypto guardrails. */
declare function createDirectDmPreCryptoGuardPolicy(overrides?: DirectDmPreCryptoGuardPolicyOverrides): DirectDmPreCryptoGuardPolicy;
//#endregion
//#region src/channels/direct-dm.d.ts
type DirectDmRoutePeer = {
  kind: "direct";
  id: string;
};
type DirectDmRoute = {
  agentId: string;
  sessionKey: string;
  accountId?: string;
};
type DispatchInboundDirectDmParams = {
  cfg: OpenClawConfig;
  channel: string;
  channelLabel: string;
  accountId: string;
  peer: DirectDmRoutePeer;
  senderId: string;
  senderAddress: string;
  recipientAddress: string;
  conversationLabel: string;
  rawBody: string;
  messageId: string;
  timestamp?: number;
  commandAuthorized?: boolean;
  turnAdoptionLifecycle?: TurnAdoptionLifecycle;
  /** Shipped SDK callers may omit provenance; bundled callers must classify it explicitly. */
  channelIngress?: ResolvedChannelMessageIngress | "unsupported";
  /** Resolve the exact admitted result after this helper owns the final route. */
  resolveChannelIngress?: (contextBinding: ChannelIngressContextBinding) => Promise<ResolvedChannelMessageIngress>;
  /** Opaque record-scoped runtime injected by a registered native channel. */
  channelRuntime?: {
    inbound?: {
      buildContext?: unknown;
    };
  };
  /** Set only after the channel's sender/pairing guard admits this event. */
  inboundAccessAuthorized?: boolean;
  bodyForAgent?: string;
  commandBody?: string;
  provider?: string;
  surface?: string;
  originatingChannel?: string;
  originatingTo?: string;
  extraContext?: Record<string, unknown>;
  deliver: (payload: OutboundReplyPayload) => Promise<void>;
  onRecordError: (err: unknown) => void;
  onDispatchError: (err: unknown, info: {
    kind: string;
  }) => void;
};
declare function dispatchInboundDirectDm(params: DispatchInboundDirectDmParams): Promise<{
  route: DirectDmRoute;
  ctxPayload: FinalizedMsgContext;
}>;
declare function dispatchInboundDirectDmWithRuntime(params: Omit<DispatchInboundDirectDmParams, "resolveChannelIngress"> & {
  runtime: PluginRuntime;
}): Promise<{
  route: DirectDmRoute;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
}>;
//#endregion
//#region src/auto-reply/reply/mentions.d.ts
/** Builds mention regexes from config, agent identity, and channel policy. */
declare function buildMentionRegexes(cfg: OpenClawConfig | undefined, agentId?: string, options?: BuildMentionRegexesOptions): RegExp[];
/** Normalizes text before mention matching. */
declare function normalizeMentionText(text: string): string;
/** Returns true when text matches one of the configured mention patterns. */
declare function matchesMentionPatterns(text: string, mentionRegexes: RegExp[]): boolean;
/** Combines regex mention matching with provider-native explicit mention metadata. */
declare function matchesMentionWithExplicit(params: {
  text: string;
  mentionRegexes: RegExp[];
  explicit?: ExplicitMentionSignal;
  transcript?: string;
}): boolean;
//#endregion
//#region src/channels/inbound-debounce-policy.d.ts
/** Returns true when an inbound text event is safe to debounce before dispatch. */
declare function shouldDebounceTextInbound(params: {
  text: string | null | undefined;
  cfg: OpenClawConfig;
  hasMedia?: boolean;
  commandOptions?: CommandNormalizeOptions;
  allowDebounce?: boolean;
}): boolean;
/** Snapshot timing by default; resolveDebounceMs opts into per-entry timing. */
declare function createChannelInboundDebouncer<T>(params: Omit<InboundDebounceCreateParams<T>, "debounceMs"> & {
  cfg: OpenClawConfig;
  channel: string;
  debounceMsOverride?: number;
}): {
  debounceMs: number;
  debouncer: ReturnType<typeof createInboundDebouncer<T>>;
};
//#endregion
//#region src/channels/session-envelope.d.ts
/** Resolves envelope options and previous timestamp for one inbound channel session. */
declare function resolveInboundSessionEnvelopeContext(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
}): {
  storePath: string;
  envelopeOptions: EnvelopeFormatOptions;
  previousTimestamp: number | undefined;
};
//#endregion
//#region src/channels/inbound-event/classification.d.ts
type ClassifyChannelInboundEventParams = {
  conversation: Pick<ConversationFacts, "kind">;
  unmentionedGroupPolicy?: InboundEventKind;
  wasMentioned?: boolean;
  hasControlCommand?: boolean;
  hasAbortRequest?: boolean;
  commandSource?: "native" | "text";
};
declare function classifyChannelInboundEvent(params: ClassifyChannelInboundEventParams): InboundEventKind;
declare function resolveUnmentionedGroupInboundPolicy(params: {
  cfg: OpenClawConfig;
  agentId?: string;
}): InboundEventKind;
//#endregion
//#region src/channels/feedback-reflection.d.ts
declare const DEFAULT_CHANNEL_FEEDBACK_REFLECTION_COOLDOWN_MS = 300000;
declare function recordChannelFeedbackEvent(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  event: Parameters<typeof appendTranscriptEvent>[1];
}): Promise<boolean>;
type ChannelFeedbackReflectionResult = {
  status: "cooldown";
} | {
  status: "empty";
} | {
  status: "complete";
  learning: string;
  storePath: string;
  followUp: boolean;
  userMessage?: string;
  responseLength: number;
};
declare function runChannelFeedbackReflection(params: {
  cfg: OpenClawConfig;
  channel: string;
  channelLabel: string;
  accountId?: string;
  agentId: string;
  sessionKey: string;
  conversationId: string;
  conversationKind: "direct" | "group" | "channel";
  thumbedDownResponse?: string;
  userComment?: string;
  cooldownMs?: number;
  onRecordError?: (error: unknown) => void;
  onDispatchError?: (error: unknown) => void;
}): Promise<ChannelFeedbackReflectionResult>;
//#endregion
//#region src/channels/turn/partial-delivery-error.d.ts
declare const CHANNEL_PARTIAL_DELIVERY_ERROR_CODE = "CHANNEL_PARTIAL_DELIVERY";
type ChannelPartialDeliveryEnvelope = {
  cause?: unknown;
  code: typeof CHANNEL_PARTIAL_DELIVERY_ERROR_CODE;
  deliveryResult: ChannelDeliveryOutcome & {
    visibleReplySent: true;
  };
};
type ChannelPartialDeliveryError = Error & ChannelPartialDeliveryEnvelope;
/** Preserves provider-visible delivery facts when a later native operation fails. */
declare function createChannelPartialDeliveryError(cause: unknown, deliveryResult: ChannelDeliveryOutcome & {
  visibleReplySent: true;
}): ChannelPartialDeliveryError & {
  sentBeforeError: true;
  visibleReplySent: true;
};
declare function isChannelPartialDeliveryError(error: unknown): error is ChannelPartialDeliveryEnvelope;
//#endregion
//#region src/channels/turn/delivery-result.d.ts
type ReceiptParams = Parameters<typeof createMessageReceiptFromOutboundResults>[0];
/** Aggregates caller-confirmed sends, preserving nested receipts before legacy message IDs. */
declare function createAcceptedChannelDeliveryResult(params: Pick<ReceiptParams, "kind" | "replyToId"> & {
  results?: ReceiptParams["results"];
  deliveryResults?: readonly ChannelDeliveryOutcome[];
  content?: string;
}): {
  messageIds: string[];
  receipt: MessageReceipt;
  visibleReplySent: true;
  content?: string;
};
//#endregion
//#region src/channels/inbound-event/media.d.ts
/** Attachment metadata accepted from channel plugins before core normalization. */
type ChannelInboundMediaInput = {
  path?: string | null;
  url?: string | null;
  contentType?: string | null;
  fileName?: string | null;
  kind?: InboundMediaFacts["kind"] | null;
  durationMs?: number | null;
  width?: number | null;
  height?: number | null;
  transcribed?: boolean | null;
  messageId?: string | null;
};
type MediaPlaceholderTextFact = Readonly<Pick<ChannelInboundMediaInput, "contentType" | "kind" | "path" | "url">>;
/** Renders structured media facts for channel surfaces that can carry text only. */
declare function formatMediaPlaceholderText(media: readonly MediaPlaceholderTextFact[]): string;
/**
 * Legacy environment fields consumed by prompt/context builders.
 * @deprecated Pass ordered `InboundMediaFacts[]` as the context's `media` field.
 */
type ChannelInboundMediaPayload = MediaFactLegacyProjection;
/** Appends an unavailable-media notice to real caption text, or returns the notice alone. */
declare function formatInboundMediaUnavailableText(params: {
  body?: string | null;
  notice: string;
}): string;
/** Normalizes plugin-provided attachments into ordered runtime facts. */
declare function toInboundMediaFacts(media: readonly ChannelInboundMediaInput[] | null | undefined, defaults?: {
  kind?: InboundMediaFacts["kind"];
  messageId?: string;
  transcribed?: (media: ChannelInboundMediaInput, index: number) => boolean;
}): InboundMediaFacts[];
/** Adds best-effort audio/video metadata without probing URL-only media. */
declare function toInboundMediaFactsWithMetadata(media: readonly ChannelInboundMediaInput[] | null | undefined, defaults?: Parameters<typeof toInboundMediaFacts>[1]): Promise<InboundMediaFacts[]>;
/** Projects facts into history without transient turn-only fields. */
declare function toHistoryMediaEntries(media: readonly ChannelInboundMediaInput[] | null | undefined, defaults?: {
  kind?: InboundMediaFacts["kind"];
  messageId?: string;
}): HistoryMediaEntry[];
/**
 * Builds the legacy singular/plural environment projection.
 * @deprecated Pass ordered facts as `media`; use `toInboundMediaFacts` to normalize inputs.
 */
declare function buildChannelInboundMediaPayload(media: readonly InboundMediaFacts[] | null | undefined): ChannelInboundMediaPayload;
//#endregion
//#region src/plugin-sdk/channel-inbound.d.ts
/**
 * Deprecated turn-context input alias that still accepts the old `inboundTurnKind` name.
 *
 * @deprecated Use `BuildChannelInboundEventContextParams`.
 */
type BuildChannelTurnContextParams = Omit<BuildChannelInboundEventContextParams, "message"> & {
  message: BuildChannelInboundEventContextParams["message"] & {
    inboundTurnKind?: InboundEventKind;
  };
};
/**
 * Deprecated turn-context result alias with the historical `InboundTurnKind` field.
 *
 * @deprecated Use `BuiltChannelInboundEventContext`.
 */
type BuiltChannelTurnContext = BuiltChannelInboundEventContext & {
  InboundTurnKind: InboundEventKind;
};
/**
 * Builds inbound-event context for callers still passing `inboundTurnKind`.
 *
 * @deprecated Use `buildChannelInboundEventContext`.
 */
declare function buildChannelTurnContext(params: BuildChannelTurnContextParams): BuiltChannelTurnContext;
/**
 * Deprecated supplemental-context filter alias retained for channel SDK compatibility.
 *
 * @deprecated Use `filterChannelInboundSupplementalContext`.
 */
declare const filterChannelTurnSupplementalContext: typeof filterChannelInboundSupplementalContext;
type ChannelInboundEventRunnerParams<TRaw, TDispatchResult = DispatchFromConfigResult> = RunChannelTurnParams<TRaw, TDispatchResult>;
type PreparedInboundReply<TDispatchResult> = PreparedChannelTurn<TDispatchResult>;
type AssembledInboundReply = AssembledChannelTurn;
type ChannelInboundTurnPlan<TOwnership extends "core" | "provider_message_sending" = "core"> = ChannelTurnPlan<TOwnership extends "provider_message_sending" ? ChannelProviderOwnedMessageSendingDeliveryAdapter : ChannelCoreManagedTurnDeliveryAdapter>;
type InboundReplyDispatchResult<TDispatchResult> = ChannelTurnResult<TDispatchResult>;
declare function runPreparedInboundReply<TDispatchResult>(params: PreparedChannelTurn<TDispatchResult>): Promise<ChannelTurnResult<TDispatchResult>>;
declare function runChannelInboundEvent<TRaw, TDispatchResult = DispatchFromConfigResult>(params: RunChannelTurnParams<TRaw, TDispatchResult, ChannelProviderOwnedMessageSendingDeliveryAdapter>): Promise<ChannelTurnResult<TDispatchResult>>;
declare function runChannelInboundEvent<TRaw, TDispatchResult = DispatchFromConfigResult>(params: ChannelInboundEventRunnerParams<TRaw, TDispatchResult>): Promise<ChannelTurnResult<TDispatchResult>>;
declare function dispatchChannelInboundReply(params: AssembledInboundReply): Promise<ChannelTurnResult>;
declare function dispatchChannelInboundTurn(params: ChannelInboundTurnPlan<"provider_message_sending">): Promise<ChannelTurnResult>;
declare function dispatchChannelInboundTurn(params: ChannelInboundTurnPlan): Promise<ChannelTurnResult>;
//#endregion
export { resolveGroupThreadConfig as $, runChannelFeedbackReflection as A, normalizeMentionText as B, createAcceptedChannelDeliveryResult as C, ChannelFeedbackReflectionResult as D, isChannelPartialDeliveryError as E, createChannelInboundDebouncer as F, createDirectDmPreCryptoGuardPolicy as G, dispatchInboundDirectDmWithRuntime as H, shouldDebounceTextInbound as I, createPreCryptoDirectDmAuthorizer as J, DirectDmCommandAuthorizationRuntime as K, buildMentionRegexes as L, classifyChannelInboundEvent as M, resolveUnmentionedGroupInboundPolicy as N, DEFAULT_CHANNEL_FEEDBACK_REFLECTION_COOLDOWN_MS as O, resolveInboundSessionEnvelopeContext as P, isGroupThreadRouteExclusive as Q, matchesMentionPatterns as R, toInboundMediaFactsWithMetadata as S, createChannelPartialDeliveryError as T, DirectDmPreCryptoGuardPolicy as U, dispatchInboundDirectDm as V, DirectDmPreCryptoGuardPolicyOverrides as W, AgentRunTerminalOutcome as X, resolveInboundDirectDmAccessWithRuntime as Y, readAgentRunTerminalOutcome as Z, buildChannelInboundMediaPayload as _, ChannelInboundTurnPlan as a, hasVisibleChannelTurnDispatch as at, toHistoryMediaEntries as b, buildChannelTurnContext as c, filterChannelTurnSupplementalContext as d, resolveGroupThreadMentionFacts as et, runChannelInboundEvent as f, MediaPlaceholderTextFact as g, ChannelInboundMediaPayload as h, ChannelInboundEventRunnerParams as i, hasFinalChannelTurnDispatch as it, ClassifyChannelInboundEventParams as j, recordChannelFeedbackEvent as k, dispatchChannelInboundReply as l, ChannelInboundMediaInput as m, BuildChannelTurnContextParams as n, GroupThreadTurn as nt, InboundReplyDispatchResult as o, resolveChannelTurnDispatchCounts as ot, runPreparedInboundReply as p, ResolvedInboundDirectDmAccess as q, BuiltChannelTurnContext as r, getGroupThreadDeliverySession as rt, PreparedInboundReply as s, AssembledInboundReply as t, runGroupThread as tt, dispatchChannelInboundTurn as u, formatInboundMediaUnavailableText as v, ChannelPartialDeliveryError as w, toInboundMediaFacts as x, formatMediaPlaceholderText as y, matchesMentionWithExplicit as z };