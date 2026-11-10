//#region packages/ai/src/internal/retry-after.d.ts
type HttpDateInstant = {
  timestampMs: number;
  leapSecond: boolean;
};
/** Reads only retry timing metadata, without invoking provider getters or serialization hooks. */
declare function parseRetryAfterHeadersSeconds(headers: unknown, nowMs?: number, status?: number): number | undefined;
/** SDK errors carry native response headers separately from their error body. */
declare function parseRetryAfterErrorSeconds(error: unknown, nowMs?: number): number | undefined;
/** Provider prose such as "Please try again in 6s", "retry in 32s" or "Retry-After: 7". */
declare const RETRY_AFTER_TEXT_RE: RegExp;
/** Seconds named by a captured retry-text value: a number with an optional time unit, or an HTTP-date. */
declare function parseRetryAfterTextSeconds(valueText: string, nowMs?: number): number | undefined;
/**
 * Reads google.rpc.RetryInfo delays from raw error text or a google.rpc.Status-shaped body
 * in any key order, with a fixed number of descriptor reads and no getters. Pass the
 * untruncated body: Gemini puts RetryInfo after its QuotaFailure details.
 */
declare function parseGoogleRetryDelaySeconds(value: unknown): number | undefined;
/** Round leap seconds forward for Retry-After so an unrepresentable instant cannot retry early. */
declare function parseRetryAfterHttpDateMs(value: string, nowMs?: number): number | undefined;
/** Parse all three HTTP-date forms while retaining leap-second ordering. */
declare function parseHttpDateInstant(value: string, nowMs?: number): HttpDateInstant | undefined;
//#endregion
export { parseRetryAfterHeadersSeconds as a, parseRetryAfterErrorSeconds as i, parseGoogleRetryDelaySeconds as n, parseRetryAfterHttpDateMs as o, parseHttpDateInstant as r, parseRetryAfterTextSeconds as s, RETRY_AFTER_TEXT_RE as t };