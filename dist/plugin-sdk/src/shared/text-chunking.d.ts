/**
 * Splits text into bounded chunks using caller-owned soft-break selection.
 *
 * The resolver sees each limit-sized window and returns an in-window break index;
 * invalid indexes fall back to the hard limit so chunking always makes progress.
 */
export declare function avoidTrailingHighSurrogateBreak(text: string, start: number, end: number): number;
export declare function chunkTextByBreakResolver(text: string, limit: number, resolveBreakIndex: (window: string) => number): string[];
