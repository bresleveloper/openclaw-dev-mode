import { type FenceScanState } from "./fences.js";
/** Incremental inline-code scanner state carried across chunk boundaries. */
export type InlineCodeState = {
    /** Whether the current scan is inside an unterminated inline code span. */
    open: boolean;
    /** Backtick run length required to close the current inline code span. */
    ticks: number;
};
/** Creates the carry-forward state used when scanning inline code across chunks. */
export declare function createInlineCodeState(): InlineCodeState;
type CodeSpanIndex = {
    /** Inline-code state to carry into the next streamed chunk. */
    inlineState: InlineCodeState;
    /** Fenced-code state to carry into the next streamed chunk. */
    fenceState: FenceScanState;
    /** True when an offset is inside fenced code or inline code. */
    isInside: (index: number) => boolean;
};
/** Builds a lookup for fenced and inline code spans while preserving scanner state. */
export declare function buildCodeSpanIndex(text: string, inlineState?: InlineCodeState, fenceState?: FenceScanState): CodeSpanIndex;
export {};
