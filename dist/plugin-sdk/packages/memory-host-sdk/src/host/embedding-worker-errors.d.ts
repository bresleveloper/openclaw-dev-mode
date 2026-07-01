/** Stable error codes emitted by the local embedding worker supervisor. */
export declare const LOCAL_EMBEDDING_WORKER_ERROR_CODES: {
    readonly exited: "LOCAL_EMBEDDING_WORKER_EXITED";
    readonly processError: "LOCAL_EMBEDDING_WORKER_PROCESS_ERROR";
    readonly ipcError: "LOCAL_EMBEDDING_WORKER_IPC_ERROR";
};
/** Error code union for local embedding worker failures. */
export type LocalEmbeddingWorkerFailureCode = (typeof LOCAL_EMBEDDING_WORKER_ERROR_CODES)[keyof typeof LOCAL_EMBEDDING_WORKER_ERROR_CODES];
/** Cause category for local embedding worker failures. */
export type LocalEmbeddingWorkerFailureReason = "exit" | "signal" | "process-error" | "ipc";
/** Error shape used by callers that need retry/status decisions. */
export type LocalEmbeddingWorkerFailureError = Error & {
    code: LocalEmbeddingWorkerFailureCode;
    reason: LocalEmbeddingWorkerFailureReason;
    exitCode?: number | null;
    signal?: NodeJS.Signals | null;
};
/** Create a local embedding worker failure with stable metadata fields. */
export declare function createLocalEmbeddingWorkerFailureError(params: {
    message: string;
    code: LocalEmbeddingWorkerFailureCode;
    reason: LocalEmbeddingWorkerFailureReason;
    exitCode?: number | null;
    signal?: NodeJS.Signals | null;
    cause?: unknown;
}): LocalEmbeddingWorkerFailureError;
