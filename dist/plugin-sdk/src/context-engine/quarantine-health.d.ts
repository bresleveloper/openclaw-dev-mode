export type PersistedContextEngineRuntimeQuarantine = {
    engineId: string;
    owner?: string;
    operation: string;
    reason: string;
    failedAt: Date;
};
export declare function recordPersistedContextEngineQuarantine(quarantine: PersistedContextEngineRuntimeQuarantine): void;
export declare function listPersistedContextEngineQuarantines(): PersistedContextEngineRuntimeQuarantine[];
export declare function clearPersistedContextEngineQuarantineForProcess(engineId: string | undefined, processId: number): void;
