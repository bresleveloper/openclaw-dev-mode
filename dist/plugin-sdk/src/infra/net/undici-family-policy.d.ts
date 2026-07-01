/** Resolves the process default autoSelectFamily policy, with WSL2 forced to IPv4. */
export declare function resolveUndiciAutoSelectFamily(): boolean | undefined;
/** Converts an autoSelectFamily decision into the undici connect option shape. */
export declare function createUndiciAutoSelectFamilyConnectOptions(autoSelectFamily: boolean | undefined): {
    autoSelectFamily: boolean;
    autoSelectFamilyAttemptTimeout: number;
} | undefined;
/** Returns shared undici connect options for dispatchers that do not override them. */
export declare function resolveUndiciAutoSelectFamilyConnectOptions(): {
    autoSelectFamily: boolean;
    autoSelectFamilyAttemptTimeout: number;
} | undefined;
/**
 * Temporarily applies an undici family decision around synchronous setup code.
 * Restore is best-effort because older Node runtimes may not expose the setters.
 */
export declare function withTemporaryUndiciAutoSelectFamily<T>(autoSelectFamily: boolean | undefined, run: () => T): T;
