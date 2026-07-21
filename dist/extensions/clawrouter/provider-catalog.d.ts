import { m as ModelProviderDeclarationConfig } from "../../types.models-BvJnk7Su.js";
import { Hf as ProviderRuntimeModel } from "../../types-BpDhk2ev.js";
import { a as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-k2hqXnUA.js";

//#region extensions/clawrouter/provider-catalog.d.ts
declare const CLAWROUTER_DEFAULT_BASE_URL = "https://clawrouter.openclaw.ai";
declare function normalizeClawRouterRootUrl(baseUrl: string | undefined): string;
declare function normalizeClawRouterApiBaseUrl(baseUrl: string | undefined): string;
declare function buildClawRouterProviderConfig(params: {
  apiKey: string;
  discoveryApiKey?: string;
  baseUrl?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
}): Promise<ModelProviderDeclarationConfig>;
declare function normalizeClawRouterResolvedModel(model: ProviderRuntimeModel): ProviderRuntimeModel | undefined;
declare function prepareClawRouterRequestModel(model: ProviderRuntimeModel): ProviderRuntimeModel;
//#endregion
export { CLAWROUTER_DEFAULT_BASE_URL, buildClawRouterProviderConfig, normalizeClawRouterApiBaseUrl, normalizeClawRouterResolvedModel, normalizeClawRouterRootUrl, prepareClawRouterRequestModel };