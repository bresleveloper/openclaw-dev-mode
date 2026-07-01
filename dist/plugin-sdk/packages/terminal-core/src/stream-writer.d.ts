/** Hooks for safe stream writes. */
export type SafeStreamWriterOptions = {
    beforeWrite?: () => void;
    onBrokenPipe?: (err: NodeJS.ErrnoException, stream: NodeJS.WriteStream) => void;
};
/** Writer facade that tracks closed/broken-pipe state. */
export type SafeStreamWriter = {
    write: (stream: NodeJS.WriteStream, text: string) => boolean;
    writeLine: (stream: NodeJS.WriteStream, text: string) => boolean;
    reset: () => void;
    isClosed: () => boolean;
};
/** Create a stream writer that stops writing after EPIPE/EIO. */
export declare function createSafeStreamWriter(options?: SafeStreamWriterOptions): SafeStreamWriter;
