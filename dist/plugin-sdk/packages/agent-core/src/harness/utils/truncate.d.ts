export declare const DEFAULT_MAX_LINES = 2000;
export declare const DEFAULT_MAX_BYTES: number;
export declare const GREP_MAX_LINE_LENGTH = 500;
/** Result metadata for content truncated by line count, byte count, or both. */
export interface TruncationResult {
    /** The truncated content */
    content: string;
    /** Whether truncation occurred */
    truncated: boolean;
    /** Which limit was hit: "lines", "bytes", or null if not truncated */
    truncatedBy: "lines" | "bytes" | null;
    /** Total number of lines in the original content */
    totalLines: number;
    /** Total number of bytes in the original content */
    totalBytes: number;
    /** Number of complete lines in the truncated output */
    outputLines: number;
    /** Number of bytes in the truncated output */
    outputBytes: number;
    /** Whether the last line was partially truncated (only for tail truncation edge case) */
    lastLinePartial: boolean;
    /** Whether the first line exceeded the byte limit (for head truncation) */
    firstLineExceedsLimit: boolean;
    /** The max lines limit that was applied */
    maxLines: number;
    /** The max bytes limit that was applied */
    maxBytes: number;
}
/** Byte and line ceilings used by the truncation helpers. */
export interface TruncationOptions {
    /** Maximum number of lines (default: 2000) */
    maxLines?: number;
    /** Maximum number of bytes (default: 50KB) */
    maxBytes?: number;
}
/**
 * Format byte counts for compact tool-output diagnostics.
 */
export declare function formatSize(bytes: number): string;
/**
 * Keep the beginning of content while respecting independent line and byte ceilings.
 *
 * Head truncation preserves complete lines; a first line that exceeds the byte
 * ceiling produces empty output and sets firstLineExceedsLimit.
 */
export declare function truncateHead(content: string, options?: TruncationOptions): TruncationResult;
/**
 * Keep the end of content while respecting independent line and byte ceilings.
 *
 * Tail truncation preserves recent output for command errors and may keep a
 * partial first line when one final line alone exceeds the byte ceiling.
 */
export declare function truncateTail(content: string, options?: TruncationOptions): TruncationResult;
/**
 * Trim a single display line and mark it with the grep-style truncation suffix.
 */
export declare function truncateLine(line: string, maxChars?: number): {
    text: string;
    wasTruncated: boolean;
};
