import { l as ModelDefinitionConfig } from "../../types.openclaw-D8uW-XQA.js";
import { y as SsrFPolicy } from "../../web-media-B8Te5SZ2.js";
import "../../provider-model-shared-OQQj5XdR.js";
import { C as LMSTUDIO_DEFAULT_MODEL_ID, D as LMSTUDIO_MODEL_PLACEHOLDER, E as LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER, O as LMSTUDIO_PROVIDER_ID, S as LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH, _ as resolveLoadedContextWindow, a as resolveLmstudioRuntimeApiKey, b as LMSTUDIO_DEFAULT_EMBEDDING_MODEL, f as normalizeLmstudioProviderConfig, g as resolveLmstudioServerBase, i as resolveLmstudioRequestContext, k as LMSTUDIO_PROVIDER_LABEL, l as mapLmstudioWireEntry, m as resolveLmstudioReasoningCapability, n as resolveLmstudioConfiguredApiKey, o as LmstudioModelBase, p as resolveLmstudioInferenceBase, r as resolveLmstudioProviderHeaders, s as LmstudioModelWire, t as buildLmstudioAuthHeaders, u as mapLmstudioWireModelsToConfig, v as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, x as LMSTUDIO_DEFAULT_INFERENCE_BASE_URL, y as LMSTUDIO_DEFAULT_BASE_URL } from "../../runtime-DlEKNbPE.js";
import "../../ssrf-runtime-4o_9rfoz.js";
/** Fetches /api/v1/models and reports transport reachability separately from HTTP status. */
export declare function fetchLmstudioModels(params: {
  baseUrl?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  timeoutMs?: number;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
}): Promise<{
  reachable: boolean;
  status?: number;
  models: LmstudioModelWire[];
  error?: unknown;
}>;
export declare function discoverLmstudioModels(params: {
  onListedModels?: (models: LmstudioModelWire[]) => void;
  baseUrl: string;
  apiKey: string;
  headers?: Record<string, string>;
  quiet: boolean;
  discoveryMode?: "strict";
  fetchImpl?: typeof fetch;
}): Promise<ModelDefinitionConfig[]>;
type LmstudioModelLoadParams = {
  baseUrl?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  modelKey: string;
  requestedContextLength?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
};
/** Keeps the public model/cache identity stable for embedding and SDK callers. */
export declare function ensureLmstudioModelLoaded(params: LmstudioModelLoadParams): Promise<string>;
export { LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, LMSTUDIO_DEFAULT_BASE_URL, LMSTUDIO_DEFAULT_EMBEDDING_MODEL, LMSTUDIO_DEFAULT_INFERENCE_BASE_URL, LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH, LMSTUDIO_DEFAULT_MODEL_ID, LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER, LMSTUDIO_MODEL_PLACEHOLDER, LMSTUDIO_PROVIDER_ID, LMSTUDIO_PROVIDER_LABEL, type LmstudioModelBase, type LmstudioModelWire, buildLmstudioAuthHeaders, mapLmstudioWireEntry, mapLmstudioWireModelsToConfig, normalizeLmstudioProviderConfig, resolveLmstudioConfiguredApiKey, resolveLmstudioInferenceBase, resolveLmstudioProviderHeaders, resolveLmstudioReasoningCapability, resolveLmstudioRequestContext, resolveLmstudioRuntimeApiKey, resolveLmstudioServerBase, resolveLoadedContextWindow };