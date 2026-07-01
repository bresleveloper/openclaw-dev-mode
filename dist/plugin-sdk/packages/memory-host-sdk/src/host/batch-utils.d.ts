import type { SsrFPolicy } from "./ssrf-policy.js";
/** Minimal HTTP client config needed by batch providers. */
export type BatchHttpClientConfig = {
    baseUrl?: string;
    headers?: Record<string, string>;
    ssrfPolicy?: SsrFPolicy;
    fetchImpl?: typeof fetch;
};
/** Normalize batch API base URLs by removing one trailing slash. */
export declare function normalizeBatchBaseUrl(client: BatchHttpClientConfig): string;
/** Build request headers, preserving caller auth and controlling JSON/form content type. */
export declare function buildBatchHeaders(client: Pick<BatchHttpClientConfig, "headers">, params: {
    json: boolean;
}): Record<string, string>;
/** Split provider requests into max-sized groups while preserving order. */
export declare function splitBatchRequests<T>(requests: T[], maxRequests: number): T[][];
export declare function splitBatchRequestsByLimits<T>(requests: T[], limits: {
    maxRequests: number;
    maxJsonlBytes?: number;
}): T[][];
