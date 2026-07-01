/**
 * Process-local state for warmed provider auth snapshots.
 */
export type PreparedProviderAuthState = {
    agentId: string;
    configFingerprint: string;
    providers: ReadonlyMap<string, boolean>;
};
export type ProviderAuthWarmSnapshot = {
    agents: Array<{
        agentId: string;
        configFingerprint: string;
        providers: Array<[string, boolean]>;
    }>;
};
type ProviderAuthWarmWorkerHandle = {
    worker: {
        terminate: () => unknown;
    };
    cancelled: boolean;
};
export declare function getCurrentProviderAuthStates(): ReadonlyMap<string, PreparedProviderAuthState> | null;
export declare function claimCurrentProviderAuthStateGeneration(): number;
export declare function isCurrentProviderAuthStateGeneration(generation: number): boolean;
export declare function setCurrentProviderAuthWarmWorker(handle: ProviderAuthWarmWorkerHandle): void;
export declare function clearCurrentProviderAuthWarmWorker(handle: ProviderAuthWarmWorkerHandle): void;
export declare function cancelCurrentProviderAuthWarmWorker(): void;
export declare function clearCurrentProviderAuthState(): void;
export declare function publishProviderAuthWarmSnapshot(snapshot: ProviderAuthWarmSnapshot): void;
export {};
