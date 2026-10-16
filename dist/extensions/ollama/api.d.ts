import { Cn as SecretInputMode, Mn as WizardPrompter } from "../../agent-harness-runtime-Du4B564s.js";
import { Q as ModelDefinitionConfig, R as RuntimeEnv, X as OpenClawConfig, k as LookupFn, nt as ModelProviderDeclarationConfig, sn as SecretInput } from "../../runtime-types-LI_BBveH.js";
import "../../ssrf-runtime-DBBZ0Uv6.js";
import { _ as OLLAMA_DEFAULT_COST, b as resolveOllamaSetupDefaultBaseUrl, d as resolveOllamaCompatNumCtxEnabled, f as shouldInjectOllamaCompatNumCtx, g as OLLAMA_DEFAULT_CONTEXT_WINDOW, h as OLLAMA_DEFAULT_BASE_URL, l as createConfiguredOllamaCompatStreamWrapper, p as wrapOllamaCompatNumCtx, r as buildOllamaChatRequest, u as isOllamaCompatProvider, v as OLLAMA_DEFAULT_MAX_TOKENS, y as OLLAMA_DEFAULT_MODEL } from "../../stream-api-Y8IfSq32.js";
import { z } from "zod";
//#region extensions/ollama/src/provider-models.d.ts
type OllamaTagModel = {
  name: string;
  modified_at?: string;
  size?: number;
  digest?: string;
  remote_host?: string;
  remote_model?: string;
  capabilities?: string[];
  details?: {
    context_length?: number;
    family?: string;
    parameter_size?: string;
    quantization_level?: string;
  };
};
type OllamaTagsResponse = {
  models?: OllamaTagModel[];
};
type OllamaModelWithContext = OllamaTagModel & OllamaModelShowInfo & {
  capabilitiesFromList?: boolean;
};
export declare function resolveOllamaApiBase(configuredBaseUrl?: string): string;
type OllamaModelShowInfo = {
  contextWindow?: number;
  capabilities?: string[];
  /** Distinguishes a failed request from a successful response that omitted capabilities. */
  showInspectionFailed?: boolean;
};
type OllamaModelRequestOptions = {
  apiKey?: string;
  timeoutMs?: number;
  signal?: AbortSignal;
  discoveryMode?: "strict";
};
export declare function queryOllamaModelShowInfo(apiBase: string, modelName: string, opts?: OllamaModelRequestOptions): Promise<OllamaModelShowInfo>;
/** @deprecated Use queryOllamaModelShowInfo instead. */
export declare function queryOllamaContextWindow(apiBase: string, modelName: string): Promise<number | undefined>;
export declare function enrichOllamaModelsWithContext(apiBase: string, models: OllamaTagModel[], opts?: OllamaModelRequestOptions & {
  concurrency?: number;
}): Promise<OllamaModelWithContext[]>;
export declare function isReasoningModelHeuristic(modelId: string): boolean;
export declare function buildOllamaModelDefinition(modelId: string, contextWindow?: number, capabilities?: string[], opts?: {
  showInspectionFailed?: boolean;
}): ModelDefinitionConfig;
/** Optional test hooks so discovery can exercise the real guarded-fetch owner. */
type OllamaModelsFetchDeps = {
  fetchImpl?: typeof fetch;
  lookupFn?: LookupFn;
};
export declare function fetchOllamaModels(baseUrl: string, opts?: OllamaModelRequestOptions, deps?: OllamaModelsFetchDeps): Promise<{
  reachable: boolean;
  models: OllamaTagModel[];
}>;
export declare function buildOllamaProvider(configuredBaseUrl?: string, opts?: {
  apiKey?: string;
  quiet?: boolean;
  discoveryMode?: "strict";
}): Promise<ModelProviderDeclarationConfig>;
//#endregion
//#region extensions/ollama/src/setup.d.ts
export declare const promptAndConfigureOllama: (params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  workspaceDir?: string;
  opts?: Record<string, unknown>;
  prompter: WizardPrompter;
  secretInputMode?: SecretInputMode;
  allowSecretRefPrompt?: boolean;
  signal?: AbortSignal;
}) => Promise<{
  config: OpenClawConfig;
  credential?: SecretInput;
  credentialMode?: SecretInputMode;
  defaultModel?: string;
}>;
export declare const configureOllamaNonInteractive: (params: {
  nextConfig: OpenClawConfig;
  opts: {
    customBaseUrl?: string;
    customModelId?: string;
  };
  runtime: RuntimeEnv;
  agentDir?: string;
}) => Promise<OpenClawConfig>;
export declare const ensureOllamaModelPulled: (params: {
  config: OpenClawConfig;
  model: string;
  prompter: WizardPrompter;
}) => Promise<void>;
//#endregion
export { OLLAMA_DEFAULT_BASE_URL, OLLAMA_DEFAULT_CONTEXT_WINDOW, OLLAMA_DEFAULT_COST, OLLAMA_DEFAULT_MAX_TOKENS, OLLAMA_DEFAULT_MODEL, type OllamaModelShowInfo, type OllamaModelWithContext, type OllamaTagModel, type OllamaTagsResponse, buildOllamaChatRequest, createConfiguredOllamaCompatStreamWrapper, isOllamaCompatProvider, resolveOllamaCompatNumCtxEnabled, resolveOllamaSetupDefaultBaseUrl, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };