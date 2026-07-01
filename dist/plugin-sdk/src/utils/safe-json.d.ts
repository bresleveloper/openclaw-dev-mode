/**
 * Defensive JSON stringify helper for diagnostics.
 *
 * The replacer handles values common in runtime logs that JSON.stringify would
 * otherwise reject or erase, and returns null for circular structures.
 */
/** Safely stringify diagnostic values, preserving bigint/errors/functions in readable form. */
export declare function safeJsonStringify(value: unknown): string | null;
