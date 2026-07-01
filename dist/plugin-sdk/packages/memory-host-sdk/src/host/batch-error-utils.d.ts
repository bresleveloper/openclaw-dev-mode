/** Minimal batch output line shape that can carry provider error messages. */
type BatchOutputErrorLike = {
    error?: {
        message?: string;
    };
    response?: {
        body?: string | {
            error?: {
                message?: string;
            };
        };
    };
};
/** Return the first useful error message from batch output lines. */
export declare function extractBatchErrorMessage(lines: BatchOutputErrorLike[]): string | undefined;
/** Format a failed error-file read without hiding the underlying read problem. */
export declare function formatUnavailableBatchError(err: unknown): string | undefined;
export {};
