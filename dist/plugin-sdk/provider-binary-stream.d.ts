//#region src/plugin-sdk/provider-binary-stream.d.ts
/** Create a byte-limited stream that owns its source reader and request cleanup. */
export declare function createBoundedProviderBinaryStream(source: ReadableStream<Uint8Array>, options: {
  maxBytes: number;
  createOverflowError: (params: {
    size: number;
    maxBytes: number;
  }) => Error;
  createReleaseError: () => Error;
  cleanup: () => Promise<void>;
}): {
  stream: ReadableStream<Uint8Array>;
  release: () => Promise<void>;
};
//#endregion