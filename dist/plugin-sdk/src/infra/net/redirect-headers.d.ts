/**
 * Keeps only headers that are safe to replay after a redirect crosses origins.
 * Authorization/cookie-like metadata must be dropped before the follow-up fetch.
 */
export declare function retainSafeHeadersForCrossOriginRedirect(headers?: HeadersInit | Record<string, string>): Record<string, string> | undefined;
