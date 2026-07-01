/** Details passed to byte-stream overflow error factories. */
export type ByteStreamLimitOverflow = {
    size: number;
    maxBytes: number;
};
/** Options for reading an async byte stream under a hard byte cap. */
export type ReadByteStreamWithLimitOptions = {
    maxBytes: number;
    onOverflow?: (params: ByteStreamLimitOverflow) => Error;
};
/** Reads and concatenates an async byte stream, throwing once the byte cap is exceeded. */
export declare function readByteStreamWithLimit(stream: AsyncIterable<unknown>, opts: ReadByteStreamWithLimitOptions): Promise<Buffer>;
