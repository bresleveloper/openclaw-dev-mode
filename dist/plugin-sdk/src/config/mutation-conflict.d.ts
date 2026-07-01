/** Raised when a config write loses an optimistic snapshot race. */
export declare class ConfigMutationConflictError extends Error {
    readonly currentHash: string | null;
    readonly retryable: boolean;
    constructor(message: string, params: {
        currentHash: string | null;
        retryable?: boolean;
    });
}
