import { i as SsrFPolicy, n as PinnedDispatcherPolicy, t as LookupFn } from "./ssrf-Df8OYfGp.js";
import { n as RetryOptions } from "./index-DcwqyTkK.js";
import { t as GuardedFetchOptions } from "./fetch-guard-CASz7RCn.js";
import { t as SavedMedia } from "./store-DLXnxzKI.js";
//#region src/infra/http-response-body.d.ts
type ReadResponseTextPrefixOptions = {
  signal?: AbortSignal;
  chunkTimeoutMs?: number;
  onIdleTimeout?: (params: {
    chunkTimeoutMs: number;
  }) => Error;
  /** Static timeout or lazy resolver evaluated immediately before body consumption. */
  timeoutMs?: number | (() => number);
  onTimeout?: (params: {
    timeoutMs: number;
  }) => Error;
};
/** Reads a response body under byte, idle, and overall timeout bounds. */
declare function readResponseWithLimit(response: Response, maxBytes: number, options?: ReadResponseTextPrefixOptions & {
  onOverflow?: (params: {
    size: number;
    maxBytes: number;
    res: Response;
  }) => Error;
}): Promise<Buffer>;
/** Reads a small collapsed text prefix from a response body for diagnostics/errors. */
declare function readResponseTextSnippet(response: Response, options?: ReadResponseTextPrefixOptions & {
  maxBytes?: number;
  maxChars?: number;
}): Promise<string | undefined>;
//#endregion
//#region src/media/fetch.d.ts
type FetchMediaResult = {
  buffer: Buffer;
  contentType?: string;
  fileName?: string;
};
type SavedRemoteMedia = SavedMedia & {
  fileName?: string;
};
type MediaFetchErrorCode = "max_bytes" | "http_error" | "fetch_failed";
/** Retry policy applied around the complete guarded fetch and body read/save operation. */
type MediaFetchRetryOptions = RetryOptions;
declare class MediaFetchError extends Error {
  readonly code: MediaFetchErrorCode;
  readonly status?: number;
  constructor(code: MediaFetchErrorCode, message: string, options?: {
    cause?: unknown;
    status?: number;
  });
}
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
/** Alternate dispatcher/lookup pair tried inside a single guarded fetch attempt. */
type FetchDispatcherAttempt = {
  dispatcherPolicy?: PinnedDispatcherPolicy;
  lookupFn?: LookupFn;
};
type FetchMediaOptions = {
  url: string;
  fetchImpl?: FetchLike;
  /** Final synchronous check repeated for every media attempt and redirect. */
  beforeRequest?: GuardedFetchOptions["beforeRequest"];
  requestInit?: RequestInit;
  filePathHint?: string;
  maxBytes?: number;
  maxRedirects?: number;
  /** Require HTTPS for the initial URL and every redirect target. */
  requireHttps?: boolean;
  /** Abort the complete guarded fetch and body operation after this deadline (ms). */
  timeoutMs?: number;
  /** Abort if final response headers have not arrived by this deadline (ms). */
  responseHeaderTimeoutMs?: number;
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
type SaveResponseMediaOptions = {
  sourceUrl?: string;
  filePathHint?: string;
  maxBytes?: number;
  readIdleTimeoutMs?: number;
  fallbackContentType?: string;
  subdir?: string;
  originalFilename?: string;
};
type SaveRemoteMediaOptions = FetchMediaOptions & {
  /** Revalidate caller-owned read authority through transport and file publication. */
  assertCurrent?: () => void;
  fallbackContentType?: string;
  subdir?: string;
  originalFilename?: string;
};
/** Validates and saves a caller-provided response without performing a new fetch. */
declare function saveResponseMedia(res: Response, options?: SaveResponseMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and saves the body into the media store. */
declare function saveRemoteMedia(options: SaveRemoteMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and returns the bounded response body as a buffer. */
declare function readRemoteMediaBuffer(options: FetchMediaOptions): Promise<FetchMediaResult>;
/** @deprecated Use `readRemoteMediaBuffer` for buffer reads or `saveRemoteMedia` for URL-to-store. */
declare const fetchRemoteMedia: typeof readRemoteMediaBuffer;
//#endregion
//#region src/media/audio.d.ts
/** Checks whether MIME type or filename is compatible with voice-message delivery. */
declare function isVoiceMessageCompatibleAudio(opts: {
  contentType?: string | null;
  fileName?: string | null;
}): boolean;
//#endregion
export { fetchRemoteMedia as a, saveResponseMedia as c, readResponseWithLimit as d, SavedRemoteMedia as i, ReadResponseTextPrefixOptions as l, FetchLike as n, readRemoteMediaBuffer as o, MediaFetchError as r, saveRemoteMedia as s, isVoiceMessageCompatibleAudio as t, readResponseTextSnippet as u };