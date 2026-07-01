import type { LookupFn, PinnedDispatcherPolicy, SsrFPolicy } from "../infra/net/ssrf.js";
import { type RetryOptions } from "../infra/retry.js";
import { type SavedMedia } from "./store.js";
/** Default remote media fetch cap shared by buffer reads and store writes. */
export declare const DEFAULT_FETCH_MEDIA_MAX_BYTES: number;
/** Remote media bytes plus metadata before they are persisted to the media store. */
type FetchMediaResult = {
    buffer: Buffer;
    contentType?: string;
    fileName?: string;
};
/** Saved media record enriched with the best remote filename candidate. */
export type SavedRemoteMedia = SavedMedia & {
    fileName?: string;
};
/** Closed error classes callers can use for retry and diagnostic policy. */
export type MediaFetchErrorCode = "max_bytes" | "http_error" | "fetch_failed";
/** Retry policy applied around the complete guarded fetch and body read/save operation. */
export type MediaFetchRetryOptions = RetryOptions;
/** Structured fetch error used for retry decisions and caller-facing diagnostics. */
export declare class MediaFetchError extends Error {
    readonly code: MediaFetchErrorCode;
    readonly status?: number;
    constructor(code: MediaFetchErrorCode, message: string, options?: {
        cause?: unknown;
        status?: number;
    });
}
/** Fetch-compatible injection point used by tests and guarded network callers. */
export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
/** Alternate dispatcher/lookup pair tried inside a single guarded fetch attempt. */
export type FetchDispatcherAttempt = {
    dispatcherPolicy?: PinnedDispatcherPolicy;
    lookupFn?: LookupFn;
};
type FetchMediaOptions = {
    url: string;
    fetchImpl?: FetchLike;
    requestInit?: RequestInit;
    filePathHint?: string;
    maxBytes?: number;
    maxRedirects?: number;
    /** Abort the guarded fetch request if it has not completed by this deadline (ms). */
    timeoutMs?: number;
    /** Abort if the response body stops yielding data for this long (ms). */
    readIdleTimeoutMs?: number;
    ssrfPolicy?: SsrFPolicy;
    lookupFn?: LookupFn;
    dispatcherPolicy?: PinnedDispatcherPolicy;
    dispatcherAttempts?: FetchDispatcherAttempt[];
    shouldRetryFetchError?: (error: unknown) => boolean;
    /**
     * Retries the complete guarded fetch/read-or-save operation. Dispatcher
     * attempts still run inside each retry attempt.
     */
    retry?: MediaFetchRetryOptions;
    /**
     * Allow an operator-configured explicit proxy to resolve target DNS after
     * hostname-policy checks instead of forcing local pinned-DNS first.
     */
    trustExplicitProxyDns?: boolean;
};
/** Options for validating and saving an existing Response body into the media store. */
export type SaveResponseMediaOptions = {
    sourceUrl?: string;
    filePathHint?: string;
    maxBytes?: number;
    readIdleTimeoutMs?: number;
    fallbackContentType?: string;
    subdir?: string;
    originalFilename?: string;
};
/** Options for guarded URL fetches that are saved directly into the media store. */
export type SaveRemoteMediaOptions = FetchMediaOptions & {
    fallbackContentType?: string;
    subdir?: string;
    originalFilename?: string;
};
/** Validates and saves a caller-provided response without performing a new fetch. */
export declare function saveResponseMedia(res: Response, options?: SaveResponseMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and saves the body into the media store. */
export declare function saveRemoteMedia(options: SaveRemoteMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and returns the bounded response body as a buffer. */
export declare function readRemoteMediaBuffer(options: FetchMediaOptions): Promise<FetchMediaResult>;
/** @deprecated Use `readRemoteMediaBuffer` for buffer reads or `saveRemoteMedia` for URL-to-store. */
export declare const fetchRemoteMedia: typeof readRemoteMediaBuffer;
export {};
