/** Minimal provider batch status used for completion and terminal-failure checks. */
type BatchStatusLike = {
    id?: string;
    status?: string;
    output_file_id?: string | null;
    error_file_id?: string | null;
};
/** File ids returned once a batch has completed. */
export type BatchCompletionResult = {
    outputFileId: string;
    errorFileId?: string;
};
/** Convert a completed provider status payload into output/error file ids. */
export declare function resolveBatchCompletionFromStatus(params: {
    provider: string;
    batchId: string;
    status: BatchStatusLike;
}): BatchCompletionResult;
/** Throw when a provider reports a terminal failure, including error-file detail if available. */
export declare function throwIfBatchTerminalFailure(params: {
    provider: string;
    status: BatchStatusLike;
    readError: (errorFileId: string) => Promise<string | undefined>;
}): Promise<void>;
/** Resolve the completed batch files, optionally waiting according to caller policy. */
export declare function resolveCompletedBatchResult(params: {
    provider: string;
    status: BatchStatusLike;
    wait: boolean;
    waitForBatch: () => Promise<BatchCompletionResult>;
}): Promise<BatchCompletionResult>;
export {};
