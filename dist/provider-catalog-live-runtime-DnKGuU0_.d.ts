import { Jb as fetchWithSsrFGuard } from "./config-contracts-hzlacViZ.js";
import { l as ModelDefinitionConfig, p as ModelProviderDeclarationConfig } from "./types.openclaw-D8uW-XQA.js";
import "./provider-model-types-DGw4ZQp7.js";
import { g as LookupFn, y as SsrFPolicy } from "./web-media-B8Te5SZ2.js";
import "./provider-context-BvC7EnIY.js";
import "./provider-model-shared-OQQj5XdR.js";
import "./provider-catalog-shared-B0h2-zRI.js";
import "./ssrf-runtime-4o_9rfoz.js";
import "./agent-runtime-Cg_ru1dE.js";
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
type LiveModelRowProjection<T extends ModelDefinitionConfig = ModelDefinitionConfig> = (rows: readonly unknown[], fallback: ModelProviderDeclarationConfig) => readonly T[];
type OpenAICompatibleModelDiscoveryOptions = {
  authentication?: "none";
  /** Fixed endpoint used only while the effective inference base remains canonical. */
  endpointUrl?: {
    url: string;
    requireBaseUrl: string;
  };
  /** Relative path appended to the effective provider base URL. Defaults to `models`. */
  endpointPath?: string;
  /** Provider-specific response row selector when the response is not `{ data: [] }`. */
  readRows?: FetchLiveProviderModelRowsParams["readRows"];
  /** Provider-owned projection when the conservative OpenAI-compatible projection is insufficient. */
  projectRows?: LiveModelRowProjection;
  /** Live catalog request timeout. Defaults to 5 seconds. */
  timeoutMs?: number;
  /** Successful live catalog cache lifetime. Defaults to 60 seconds. */
  ttlMs?: number;
  /** Provider-specific authorization headers for non-Bearer model-list APIs. */
  buildRequestHeaders?: FetchLiveProviderModelRowsParams["buildRequestHeaders"];
  /**
   * Gate for discovered ids the manifest does not already publish. Providers
   * whose request shaping is model-version specific use this to drop models
   * they cannot yet shape, so discovery never surfaces a selectable model that
   * would build an invalid request. Manifest-published ids bypass it.
   */
  acceptUnknownModel?: (params: {
    id: string;
    record: Record<string, unknown>;
  }) => boolean;
  /**
   * Provider prior for discovered ids the manifest does not publish whose rows carry no
   * capability evidence. `"unlikely"` keeps them out of default pickers; typed and configured
   * refs still run. Rows that declare chat or non-chat support are unaffected.
   */
  unknownModelChatEvidence?: "unlikely";
};
export { OpenAICompatibleModelDiscoveryOptions as t };