import { clearLiveCatalogCacheForTests } from "./provider-catalog-shared.js";
import type { ModelDefinitionConfig, ModelProviderConfig } from "./provider-model-shared.js";
import { fetchWithSsrFGuard, type LookupFn, type SsrFPolicy } from "./ssrf-runtime.js";
export type LiveModelCatalogFetchGuard = typeof fetchWithSsrFGuard;
export type LiveModelCatalogHeaderContext = {
    apiKey?: string;
    discoveryApiKey?: string;
};
export { clearLiveCatalogCacheForTests };
export type FetchLiveProviderModelIdsParams = {
    providerId: string;
    endpoint: string;
    apiKey?: string;
    discoveryApiKey?: string;
    fetchGuard?: LiveModelCatalogFetchGuard;
    signal?: AbortSignal;
    timeoutMs?: number;
    auditContext?: string;
    policy?: SsrFPolicy;
    lookupFn?: LookupFn;
    requireHttps?: boolean;
    readRows?: (body: unknown) => readonly unknown[];
    readModelId?: (row: unknown) => string | undefined;
    buildRequestHeaders?: (ctx: LiveModelCatalogHeaderContext) => HeadersInit;
};
export type FetchLiveProviderModelRowsParams = Omit<FetchLiveProviderModelIdsParams, "readModelId">;
export type CachedLiveProviderModelRowsParams = FetchLiveProviderModelRowsParams & {
    ttlMs?: number;
    cacheKeyParts?: readonly unknown[];
    shouldCacheRows?: (rows: readonly unknown[]) => boolean;
};
export declare class LiveModelCatalogHttpError extends Error {
    readonly status: number;
    constructor(providerId: string, status: number);
}
export type BuildLiveModelProviderConfigParams<T extends ModelDefinitionConfig> = FetchLiveProviderModelIdsParams & {
    providerConfig: Omit<ModelProviderConfig, "models">;
    models: readonly T[];
    ttlMs?: number;
    cacheKeyParts?: readonly unknown[];
};
export declare function fetchLiveProviderModelRows(params: FetchLiveProviderModelRowsParams): Promise<readonly unknown[]>;
export declare function getCachedLiveProviderModelRows(params: CachedLiveProviderModelRowsParams): Promise<readonly unknown[]>;
export declare function fetchLiveProviderModelIds(params: FetchLiveProviderModelIdsParams): Promise<string[]>;
export declare function buildLiveModelProviderConfig<T extends ModelDefinitionConfig>(params: BuildLiveModelProviderConfigParams<T>): Promise<ModelProviderConfig>;
