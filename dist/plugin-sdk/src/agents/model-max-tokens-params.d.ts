/** Resolve the first supported max-token parameter present in a params object. */
export declare function resolveMaxTokensParam(params: Record<string, unknown> | undefined): number | undefined;
/**
 * Canonicalize merged params to `maxTokens`, preserving source precedence from
 * left to right across the provided source objects.
 */
export declare function canonicalizeMaxTokensParam(params: {
    merged: Record<string, unknown>;
    sources: Array<Record<string, unknown> | undefined>;
}): void;
