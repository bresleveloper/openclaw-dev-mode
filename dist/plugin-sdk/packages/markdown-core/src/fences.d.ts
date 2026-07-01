/** Markdown fenced-code block span with the opener data needed to reopen it. */
export type FenceSpan = {
    start: number;
    end: number;
    openLine: string;
    marker: string;
    indent: string;
};
/** Streaming fence scanner state carried across partial markdown chunks. */
export type FenceScanState = {
    atLineStart?: boolean;
    open?: {
        markerChar: string;
        markerLen: number;
        openLine: string;
        marker: string;
        indent: string;
    };
};
/** Scans fenced-code spans incrementally so chunking can carry an open fence forward. */
export declare function scanFenceSpans(buffer: string, state?: FenceScanState): {
    spans: FenceSpan[];
    state: FenceScanState;
};
/** Parses all fenced-code spans in a complete markdown buffer. */
export declare function parseFenceSpans(buffer: string): FenceSpan[];
/** Looks up the fence containing an offset; spans must be sorted by start offset. */
export declare function findFenceSpanAt(spans: FenceSpan[], index: number): FenceSpan | undefined;
/** True when a chunk boundary would not split a fenced-code block. */
export declare function isSafeFenceBreak(spans: FenceSpan[], index: number): boolean;
