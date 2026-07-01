import { i as OpenClawConfig } from "./types.openclaw-DlpCUWMr.js";
import { _ as InboundEventKind } from "./templating-BpD1cfFX.js";
import { n as HistoryMediaEntry } from "./history.types-Bc8mCALh.js";
import { s as CommandNormalizeOptions } from "./commands-registry.types-BMJ8ysZi.js";
import { Ar as ConversationFacts, Lr as EnvelopeFormatOptions, Mr as InboundMediaFacts, br as filterChannelInboundSupplementalContext, fr as BuildChannelInboundEventContextParams, pr as BuiltChannelInboundEventContext } from "./types-BVLQjFJF.js";
import { n as createInboundDebouncer, t as InboundDebounceCreateParams } from "./inbound-debounce-Bz3CMczW.js";
//#region src/channels/inbound-debounce-policy.d.ts
/** Returns true when an inbound text event is safe to debounce before dispatch. */
declare function shouldDebounceTextInbound(params: {
  text: string | null | undefined;
  cfg: OpenClawConfig;
  hasMedia?: boolean;
  commandOptions?: CommandNormalizeOptions;
  allowDebounce?: boolean;
}): boolean;
/** Creates a channel-scoped inbound debouncer using config/default debounce timing. */
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
/**
 * Facts needed to classify whether inbound room activity should wake the agent.
 */
type ClassifyChannelInboundEventParams = {
  conversation: Pick<ConversationFacts, "kind">;
  unmentionedGroupPolicy?: InboundEventKind;
  wasMentioned?: boolean;
  hasControlCommand?: boolean;
  hasAbortRequest?: boolean;
  commandSource?: "native" | "text";
};
/**
 * Classifies an inbound channel event as an actionable request or passive room event.
 */
declare function classifyChannelInboundEvent(params: ClassifyChannelInboundEventParams): InboundEventKind;
/**
 * Resolves the configured policy for unmentioned group/channel inbound events.
 */
declare function resolveUnmentionedGroupInboundPolicy(params: {
  cfg: OpenClawConfig;
  agentId?: string;
}): InboundEventKind;
//#endregion
//#region src/channels/inbound-event/media.d.ts
/**
 * Attachment metadata accepted from channel plugins before core normalization.
 */
type ChannelInboundMediaInput = {
  path?: string | null;
  url?: string | null;
  contentType?: string | null;
  kind?: InboundMediaFacts["kind"] | null;
  transcribed?: boolean | null;
  messageId?: string | null;
};
/**
 * Environment payload fields consumed by prompt/context builders for inbound media attachments.
 */
type ChannelInboundMediaPayload = {
  MediaPath?: string;
  MediaUrl?: string;
  MediaType?: string;
  MediaPaths?: string[];
  MediaUrls?: string[];
  MediaTypes?: string[];
  MediaTranscribedIndexes?: number[];
};
/**
 * Normalizes plugin-provided attachment facts into the channel turn media shape.
 */
declare function toInboundMediaFacts(media: readonly ChannelInboundMediaInput[] | null | undefined, defaults?: {
  kind?: InboundMediaFacts["kind"];
  messageId?: string;
  transcribed?: (media: ChannelInboundMediaInput, index: number) => boolean;
}): InboundMediaFacts[];
/**
 * Projects inbound attachment facts into transcript history without transient turn-only flags.
 */
declare function toHistoryMediaEntries(media: readonly ChannelInboundMediaInput[] | null | undefined, defaults?: {
  kind?: InboundMediaFacts["kind"];
  messageId?: string;
}): HistoryMediaEntry[];
/**
 * Builds prompt environment media fields while keeping single-item legacy fields populated.
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
//#endregion
export { ChannelInboundMediaInput as a, toHistoryMediaEntries as c, classifyChannelInboundEvent as d, resolveUnmentionedGroupInboundPolicy as f, shouldDebounceTextInbound as h, filterChannelTurnSupplementalContext as i, toInboundMediaFacts as l, createChannelInboundDebouncer as m, BuiltChannelTurnContext as n, ChannelInboundMediaPayload as o, resolveInboundSessionEnvelopeContext as p, buildChannelTurnContext as r, buildChannelInboundMediaPayload as s, BuildChannelTurnContextParams as t, ClassifyChannelInboundEventParams as u };