/**
 * Throws an AbortError if the given signal has been aborted.
 * Use at async checkpoints to support cancellation.
 */
export declare function throwIfAborted(abortSignal?: AbortSignal): void;
