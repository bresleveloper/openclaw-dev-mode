import type { ChannelProgressDraftLine } from "./streaming.js";
/** Progress draft state can mix legacy plain text lines with keyed structured lines. */
type ProgressDraftLine = string | ChannelProgressDraftLine;
/**
 * Removes a keyed structured progress line while preserving plain text draft lines.
 * Returns the original array when no line is removed so renderers can use identity as a no-op signal.
 */
export declare function removeChannelProgressDraftLine<TLine extends ProgressDraftLine>(lines: TLine[], id: string): TLine[];
export {};
