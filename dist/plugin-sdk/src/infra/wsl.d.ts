/** Clears the cached async WSL detection result between isolated tests. */
export declare function resetWSLStateForTests(): void;
/** Detects WSL from environment variables without touching the filesystem. */
export declare function isWSLEnv(env?: Record<string, string | undefined>): boolean;
/**
 * Synchronously detects WSL from env vars first, then `/proc/version`.
 */
export declare function isWSLSync(): boolean;
/**
 * Synchronously detects WSL2 from kernel-version markers after WSL detection.
 */
export declare function isWSL2Sync(): boolean;
/** Asynchronously detects WSL from env vars and `/proc/sys/kernel/osrelease`, with process cache. */
export declare function isWSL(): Promise<boolean>;
