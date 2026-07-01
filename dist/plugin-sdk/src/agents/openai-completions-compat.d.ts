/**
 * OpenAI-completions compatibility defaults.
 *
 * Provider transports use these helpers to derive OpenAI-compatible request
 * behavior from endpoint attribution without scattering provider-specific flags.
 */
import type { Model } from "../llm/types.js";
import type { ProviderEndpointClass, ProviderRequestCapabilities } from "./provider-attribution.js";
type OpenAICompletionsCompatDefaultsInput = {
    provider?: string;
    endpointClass: ProviderEndpointClass;
    knownProviderFamily: string;
    supportsNativeStreamingUsageCompat?: boolean;
    supportsOpenAICompletionsStreamingUsageCompat?: boolean;
    usesExplicitProxyLikeEndpoint?: boolean;
};
type OpenAICompletionsCompatDefaults = {
    supportsStore: boolean;
    supportsDeveloperRole: boolean;
    supportsReasoningEffort: boolean;
    supportsUsageInStreaming: boolean;
    maxTokensField: "max_completion_tokens" | "max_tokens";
    thinkingFormat: "openai" | "openrouter" | "deepseek" | "together" | "zai";
    visibleReasoningDetailTypes: string[];
    supportsStrictMode: boolean;
    requiresReasoningContentOnAssistantMessages: boolean;
    requiresNonEmptyUserOrAssistantMessage: boolean;
};
type DetectedOpenAICompletionsCompat = {
    capabilities: ProviderRequestCapabilities;
    defaults: OpenAICompletionsCompatDefaults;
};
/** Resolves default request flags for an OpenAI-compatible completions endpoint. */
export declare function resolveOpenAICompletionsCompatDefaults(input: OpenAICompletionsCompatDefaultsInput): OpenAICompletionsCompatDefaults;
/** Detects endpoint capabilities and defaults for an OpenAI-completions model. */
export declare function detectOpenAICompletionsCompat(model: Pick<Model<"openai-completions">, "provider" | "baseUrl" | "id"> & {
    compat?: {
        supportsStore?: boolean;
    } | null;
}): DetectedOpenAICompletionsCompat;
export {};
