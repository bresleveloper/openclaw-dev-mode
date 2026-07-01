/** Cleanup callback for resources tied to an LLM session or all sessions. */
export type SessionResourceCleanup = (sessionId?: string) => void;
/** Registers a session-resource cleanup hook and returns an unregister function. */
export declare function registerSessionResourceCleanup(cleanup: SessionResourceCleanup): () => void;
/** Runs all registered cleanup hooks, aggregating failures after every hook has run. */
export declare function cleanupSessionResources(sessionId?: string): void;
