import { l as ModelDefinitionConfig, p as ModelProviderDeclarationConfig, r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { A as VercelGatewayRouting, h as OpenRouterRouting } from "./types-B1zI2CfC.js";
import "./index-DU_vyQtb.js";
import "./provider-auth-QzauSf-u.js";
import "./provider-model-shared-OQQj5XdR.js";
declare const LMSTUDIO_DEFAULT_BASE_URL = "http://localhost:1234";
declare const LMSTUDIO_DEFAULT_INFERENCE_BASE_URL = "http://localhost:1234/v1";
declare const LMSTUDIO_DOCKER_HOST_BASE_URL = "http://host.docker.internal:1234";
declare const LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL = "http://host.docker.internal:1234/v1";
declare const LMSTUDIO_DEFAULT_EMBEDDING_MODEL = "text-embedding-nomic-embed-text-v1.5";
declare const LMSTUDIO_PROVIDER_LABEL = "LM Studio";
declare const LMSTUDIO_DEFAULT_API_KEY_ENV_VAR = "LM_API_TOKEN";
declare const LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER = "lmstudio-local";
declare const LMSTUDIO_MODEL_PLACEHOLDER = "model-key-from-api-v1-models";
declare const LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH = 64000;
declare const LMSTUDIO_DEFAULT_MODEL_ID = "qwen/qwen3.5-9b";
declare const LMSTUDIO_PROVIDER_ID = "lmstudio";
type LmstudioModelWire = {
  type?: "llm" | "embedding";
  key?: string;
  display_name?: string;
  max_context_length?: number;
  format?: "gguf" | "mlx" | null;
  variants?: unknown;
  selected_variant?: unknown;
  capabilities?: {
    vision?: boolean;
    trained_for_tool_use?: boolean;
    reasoning?: LmstudioReasoningCapabilityWire;
  };
  loaded_instances?: Array<{
    id?: string;
    config?: {
      context_length?: number;
    } | null;
  } | null>;
};
type LmstudioReasoningCapabilityWire = {
  allowed_options?: unknown;
  default?: unknown;
};
declare function resolveLmstudioReasoningCompat(entry: Pick<LmstudioModelWire, "capabilities">): ModelDefinitionConfig["compat"] | undefined;
declare function resolveLmstudioReasoningCapability(entry: Pick<LmstudioModelWire, "capabilities">): boolean;
declare function resolveLoadedContextWindow(entry: Pick<LmstudioModelWire, "loaded_instances">): number | null;
/** Resolves LM Studio server base URL (without /v1 or /api/v1). */
declare function resolveLmstudioServerBase(configuredBaseUrl?: string): string;
declare function resolveLmstudioInferenceBase(configuredBaseUrl?: string): string;
declare function normalizeLmstudioProviderConfig(provider: ModelProviderDeclarationConfig): ModelProviderDeclarationConfig;
declare function normalizeLmstudioConfiguredCatalogEntries(models?: readonly ModelDefinitionConfig[]): {
  provider: string;
  id: string;
  name: string;
  parameterCount?: number | undefined;
  contextWindow: number | undefined;
  contextTokens: number | undefined;
  reasoning: boolean;
  input: ("image" | "text")[] | undefined;
  compat: {
    openRouterRouting?: OpenRouterRouting;
    vercelGatewayRouting?: VercelGatewayRouting;
    supportsStore?: boolean | undefined;
    supportsPromptCacheKey?: boolean | undefined;
    supportsResponsesContinuation?: boolean | undefined;
    supportsDeveloperRole?: boolean | undefined;
    supportsReasoningEffort?: boolean | undefined;
    supportsTemperature?: boolean | undefined;
    supportsInstructions?: boolean | undefined;
    cachesInstructions?: boolean | undefined;
    supportsTools?: boolean | undefined;
    codeMode?: "capable" | "preferred" | undefined;
    supportsStrictMode?: boolean | undefined;
    supportsJsonSchemaResponseFormat?: boolean | undefined;
    requiresStringContent?: boolean | undefined;
    strictMessageKeys?: boolean | undefined;
    visibleReasoningDetailTypes?: string[] | undefined;
    supportedReasoningEfforts?: string[] | undefined;
    reasoningEffortMap?: Record<string, string> | undefined;
    defaultThinkingLevel?: string | undefined;
    thinkingLevels?: string[] | undefined;
    adaptiveThinking?: boolean | undefined;
    thinkingRequired?: boolean | undefined;
    thinkingLevelLabels?: Record<string, string> | undefined;
    maxTokensField?: "max_completion_tokens" | "max_tokens" | undefined;
    thinkingFormat?: "deepseek" | "openai" | "openrouter" | "qwen" | "qwen-chat-template" | "together" | "zai" | undefined;
    requiresToolResultName?: boolean | undefined;
    requiresAssistantAfterToolResult?: boolean | undefined;
    requiresThinkingAsText?: boolean | undefined;
    requiresReasoningContentOnAssistantMessages?: boolean | undefined;
    toolSchemaProfile?: string | undefined;
    unsupportedToolSchemaKeywords?: string[] | undefined;
    toolCallArgumentsEncoding?: string | undefined;
    requiresOpenAiAnthropicToolPayload?: boolean | undefined;
    zaiToolStream?: boolean | undefined;
    cacheControlFormat?: "anthropic" | undefined;
    sendSessionAffinityHeaders?: boolean | undefined;
    sendSessionIdHeader?: boolean | undefined;
    supportsEagerToolInputStreaming?: boolean | undefined;
    supportsLongCacheRetention?: boolean | undefined;
    supportsUsageInStreaming: boolean;
  };
}[];
declare function buildLmstudioModelName(model: {
  displayName: string;
  format: "gguf" | "mlx" | null;
  vision: boolean;
  trainedForToolUse: boolean;
  loaded: boolean;
}): string;
/**
 * Shared by the setup layer (persists simple names to config) and the runtime
 * discovery path (which enriches the name with format/state tags).
 */
type LmstudioModelBase = {
  id: string;
  displayName: string;
  format: "gguf" | "mlx" | null;
  vision: boolean;
  trainedForToolUse: boolean;
  loaded: boolean;
  reasoning: boolean;
  input: Array<"text" | "image">;
  cost: ModelDefinitionConfig["cost"];
  compat?: ModelDefinitionConfig["compat"];
  contextWindow: number;
  contextTokens: number;
  maxTokens: number;
};
declare function mapLmstudioWireEntry(entry: LmstudioModelWire): LmstudioModelBase | null;
declare function mapLmstudioWireModelsToConfig(models: LmstudioModelWire[]): ModelDefinitionConfig[];
type LmstudioAuthHeadersParams = {
  apiKey?: string;
  json?: boolean;
  headers?: Record<string, string>;
};
declare function buildLmstudioAuthHeaders(params: LmstudioAuthHeadersParams): Record<string, string> | undefined;
declare function resolveLmstudioConfiguredApiKey(params: {
  config?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  path?: string;
  allowUnresolved?: boolean;
}): Promise<string | undefined>;
declare function resolveLmstudioProviderHeaders(params: {
  config?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  headers?: unknown;
  path?: string;
}): Promise<Record<string, string> | undefined>;
/**
 * Resolves LM Studio API key and provider headers in parallel.
 * Use this as the standard auth setup step before discovery or model load calls.
 */
declare function resolveLmstudioRequestContext(params: {
  config?: OpenClawConfig;
  agentDir?: string;
  env?: NodeJS.ProcessEnv;
  providerHeaders?: unknown;
}): Promise<{
  apiKey: string | undefined;
  headers: Record<string, string> | undefined;
}>;
declare function resolveLmstudioRuntimeApiKey(params: {
  config?: OpenClawConfig;
  agentDir?: string;
  env?: NodeJS.ProcessEnv;
  headers?: unknown;
}): Promise<string | undefined>;
export { LMSTUDIO_DEFAULT_MODEL_ID as C, LMSTUDIO_MODEL_PLACEHOLDER as D, LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER as E, LMSTUDIO_PROVIDER_ID as O, LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH as S, LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL as T, resolveLoadedContextWindow as _, resolveLmstudioRuntimeApiKey as a, LMSTUDIO_DEFAULT_EMBEDDING_MODEL as b, buildLmstudioModelName as c, normalizeLmstudioConfiguredCatalogEntries as d, normalizeLmstudioProviderConfig as f, resolveLmstudioServerBase as g, resolveLmstudioReasoningCompat as h, resolveLmstudioRequestContext as i, LMSTUDIO_PROVIDER_LABEL as k, mapLmstudioWireEntry as l, resolveLmstudioReasoningCapability as m, resolveLmstudioConfiguredApiKey as n, LmstudioModelBase as o, resolveLmstudioInferenceBase as p, resolveLmstudioProviderHeaders as r, LmstudioModelWire as s, buildLmstudioAuthHeaders as t, mapLmstudioWireModelsToConfig as u, LMSTUDIO_DEFAULT_API_KEY_ENV_VAR as v, LMSTUDIO_DOCKER_HOST_BASE_URL as w, LMSTUDIO_DEFAULT_INFERENCE_BASE_URL as x, LMSTUDIO_DEFAULT_BASE_URL as y };