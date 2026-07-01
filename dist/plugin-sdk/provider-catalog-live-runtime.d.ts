import { m as ModelProviderDeclarationConfig, s as ModelDefinitionConfig } from "./types.models-C597Wbu7.js";
import { o as SsrFPolicy, t as LookupFn } from "./ssrf-skjEI_i5.js";
import { a as fetchWithSsrFGuard } from "./fetch-guard-BKvfwdRa.js";
import { i as clearLiveCatalogCacheForTests } from "./provider-catalog-shared-BzSbqEY6.js";
//#region src/plugin-sdk/provider-catalog-live-runtime.d.ts
type LiveModelCatalogFetchGuard = typeof fetchWithSsrFGuard;
type LiveModelCatalogHeaderContext = {
  apiKey?: string;
  discoveryApiKey?: string;
};
type FetchLiveProviderModelIdsParams = {
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
type FetchLiveProviderModelRowsParams = Omit<FetchLiveProviderModelIdsParams, "readModelId">;
type CachedLiveProviderModelRowsParams = FetchLiveProviderModelRowsParams & {
  ttlMs?: number;
  cacheKeyParts?: readonly unknown[];
  shouldCacheRows?: (rows: readonly unknown[]) => boolean;
};
declare class LiveModelCatalogHttpError extends Error {
  readonly status: number;
  constructor(providerId: string, status: number);
}
type BuildLiveModelProviderConfigParams<T extends ModelDefinitionConfig> = FetchLiveProviderModelIdsParams & {
  providerConfig: Omit<ModelProviderDeclarationConfig, "models">;
  models: readonly T[];
  ttlMs?: number;
  cacheKeyParts?: readonly unknown[];
};
declare function fetchLiveProviderModelRows(params: FetchLiveProviderModelRowsParams): Promise<readonly unknown[]>;
declare function getCachedLiveProviderModelRows(params: CachedLiveProviderModelRowsParams): Promise<readonly unknown[]>;
declare function fetchLiveProviderModelIds(params: FetchLiveProviderModelIdsParams): Promise<string[]>;
declare function buildLiveModelProviderConfig<T extends ModelDefinitionConfig>(params: BuildLiveModelProviderConfigParams<T>): Promise<ModelProviderDeclarationConfig>;
//#endregion
export { BuildLiveModelProviderConfigParams, CachedLiveProviderModelRowsParams, FetchLiveProviderModelIdsParams, FetchLiveProviderModelRowsParams, LiveModelCatalogFetchGuard, LiveModelCatalogHeaderContext, LiveModelCatalogHttpError, buildLiveModelProviderConfig, clearLiveCatalogCacheForTests, fetchLiveProviderModelIds, fetchLiveProviderModelRows, getCachedLiveProviderModelRows };