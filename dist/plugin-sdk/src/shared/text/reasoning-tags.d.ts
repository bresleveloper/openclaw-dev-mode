export type ReasoningTagMode = "strict" | "preserve";
export type ReasoningTagTrim = "none" | "start" | "both";
/** Detects whether a stray reasoning close tag separates two visible text regions. */
export declare function hasOrphanReasoningCloseBoundary(params: {
    before: string;
    after: string;
}): boolean;
/** Strips model reasoning/final tags from visible text while preserving literal code examples. */
export declare function stripReasoningTagsFromText(text: string, options?: {
    mode?: ReasoningTagMode;
    trim?: ReasoningTagTrim;
}): string;
