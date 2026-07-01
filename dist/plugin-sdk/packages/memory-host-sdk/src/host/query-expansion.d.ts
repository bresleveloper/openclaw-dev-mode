/** Returns true for low-value conversational tokens that should not drive FTS matching. */
export declare function isQueryStopWordToken(token: string): boolean;
/**
 * Extract keywords from a conversational query for FTS search.
 *
 * Examples:
 * - "that thing we discussed about the API" → ["discussed", "API"]
 * - "之前讨论的那个方案" → ["讨论", "方案"]
 * - "what was the solution for the bug" → ["solution", "bug"]
 */
export declare function extractKeywords(query: string, opts?: {
    ftsTokenizer?: "unicode61" | "trigram";
}): string[];
