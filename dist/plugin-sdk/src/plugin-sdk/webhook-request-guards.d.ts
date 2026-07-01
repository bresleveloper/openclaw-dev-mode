import type { IncomingMessage, ServerResponse } from "node:http";
import type { FixedWindowRateLimiter } from "./webhook-memory-guards.js";
/** Body-read profile for webhook payload limits before or after authentication. */
export type WebhookBodyReadProfile = "pre-auth" | "post-auth";
export { installRequestBodyLimitGuard, isRequestBodyLimitError, readJsonBodyWithLimit, readRequestBodyWithLimit, requestBodyErrorToText, } from "../infra/http-body.js";
/** Default webhook body size/time limits for pre-auth and post-auth reads. */
export declare const WEBHOOK_BODY_READ_DEFAULTS: Readonly<{
    preAuth: {
        maxBytes: number;
        timeoutMs: number;
    };
    postAuth: {
        maxBytes: number;
        timeoutMs: number;
    };
}>;
/** Default in-flight concurrency limits for webhook request pipelines. */
export declare const WEBHOOK_IN_FLIGHT_DEFAULTS: Readonly<{
    maxInFlightPerKey: 8;
    maxTrackedKeys: 4096;
}>;
/** Per-key in-flight limiter used to bound concurrent webhook handlers. */
export type WebhookInFlightLimiter = {
    /** Acquire one in-flight slot for a key, returning false when the key is at capacity. */
    tryAcquire: (key: string) => boolean;
    /** Release one slot for a key after the handler completes. */
    release: (key: string) => void;
    /** Number of keys with retained in-flight state. */
    size: () => number;
    /** Drop all retained in-flight state. */
    clear: () => void;
};
/** Create an in-memory limiter that caps concurrent webhook handlers per key. */
export declare function createWebhookInFlightLimiter(options?: {
    /** Maximum concurrent handlers allowed for one key. */
    maxInFlightPerKey?: number;
    /** Maximum number of keys retained before oldest entries are pruned. */
    maxTrackedKeys?: number;
}): WebhookInFlightLimiter;
/** Detect JSON content types, including structured syntax suffixes like `application/ld+json`. */
export declare function isJsonContentType(value: string | string[] | undefined): boolean;
/** Apply method, rate-limit, and content-type guards before a webhook handler reads the body. */
export declare function applyBasicWebhookRequestGuards(params: {
    /** Incoming request to validate before body reads or handler dispatch. */
    req: IncomingMessage;
    /** Response used for method, rate-limit, or content-type rejections. */
    res: ServerResponse;
    /** Allowed HTTP methods; empty or omitted disables the method guard. */
    allowMethods?: readonly string[];
    /** Optional fixed-window limiter for pre-body request throttling. */
    rateLimiter?: FixedWindowRateLimiter;
    /** Key passed to the rate limiter when throttling is enabled. */
    rateLimitKey?: string;
    /** Clock override for deterministic limiter tests. */
    nowMs?: number;
    /** Require JSON content type for POST requests. */
    requireJsonContentType?: boolean;
}): boolean;
/** Start the shared webhook request lifecycle and return a release hook for in-flight tracking. */
export declare function beginWebhookRequestPipelineOrReject(params: {
    /** Incoming request to validate before acquiring in-flight capacity. */
    req: IncomingMessage;
    /** Response used for guard or capacity rejections. */
    res: ServerResponse;
    /** Allowed HTTP methods; empty or omitted disables the method guard. */
    allowMethods?: readonly string[];
    /** Optional fixed-window limiter for pre-body request throttling. */
    rateLimiter?: FixedWindowRateLimiter;
    /** Key passed to the rate limiter when throttling is enabled. */
    rateLimitKey?: string;
    /** Clock override for deterministic limiter tests. */
    nowMs?: number;
    /** Require JSON content type for POST requests. */
    requireJsonContentType?: boolean;
    /** Optional per-key concurrency limiter acquired after basic guards pass. */
    inFlightLimiter?: WebhookInFlightLimiter;
    /** Key used for in-flight concurrency tracking. */
    inFlightKey?: string;
    /** Status code returned when the in-flight guard rejects. */
    inFlightLimitStatusCode?: number;
    /** Response body returned when the in-flight guard rejects. */
    inFlightLimitMessage?: string;
}): {
    ok: true;
    release: () => void;
} | {
    ok: false;
};
/** Read a webhook request body with bounded size/time limits and translate failures into responses. */
export declare function readWebhookBodyOrReject(params: {
    /** Incoming request body stream to read. */
    req: IncomingMessage;
    /** Response used for body size, timeout, close, or parse failures. */
    res: ServerResponse;
    /** Optional maximum body size override in bytes. */
    maxBytes?: number;
    /** Optional body read timeout override in milliseconds. */
    timeoutMs?: number;
    /** Default limit profile to use when explicit limits are omitted. */
    profile?: WebhookBodyReadProfile;
    /** Response body for invalid request bodies. */
    invalidBodyMessage?: string;
}): Promise<{
    ok: true;
    value: string;
} | {
    ok: false;
}>;
/** Read and parse a JSON webhook body, rejecting malformed or oversized payloads consistently. */
export declare function readJsonWebhookBodyOrReject(params: {
    /** Incoming request body stream to read and parse as JSON. */
    req: IncomingMessage;
    /** Response used for JSON parse, body size, timeout, or close failures. */
    res: ServerResponse;
    /** Optional maximum body size override in bytes. */
    maxBytes?: number;
    /** Optional body read timeout override in milliseconds. */
    timeoutMs?: number;
    /** Default limit profile to use when explicit limits are omitted. */
    profile?: WebhookBodyReadProfile;
    /** Treat an empty body as `{}` instead of rejecting it as invalid JSON. */
    emptyObjectOnEmpty?: boolean;
    /** Response body for malformed JSON. */
    invalidJsonMessage?: string;
}): Promise<{
    ok: true;
    value: unknown;
} | {
    ok: false;
}>;
