import type { ModelDefinitionConfig, ModelProviderConfig, OpenClawConfig } from "../config/types.js";
type LmstudioReasoningCapabilityWire = {
    allowed_options?: unknown;
    default?: unknown;
};
/** Raw model entry returned by LM Studio's local model catalog endpoints. */
export type LmstudioModelWire = {
    type?: "llm" | "embedding";
    key?: string;
    display_name?: string;
    max_context_length?: number;
    format?: "gguf" | "mlx" | null;
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
/** Normalized model metadata used by OpenClaw provider catalogs. */
export type LmstudioModelBase = {
    id: string;
    displayName: string;
    format: "gguf" | "mlx" | null;
    vision: boolean;
    trainedForToolUse: boolean;
    loaded: boolean;
    reasoning: boolean;
    input: Array<"text" | "image">;
    cost: ModelDefinitionConfig["cost"];
    contextWindow: number;
    contextTokens: number;
    maxTokens: number;
};
/** Result from probing LM Studio model discovery without throwing on unreachable servers. */
export type FetchLmstudioModelsResult = {
    reachable: boolean;
    status?: number;
    models: LmstudioModelWire[];
    error?: unknown;
};
type FacadeModule = {
    LMSTUDIO_DEFAULT_BASE_URL: string;
    LMSTUDIO_DEFAULT_INFERENCE_BASE_URL: string;
    LMSTUDIO_DEFAULT_EMBEDDING_MODEL: string;
    LMSTUDIO_PROVIDER_LABEL: string;
    LMSTUDIO_DEFAULT_API_KEY_ENV_VAR: string;
    LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER: string;
    LMSTUDIO_MODEL_PLACEHOLDER: string;
    LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH: number;
    LMSTUDIO_DEFAULT_MODEL_ID: string;
    LMSTUDIO_PROVIDER_ID: string;
    resolveLmstudioReasoningCapability: (entry: Pick<LmstudioModelWire, "capabilities">) => boolean;
    resolveLoadedContextWindow: (entry: Pick<LmstudioModelWire, "loaded_instances">) => number | null;
    resolveLmstudioServerBase: (configuredBaseUrl?: string) => string;
    resolveLmstudioInferenceBase: (configuredBaseUrl?: string) => string;
    normalizeLmstudioProviderConfig: (provider: ModelProviderConfig) => ModelProviderConfig;
    fetchLmstudioModels: (params?: {
        baseUrl?: string;
        apiKey?: string;
        headers?: Record<string, string>;
        ssrfPolicy?: unknown;
        timeoutMs?: number;
        fetchImpl?: typeof fetch;
    }) => Promise<FetchLmstudioModelsResult>;
    mapLmstudioWireEntry: (entry: LmstudioModelWire) => LmstudioModelBase | null;
    discoverLmstudioModels: (params?: {
        config?: OpenClawConfig;
        baseUrl?: string;
        apiKey?: string;
        headers?: Record<string, string>;
    }) => Promise<ModelDefinitionConfig[]>;
    ensureLmstudioModelLoaded: (params: Record<string, unknown>) => Promise<unknown>;
    buildLmstudioAuthHeaders: (params: {
        apiKey?: string;
        json?: boolean;
        headers?: Record<string, string>;
    }) => Record<string, string> | undefined;
    resolveLmstudioConfiguredApiKey: (params: {
        config?: OpenClawConfig;
        env?: NodeJS.ProcessEnv;
        path?: string;
    }) => Promise<string | undefined>;
    resolveLmstudioProviderHeaders: (params: {
        config?: OpenClawConfig;
        env?: NodeJS.ProcessEnv;
        headers?: unknown;
        path?: string;
    }) => Promise<Record<string, string> | undefined>;
    resolveLmstudioRequestContext: (params: {
        config?: OpenClawConfig;
        env?: NodeJS.ProcessEnv;
        headers?: unknown;
        providerHeaders?: unknown;
        path?: string;
    }) => Promise<{
        apiKey?: string;
        headers?: Record<string, string>;
    }>;
    resolveLmstudioRuntimeApiKey: (params: {
        config?: OpenClawConfig;
        agentDir?: string;
        env?: NodeJS.ProcessEnv;
        headers?: unknown;
    }) => Promise<string | undefined>;
};
/** Default local LM Studio server base URL. */
export declare const LMSTUDIO_DEFAULT_BASE_URL: FacadeModule["LMSTUDIO_DEFAULT_BASE_URL"];
/** Default OpenAI-compatible inference base derived from the local LM Studio server URL. */
export declare const LMSTUDIO_DEFAULT_INFERENCE_BASE_URL: FacadeModule["LMSTUDIO_DEFAULT_INFERENCE_BASE_URL"];
/** Default embedding model id advertised by LM Studio setup helpers. */
export declare const LMSTUDIO_DEFAULT_EMBEDDING_MODEL: FacadeModule["LMSTUDIO_DEFAULT_EMBEDDING_MODEL"];
/** Human-readable provider label for LM Studio catalogs and setup output. */
export declare const LMSTUDIO_PROVIDER_LABEL: FacadeModule["LMSTUDIO_PROVIDER_LABEL"];
/** Environment variable checked for LM Studio API tokens. */
export declare const LMSTUDIO_DEFAULT_API_KEY_ENV_VAR: FacadeModule["LMSTUDIO_DEFAULT_API_KEY_ENV_VAR"];
/** Placeholder token used for local LM Studio servers that accept any API key. */
export declare const LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER: FacadeModule["LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER"];
/** Placeholder model id shown when setup needs a model from `/api/v1/models`. */
export declare const LMSTUDIO_MODEL_PLACEHOLDER: FacadeModule["LMSTUDIO_MODEL_PLACEHOLDER"];
/** Default context length requested when loading LM Studio models. */
export declare const LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH: FacadeModule["LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH"];
/** Default chat model id used when no local LM Studio model has been selected. */
export declare const LMSTUDIO_DEFAULT_MODEL_ID: FacadeModule["LMSTUDIO_DEFAULT_MODEL_ID"];
/** Stable provider id used in OpenClaw config and provider catalogs. */
export declare const LMSTUDIO_PROVIDER_ID: FacadeModule["LMSTUDIO_PROVIDER_ID"];
/** Resolve whether an LM Studio wire entry advertises reasoning support. */
export declare const resolveLmstudioReasoningCapability: FacadeModule["resolveLmstudioReasoningCapability"];
/** Resolve context-window metadata from currently loaded LM Studio instances. */
export declare const resolveLoadedContextWindow: FacadeModule["resolveLoadedContextWindow"];
/** Normalize a configured LM Studio server base URL. */
export declare const resolveLmstudioServerBase: FacadeModule["resolveLmstudioServerBase"];
/** Normalize the OpenAI-compatible LM Studio inference base URL. */
export declare const resolveLmstudioInferenceBase: FacadeModule["resolveLmstudioInferenceBase"];
/** Normalize an LM Studio provider config before runtime use. */
export declare const normalizeLmstudioProviderConfig: FacadeModule["normalizeLmstudioProviderConfig"];
/** Fetch raw LM Studio model entries with SSRF and timeout handling owned by the facade. */
export declare const fetchLmstudioModels: FacadeModule["fetchLmstudioModels"];
/** Map one raw LM Studio model entry into OpenClaw model metadata. */
export declare const mapLmstudioWireEntry: FacadeModule["mapLmstudioWireEntry"];
/** Discover OpenClaw model definitions from an LM Studio server. */
export declare const discoverLmstudioModels: FacadeModule["discoverLmstudioModels"];
/** Ensure a specific LM Studio model is loaded before use. */
export declare const ensureLmstudioModelLoaded: FacadeModule["ensureLmstudioModelLoaded"];
/** Build request headers for LM Studio calls from optional API key and caller headers. */
export declare const buildLmstudioAuthHeaders: FacadeModule["buildLmstudioAuthHeaders"];
/** Resolve the configured LM Studio API key from config, env, or profile path. */
export declare const resolveLmstudioConfiguredApiKey: FacadeModule["resolveLmstudioConfiguredApiKey"];
/** Resolve provider headers for LM Studio catalog and runtime requests. */
export declare const resolveLmstudioProviderHeaders: FacadeModule["resolveLmstudioProviderHeaders"];
/** Resolve the combined API key and headers used for LM Studio requests. */
export declare const resolveLmstudioRequestContext: FacadeModule["resolveLmstudioRequestContext"];
/** Resolve the runtime API key for an agent-scoped LM Studio request. */
export declare const resolveLmstudioRuntimeApiKey: FacadeModule["resolveLmstudioRuntimeApiKey"];
export {};
