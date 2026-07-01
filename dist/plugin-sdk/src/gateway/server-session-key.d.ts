/** Resolves the caller-facing session key for an active or recently persisted run id. */
export declare function resolveSessionKeyForRun(runId: string, opts?: {
    agentId?: string;
}): string | undefined;
/** Clears the run lookup cache for tests that mutate session stores. */
export declare function resetResolvedSessionKeyForRunCacheForTest(): void;
