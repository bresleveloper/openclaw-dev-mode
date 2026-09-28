//#region packages/ai/src/internal/retry-after.d.ts
type HttpDateInstant = {
  timestampMs: number;
  leapSecond: boolean;
};
/** Reads only retry timing metadata, without invoking provider getters or serialization hooks. */
declare function parseRetryAfterHeadersSeconds(headers: unknown, nowMs?: number): number | undefined;
/** SDK errors carry native response headers separately from their error body. */
declare function parseRetryAfterErrorSeconds(error: unknown, nowMs?: number): number | undefined;
/** Round leap seconds forward for Retry-After so an unrepresentable instant cannot retry early. */
declare function parseRetryAfterHttpDateMs(value: string, nowMs?: number): number | undefined;
/** Parse all three HTTP-date forms while retaining leap-second ordering. */
declare function parseHttpDateInstant(value: string, nowMs?: number): HttpDateInstant | undefined;
//#endregion
export { parseRetryAfterHttpDateMs as i, parseRetryAfterErrorSeconds as n, parseRetryAfterHeadersSeconds as r, parseHttpDateInstant as t };