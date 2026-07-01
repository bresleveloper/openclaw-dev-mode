/** Returns true when an error came from the global OAuth refresh lock. */
export declare function isGlobalRefreshLockTimeoutError(error: unknown, lockPath: string): boolean;
/** Builds the user-facing OAuth refresh contention error. */
export declare function buildRefreshContentionError(params: {
    provider: string;
    profileId: string;
    cause: unknown;
}): Error & {
    code: "refresh_contention";
    cause: unknown;
};
