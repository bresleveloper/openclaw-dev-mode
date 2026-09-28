import { Ct as ProviderAuthMethod, cn as SecretInputMode, vn as LookupFn, wn as RuntimeEnv, xn as WizardPrompter } from "../../runtime-api-CHs6AUp7.js";
import { Lt as SecretInput, c as ModelProviderDeclarationConfig, i as ModelDefinitionConfig, n as OpenClawConfig } from "../../types.openclaw-BsXQib09.js";
import "../../provider-onboard-_yAs2E3T.js";
import { _ as OLLAMA_DEFAULT_COST, b as resolveOllamaSetupDefaultBaseUrl, d as resolveOllamaCompatNumCtxEnabled, f as shouldInjectOllamaCompatNumCtx, g as OLLAMA_DEFAULT_CONTEXT_WINDOW, h as OLLAMA_DEFAULT_BASE_URL, l as createConfiguredOllamaCompatStreamWrapper, p as wrapOllamaCompatNumCtx, r as buildOllamaChatRequest, u as isOllamaCompatProvider, v as OLLAMA_DEFAULT_MAX_TOKENS, y as OLLAMA_DEFAULT_MODEL } from "../../stream-api-CA32koju.js";
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
declare namespace setup_runtime_d_exports {
  export { buildOllamaProvider, checkOllamaCloudAuth, configureOllamaNonInteractive$1 as configureOllamaNonInteractive, ensureOllamaModelPulled$1 as ensureOllamaModelPulled, promptAndConfigureOllama$1 as promptAndConfigureOllama, resolveOllamaSetupDefaultBaseUrl, validateOllamaNonInteractive };
}
type OllamaSetupOptions = {
  customBaseUrl?: string;
  customModelId?: string;
};
type OllamaSetupResult = {
  config: OpenClawConfig;
  credential?: SecretInput;
  credentialMode?: SecretInputMode;
  defaultModel?: string;
};
declare function checkOllamaCloudAuth(baseUrl: string): Promise<{
  signedIn: boolean;
  signinUrl?: string;
}>;
declare function promptAndConfigureOllama$1(params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  workspaceDir?: string;
  opts?: Record<string, unknown>;
  prompter: WizardPrompter;
  secretInputMode?: SecretInputMode;
  allowSecretRefPrompt?: boolean;
  signal?: AbortSignal;
}): Promise<OllamaSetupResult>;
/** Checks existing host models without pulling or mutating state before reset. */
declare function validateOllamaNonInteractive(ctx: Parameters<NonNullable<ProviderAuthMethod["validateNonInteractive"]>>[0]): Promise<boolean>;
declare function configureOllamaNonInteractive$1(params: {
  nextConfig: OpenClawConfig;
  opts: OllamaSetupOptions;
  runtime: RuntimeEnv;
  agentDir?: string;
}): Promise<OpenClawConfig>;
declare function ensureOllamaModelPulled$1(params: {
  config: OpenClawConfig;
  model: string;
  prompter: WizardPrompter;
}): Promise<void>;
//#endregion
//#region extensions/ollama/src/setup.d.ts
type OllamaSetupRuntime = typeof setup_runtime_d_exports;
export declare const promptAndConfigureOllama: OllamaSetupRuntime["promptAndConfigureOllama"];
export declare const configureOllamaNonInteractive: OllamaSetupRuntime["configureOllamaNonInteractive"];
export declare const ensureOllamaModelPulled: OllamaSetupRuntime["ensureOllamaModelPulled"];
//#endregion
export { OLLAMA_DEFAULT_BASE_URL, OLLAMA_DEFAULT_CONTEXT_WINDOW, OLLAMA_DEFAULT_COST, OLLAMA_DEFAULT_MAX_TOKENS, OLLAMA_DEFAULT_MODEL, type OllamaModelShowInfo, type OllamaModelWithContext, type OllamaTagModel, type OllamaTagsResponse, buildOllamaChatRequest, createConfiguredOllamaCompatStreamWrapper, isOllamaCompatProvider, resolveOllamaCompatNumCtxEnabled, resolveOllamaSetupDefaultBaseUrl, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };