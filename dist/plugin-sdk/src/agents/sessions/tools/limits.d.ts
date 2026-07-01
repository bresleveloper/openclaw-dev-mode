/**
 * Byte-limit helpers for session tool stderr/stdout tails.
 *
 * Tail storage is byte-bounded but decoded as UTF-8, so truncation avoids
 * splitting multi-byte characters in display output.
 */
/** Normalizes optional positive numeric limits to a finite integer. */
export declare function normalizePositiveLimit(value: number | undefined, fallback: number): number;
/** Default stderr tail retained for long-running session tools. */
export declare const SESSION_TOOL_STDERR_TAIL_BYTES: number;
/** Appends a chunk while retaining only the UTF-8-safe tail within maxBytes. */
export declare function appendBoundedTextTail(current: string, chunk: Buffer | string, maxBytes?: number): string;
