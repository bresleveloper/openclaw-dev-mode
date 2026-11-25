type HttpDateInstant = {
  timestampMs: number;
  leapSecond: boolean;
};
/**
 * Provider retry timing split by authority: an explicit instruction for this request
 * (Retry-After, retry-after-ms) versus an exhausted bucket's full-refill time.
 */
type RetryAfterTiming = {
  explicitSeconds?: number;
  resetSeconds?: number;
};
/** Reads only retry timing metadata, without invoking provider getters or serialization hooks. */
declare function parseRetryAfterHeadersSeconds(headers: unknown, nowMs?: number, status?: number): number | undefined;
/** Header timing with explicit retry instructions kept apart from bucket refills. */
declare function parseRetryAfterHeadersTiming(headers: unknown, nowMs?: number, status?: number): RetryAfterTiming | undefined;
/** SDK errors carry native response headers separately from their error body. */
declare function parseRetryAfterErrorSeconds(error: unknown, nowMs?: number): number | undefined;
/** Header timing from an SDK error and its response, merged per authority. */
declare function parseRetryAfterErrorTiming(error: unknown, nowMs?: number): RetryAfterTiming | undefined;
/** Provider prose such as "Please try again in 6s", "retry in 32s" or "Retry-After: 7". */
declare const RETRY_AFTER_TEXT_RE: RegExp;
/** Seconds named by a captured retry-text value: a number with an optional time unit, or an HTTP-date. */
declare function parseRetryAfterTextSeconds(valueText: string, nowMs?: number): number | undefined;
/** Whether text carries an explicit retry instruction that parseRetryAfterTextSeconds accepts. */
declare function hasExplicitRetryText(text: unknown, nowMs?: number): boolean;
/**
 * Reads google.rpc.RetryInfo delays from raw error text or a google.rpc.Status-shaped body
 * in any key order, with a fixed number of descriptor reads and no getters. Pass the
 * untruncated body: Gemini puts RetryInfo after its QuotaFailure details.
 */
declare function parseGoogleRetryDelaySeconds(value: unknown): number | undefined;
/**
 * Retry time for one thrown provider error, before any lossy projection.
 * Explicit instructions (Retry-After headers, Google RetryInfo) win; prose timing is left
 * for text consumers; an exhausted-bucket refill applies only when neither is present.
 */
declare function resolveProviderErrorRetrySeconds(error: unknown, nowMs?: number): number | undefined;
/** Round leap seconds forward for Retry-After so an unrepresentable instant cannot retry early. */
declare function parseRetryAfterHttpDateMs(value: string, nowMs?: number): number | undefined;
/** Parse all three HTTP-date forms while retaining leap-second ordering. */
declare function parseHttpDateInstant(value: string, nowMs?: number): HttpDateInstant | undefined;
export { parseHttpDateInstant as a, parseRetryAfterHeadersSeconds as c, parseRetryAfterTextSeconds as d, resolveProviderErrorRetrySeconds as f, parseGoogleRetryDelaySeconds as i, parseRetryAfterHeadersTiming as l, RetryAfterTiming as n, parseRetryAfterErrorSeconds as o, hasExplicitRetryText as r, parseRetryAfterErrorTiming as s, RETRY_AFTER_TEXT_RE as t, parseRetryAfterHttpDateMs as u };