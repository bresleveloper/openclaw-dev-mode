import { retryAsync } from "./retry-utils.js";
import type { SsrFPolicy } from "./ssrf-policy.js";
/** POST JSON and retry provider 429/5xx failures with bounded backoff. */
export declare function postJsonWithRetry<T>(params: {
    url: string;
    headers: Record<string, string>;
    ssrfPolicy?: SsrFPolicy;
    fetchImpl?: typeof fetch;
    retryImpl?: typeof retryAsync;
    body: unknown;
    errorPrefix: string;
}): Promise<T>;
