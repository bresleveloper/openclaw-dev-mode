type ToolResultCounts = {
    total: number;
    errors: number;
};
/** Extracts de-duplicated tool names from direct fields and structured content blocks. */
export declare const extractToolCallNames: (message: Record<string, unknown>) => string[];
/** Returns whether a transcript message contains any recognized tool-call marker. */
export declare const hasToolCall: (message: Record<string, unknown>) => boolean;
/** Counts recognized tool-result blocks and the subset explicitly marked as errors. */
export declare const countToolResults: (message: Record<string, unknown>) => ToolResultCounts;
export {};
