/** Validates an absolute inbound root pattern with whole-segment wildcards only. */
export declare function isValidInboundPathRootPattern(value: string): boolean;
/** Normalizes configured inbound attachment roots, dropping invalid or duplicate patterns. */
export declare function normalizeInboundPathRoots(roots?: readonly string[]): string[];
/** Merges inbound attachment root lists while preserving first-seen priority. */
export declare function mergeInboundPathRoots(...rootsLists: Array<readonly string[] | undefined>): string[];
/** Checks whether a candidate inbound media path is covered by configured or fallback roots. */
export declare function isInboundPathAllowed(params: {
    filePath: string;
    roots: readonly string[];
    fallbackRoots?: readonly string[];
}): boolean;
