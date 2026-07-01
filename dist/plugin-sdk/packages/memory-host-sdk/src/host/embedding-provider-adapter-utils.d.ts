/** Detect missing API key errors from provider auth resolution. */
export declare function isMissingEmbeddingApiKeyError(err: unknown): boolean;
/** Return stable cache headers after removing provider-specific secret headers. */
export declare function sanitizeEmbeddingCacheHeaders(headers: Record<string, string>, excludedHeaderNames: string[]): Array<[string, string]>;
/** Convert custom-id keyed batch embeddings back to request-index order. */
export declare function mapBatchEmbeddingsByIndex(byCustomId: Map<string, number[]>, count: number): number[][];
