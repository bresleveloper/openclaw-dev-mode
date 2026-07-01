//#region packages/media-core/src/read-response-with-limit.d.ts
/** Reads a response body under a byte cap, cancelling the stream on overflow or idle timeout. */
declare function readResponseWithLimit(res: Response, maxBytes: number, opts?: {
  onOverflow?: (params: {
    size: number;
    maxBytes: number;
    res: Response;
  }) => Error;
  chunkTimeoutMs?: number;
  onIdleTimeout?: (params: {
    chunkTimeoutMs: number;
  }) => Error;
}): Promise<Buffer>;
/** Reads a small collapsed text prefix from a response body for diagnostics/errors. */
declare function readResponseTextSnippet(res: Response, opts?: {
  maxBytes?: number;
  maxChars?: number;
  chunkTimeoutMs?: number;
  onIdleTimeout?: (params: {
    chunkTimeoutMs: number;
  }) => Error;
}): Promise<string | undefined>;
//#endregion
export { readResponseWithLimit as n, readResponseTextSnippet as t };