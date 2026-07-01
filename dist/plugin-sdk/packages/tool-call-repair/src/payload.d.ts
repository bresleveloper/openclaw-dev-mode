/** Parsed standalone plain-text tool call block with source offsets for repair. */
export type PlainTextToolCallBlock = {
    /** Parsed JSON arguments object. */
    arguments: Record<string, unknown>;
    /** Exclusive end offset of the parsed block. */
    end: number;
    /** Tool name parsed from bracket, Harmony, or XML-ish syntax. */
    name: string;
    /** Original text slice that produced this block. */
    raw: string;
    /** Inclusive start offset of the parsed block. */
    start: number;
};
/** Parser limits and allowlist options for plain-text tool-call repair. */
export type PlainTextToolCallParseOptions = {
    /** Optional allowlist of tool names that may be repaired. */
    allowedToolNames?: Iterable<string>;
    /** Maximum JSON payload size accepted for one repaired call. */
    maxPayloadBytes?: number;
};
export declare function parseStandalonePlainTextToolCallBlocks(text: string, options?: PlainTextToolCallParseOptions): PlainTextToolCallBlock[] | null;
/** Removes full-line standalone plain-text tool-call blocks from user-visible text. */
export declare function stripPlainTextToolCallBlocks(text: string): string;
