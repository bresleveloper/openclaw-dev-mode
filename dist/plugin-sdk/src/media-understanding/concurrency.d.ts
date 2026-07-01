/** Runs media tasks under a fixed concurrency limit while preserving successful results. */
export declare function runWithConcurrency<T>(tasks: Array<() => Promise<T>>, limit: number): Promise<T[]>;
