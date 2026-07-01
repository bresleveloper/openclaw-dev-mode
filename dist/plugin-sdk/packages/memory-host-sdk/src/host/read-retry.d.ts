/** Return true for transient memory read failures that should be retried. */
export declare function isTransientMemoryReadError(error: unknown): boolean;
/** Retry a memory read with the narrow transient error predicate. */
export declare function retryTransientMemoryRead<T>(read: () => Promise<T>, label?: string): Promise<T>;
