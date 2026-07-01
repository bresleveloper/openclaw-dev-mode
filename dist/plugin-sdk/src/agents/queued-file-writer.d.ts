/**
 * Serializes append-only writes per file path.
 *
 * Callers can enqueue log/transcript lines without awaiting each write; the
 * writer preserves order and exposes queue diagnostics for stuck-write probes.
 */
export type QueuedFileWriterDiagnostics = {
    pendingWrites: number;
    queuedBytes: number;
    activeOperation: "idle" | "mkdir" | "yield" | "file-append";
    activeWriteBytes?: number;
    maxFileBytes?: number;
    maxQueuedBytes?: number;
    yieldBeforeWrite: boolean;
};
/** Append writer handle shared by callers that target the same path. */
export type QueuedFileWriter = {
    filePath: string;
    write: (line: string) => unknown;
    flush: () => Promise<void>;
    describeQueue?: () => QueuedFileWriterDiagnostics;
};
type QueuedFileWriterOptions = {
    maxFileBytes?: number;
    maxQueuedBytes?: number;
    yieldBeforeWrite?: boolean;
};
/** Returns the cached writer for a path or creates a new ordered append queue. */
export declare function getQueuedFileWriter(writers: Map<string, QueuedFileWriter>, filePath: string, options?: QueuedFileWriterOptions): QueuedFileWriter;
export {};
