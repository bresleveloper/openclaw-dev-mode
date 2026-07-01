/** Process-local model context window cache keyed by model id. */
export declare const MODEL_CONTEXT_TOKEN_CACHE: Map<string, number>;
export declare const MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE: Map<string, number>;
export declare const MODEL_CONTEXT_WINDOW_CACHE: Map<string, number>;
/** Internal cache key for discovery metadata with verified provider ownership. */
export declare function providerContextTokenCacheKey(provider: string, modelId: string): string;
/** Looks up cached context-token count for a model id. */
export declare function lookupCachedContextTokens(modelId?: string): number | undefined;
/** Looks up a configured native context window without treating it as an effective runtime cap. */
export declare function lookupCachedContextWindow(modelId?: string): number | undefined;
/** Returns the lowest positive context limit from independently sourced metadata. */
export declare function minPositiveContextTokens(...values: Array<number | undefined>): number | undefined;
