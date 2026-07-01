//#region packages/media-core/src/read-byte-stream-with-limit.d.ts
/** Details passed to byte-stream overflow error factories. */
type ByteStreamLimitOverflow = {
  size: number;
  maxBytes: number;
};
/** Options for reading an async byte stream under a hard byte cap. */
type ReadByteStreamWithLimitOptions = {
  maxBytes: number;
  onOverflow?: (params: ByteStreamLimitOverflow) => Error;
};
/** Reads and concatenates an async byte stream, throwing once the byte cap is exceeded. */
declare function readByteStreamWithLimit(stream: AsyncIterable<unknown>, opts: ReadByteStreamWithLimitOptions): Promise<Buffer>;
//#endregion
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
export { readByteStreamWithLimit as a, ReadByteStreamWithLimitOptions as i, readResponseWithLimit as n, ByteStreamLimitOverflow as r, readResponseTextSnippet as t };