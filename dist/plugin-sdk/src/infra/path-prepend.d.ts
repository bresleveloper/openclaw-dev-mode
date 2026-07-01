/**
 * Find the actual key used for PATH in the env object.
 * On Windows, `process.env` stores it as `Path` (not `PATH`),
 * and after copying to a plain object the original casing is preserved.
 */
export declare function findPathKey(env: Record<string, string>): string;
/** Normalizes configured PATH prepends by trimming blanks and preserving first-seen order. */
export declare function normalizePathPrepend(entries?: string[]): string[];
/** Merges prepended PATH entries ahead of the existing PATH while deduping normalized parts. */
export declare function mergePathPrepend(existing: string | undefined, prepend: string[]): string | undefined;
/** Removes managed prepend entries from an existing PATH, including later duplicate copies. */
export declare function removePathPrepend(existing: string | undefined, prepend: string[]): string | undefined;
/** Applies configured PATH prepends in-place, preserving Windows PATH key casing. */
export declare function applyPathPrepend(env: Record<string, string>, prepend: string[] | undefined, options?: {
    requireExisting?: boolean;
}): void;
