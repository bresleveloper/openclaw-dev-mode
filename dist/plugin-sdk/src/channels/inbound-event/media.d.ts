import type { HistoryMediaEntry } from "../../auto-reply/reply/history.types.js";
import type { InboundMediaFacts } from "../turn/types.js";
/**
 * Attachment metadata accepted from channel plugins before core normalization.
 */
export type ChannelInboundMediaInput = {
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
export type ChannelInboundMediaPayload = {
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
export declare function toInboundMediaFacts(media: readonly ChannelInboundMediaInput[] | null | undefined, defaults?: {
    kind?: InboundMediaFacts["kind"];
    messageId?: string;
    transcribed?: (media: ChannelInboundMediaInput, index: number) => boolean;
}): InboundMediaFacts[];
/**
 * Projects inbound attachment facts into transcript history without transient turn-only flags.
 */
export declare function toHistoryMediaEntries(media: readonly ChannelInboundMediaInput[] | null | undefined, defaults?: {
    kind?: InboundMediaFacts["kind"];
    messageId?: string;
}): HistoryMediaEntry[];
/**
 * Builds prompt environment media fields while keeping single-item legacy fields populated.
 */
export declare function buildChannelInboundMediaPayload(media: readonly InboundMediaFacts[] | null | undefined): ChannelInboundMediaPayload;
