type RuntimeToolSchemaQuarantine = {
    toolName: string;
    owner?: string;
    reason: string;
    failedAt: Date;
};
export type RuntimeToolSchemaQuarantineIdentity = {
    toolName: string;
    owner?: string;
};
export declare function recordPersistedRuntimeToolSchemaQuarantine(quarantine: RuntimeToolSchemaQuarantine): void;
/**
 * Removes this process's persisted quarantines for tools that now validate
 * cleanly. `listHealthyTools` is only invoked when this process has persisted
 * quarantines, keeping the common per-run path free of work.
 */
export declare function clearRecoveredPersistedRuntimeToolSchemaQuarantines(listHealthyTools: () => readonly RuntimeToolSchemaQuarantineIdentity[]): void;
export declare function listPersistedRuntimeToolSchemaQuarantines(): RuntimeToolSchemaQuarantine[];
export {};
