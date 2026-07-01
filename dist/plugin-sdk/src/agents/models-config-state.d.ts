export type ModelsJsonReadyResult = {
    agentDir: string;
    wrote: boolean;
};
export type ModelsJsonReadyState = {
    fingerprint: string;
    result: ModelsJsonReadyResult;
};
type ModelsJsonState = {
    writeLocks: Map<string, Promise<void>>;
    readyCache: Map<string, Promise<ModelsJsonReadyState>>;
};
export declare const MODELS_JSON_STATE: ModelsJsonState;
/** Clear models.json write/ready caches for tests. */
export declare function resetModelsJsonReadyCacheForTest(): void;
export {};
