/** Runs plugin host cleanup with a bounded timeout and clears the timer afterward. */
export declare function withPluginHostCleanupTimeout<T>(hookId: string, cleanup: () => T | Promise<T>): Promise<T>;
