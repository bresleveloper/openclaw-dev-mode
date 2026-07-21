import { m as ModelProviderDeclarationConfig } from "../../types.models-BvJnk7Su.js";
import { Hf as ProviderRuntimeModel } from "../../types-BpDhk2ev.js";
import { i as ModelCatalogEntry } from "../../defaults-BMN5J5xk.js";
import { a as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-k2hqXnUA.js";

//#region extensions/opencode/provider-catalog.d.ts
type FetchOpencodeZenLiveModelIdsParams = {
  apiKey?: string;
  discoveryApiKey?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
};
declare function buildStaticOpencodeZenProviderConfig(apiKey?: string): ModelProviderDeclarationConfig;
declare function buildOpencodeZenLiveProviderConfig(params?: FetchOpencodeZenLiveModelIdsParams): Promise<ModelProviderDeclarationConfig>;
declare function listOpencodeZenModelCatalogEntries(): ModelCatalogEntry[];
declare function resolveOpencodeZenModel(modelId: string): ProviderRuntimeModel | undefined;
declare function normalizeOpencodeZenBaseUrl(params: {
  api?: string | null;
  baseUrl?: string;
}): string | undefined;
//#endregion
export { FetchOpencodeZenLiveModelIdsParams, buildOpencodeZenLiveProviderConfig, buildStaticOpencodeZenProviderConfig, listOpencodeZenModelCatalogEntries, normalizeOpencodeZenBaseUrl, resolveOpencodeZenModel };