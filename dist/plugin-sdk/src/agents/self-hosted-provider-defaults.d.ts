/**
 * Conservative defaults for self-hosted providers when the model catalog
 * cannot supply pricing or token limits.
 */
/** Default context window used for self-hosted provider catalog entries. */
export declare const SELF_HOSTED_DEFAULT_CONTEXT_WINDOW = 128000;
/** Default output-token cap used for self-hosted provider catalog entries. */
export declare const SELF_HOSTED_DEFAULT_MAX_TOKENS = 8192;
/** Zero-cost pricing used for self-hosted provider catalog entries. */
export declare const SELF_HOSTED_DEFAULT_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
