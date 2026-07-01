/**
 * Agent harness error helpers.
 *
 * Registry and runtime callers use this stable error type to distinguish missing
 * harness selection from ordinary harness execution failures.
 */
/** Error thrown when a requested harness id is not registered. */
export declare class MissingAgentHarnessError extends Error {
    readonly harnessId: string;
    constructor(harnessId: string);
}
/** Returns whether an error is a missing harness error. */
export declare function isMissingAgentHarnessError(err: unknown): err is MissingAgentHarnessError;
