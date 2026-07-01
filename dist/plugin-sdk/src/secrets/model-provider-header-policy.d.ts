/**
 * Returns whether a model-provider header name should be treated as secret-bearing.
 * This is intentionally conservative: false positives are audit noise, false negatives leak keys.
 */
export declare function isLikelySensitiveModelProviderHeaderName(value: string): boolean;
