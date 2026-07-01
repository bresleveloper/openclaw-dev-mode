import type { SsrFPolicy } from "./ssrf-policy.js";
/** POST JSON, parse bounded response JSON, and attach status metadata when requested. */
export declare function postJson<T>(params: {
    url: string;
    headers: Record<string, string>;
    ssrfPolicy?: SsrFPolicy;
    fetchImpl?: typeof fetch;
    signal?: AbortSignal;
    body: unknown;
    errorPrefix: string;
    attachStatus?: boolean;
    maxResponseBytes?: number;
    parse: (payload: unknown) => T | Promise<T>;
}): Promise<T>;
