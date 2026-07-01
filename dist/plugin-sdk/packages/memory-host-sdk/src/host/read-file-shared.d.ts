import type { MemoryReadResult } from "./types.js";
/** Default number of lines returned by memory read helpers. */
export declare const DEFAULT_MEMORY_READ_LINES = 120;
/** Default max character budget for memory read helper output. */
export declare const DEFAULT_MEMORY_READ_MAX_CHARS = 12000;
export type { MemoryReadResult } from "./types.js";
/** Build a memory read result from an already-selected line slice. */
export declare function buildMemoryReadResultFromSlice(params: {
    selectedLines: string[];
    relPath: string;
    startLine: number;
    moreSourceLinesRemain?: boolean;
    maxChars?: number;
    suggestReadFallback?: boolean;
}): MemoryReadResult;
/** Build a memory read result from raw file content and caller range options. */
export declare function buildMemoryReadResult(params: {
    content: string;
    relPath: string;
    from?: number;
    lines?: number;
    defaultLines?: number;
    maxChars?: number;
    suggestReadFallback?: boolean;
}): MemoryReadResult;
