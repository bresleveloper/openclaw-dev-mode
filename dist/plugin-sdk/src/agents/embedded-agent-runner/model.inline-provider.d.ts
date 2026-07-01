import type { ModelDefinitionConfig, ModelProviderConfig } from "../../config/types.js";
import type { Api } from "../../llm/types.js";
/**
 * Normalizes inline `models.providers` config into runtime model entries.
 */
type InlineModelEntry = Omit<ModelDefinitionConfig, "api"> & {
    api?: Api;
    provider: string;
    baseUrl?: string;
    headers?: Record<string, string>;
};
export type InlineProviderConfig = {
    baseUrl?: string;
    api?: ModelDefinitionConfig["api"];
    models?: ModelDefinitionConfig[];
    contextWindow?: ModelProviderConfig["contextWindow"];
    contextTokens?: ModelProviderConfig["contextTokens"];
    maxTokens?: ModelProviderConfig["maxTokens"];
    params?: ModelProviderConfig["params"];
    headers?: unknown;
    authHeader?: boolean;
    timeoutSeconds?: ModelProviderConfig["timeoutSeconds"];
    request?: ModelProviderConfig["request"];
    localService?: ModelProviderConfig["localService"];
};
/** Returns a supported transport API id from raw config values. */
export declare function normalizeResolvedTransportApi(api: unknown): ModelDefinitionConfig["api"] | undefined;
/** Sanitizes configured provider/model headers before they enter runtime model metadata. */
export declare function sanitizeModelHeaders(headers: unknown, opts?: {
    stripSecretRefMarkers?: boolean;
}): Record<string, string> | undefined;
/** Resolves model input modalities with Foundry legacy vision-model compatibility. */
export declare function resolveProviderModelInput(params: {
    provider?: string;
    modelId?: string;
    modelName?: string;
    input?: unknown;
    fallbackInput?: unknown;
}): Array<"text" | "image">;
/** Builds runtime model records from inline provider config, inheriting provider-level defaults. */
export declare function buildInlineProviderModels(providers: Record<string, InlineProviderConfig>): InlineModelEntry[];
export {};
