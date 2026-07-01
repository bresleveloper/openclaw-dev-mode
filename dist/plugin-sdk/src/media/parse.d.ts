/** Captures legacy MEDIA: attachment directives from model/tool output. */
export declare const MEDIA_TOKEN_RE: RegExp;
/** Ordered output segment emitted after visible text and extracted media are separated. */
type ParsedMediaOutputSegment = {
    type: "text";
    text: string;
} | {
    type: "media";
    url: string;
};
/** Controls which non-MEDIA syntaxes may be lifted into media attachments. */
export type SplitMediaFromOutputOptions = {
    extractMarkdownImages?: boolean;
    extractMediaDirectives?: boolean;
};
/** Converts file URLs into plain local paths before downstream media validation. */
export declare function normalizeMediaSource(src: string): string;
/** Splits tool/stdout text into visible text, media attachments, voice tags, and ordered segments. */
export declare function splitMediaFromOutput(raw: string, options?: SplitMediaFromOutputOptions): {
    text: string;
    mediaUrls?: string[];
    /** @deprecated Use mediaUrls[0]. */
    mediaUrl?: string;
    audioAsVoice?: boolean;
    segments?: ParsedMediaOutputSegment[];
};
export {};
