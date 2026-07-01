/** Normalize an optional `[user@]host` SCP target or reject unsafe tokens. */
export declare function normalizeScpRemoteHost(value: string | null | undefined): string | undefined;
/** Return true when a value is safe for the SCP host position. */
export declare function isSafeScpRemoteHost(value: string | null | undefined): boolean;
/** Normalize an absolute remote path that is safe for SCP command construction. */
export declare function normalizeScpRemotePath(value: string | null | undefined): string | undefined;
/** Return true when a value is safe for the SCP remote path position. */
export declare function isSafeScpRemotePath(value: string | null | undefined): boolean;
