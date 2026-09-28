import "./index-C25RT6bP.mjs";
import { M as OpenAICompletionsCompat, O as Model } from "./types-qZFbaDbK.mjs";
import { a as AiProviderRequestPolicyInput, i as AiProviderRequestCapabilities } from "./host-DH-Z-LDb.mjs";
//#region packages/ai/src/transports/openai-completions-compat.d.ts
type ProviderRequestCapabilities = AiProviderRequestCapabilities;
type OpenAICompletionsSessionAffinity = "none" | "openai" | "openrouter";
type OpenAICompletionsCompatDefaults = {
  supportsStore: boolean;
  supportsDeveloperRole: boolean;
  supportsReasoningEffort: boolean;
  supportsUsageInStreaming: boolean;
  maxTokensField: "max_completion_tokens" | "max_tokens";
  thinkingFormat: "openai" | "openrouter" | "deepseek" | "together" | "zai";
  visibleReasoningDetailTypes: string[];
  supportsStrictMode: boolean;
  supportsJsonSchemaResponseFormat: boolean;
  requiresReasoningContentOnAssistantMessages: boolean;
  requiresNonEmptyUserOrAssistantMessage: boolean;
  cacheControlFormat?: OpenAICompletionsCompat["cacheControlFormat"];
  sessionAffinityFormat: Exclude<OpenAICompletionsSessionAffinity, "none">;
  supportsLongCacheRetention: boolean;
};
type DetectedOpenAICompletionsCompat = {
  capabilities: ProviderRequestCapabilities;
  defaults: OpenAICompletionsCompatDefaults;
};
type ResolvedOpenAICompletionsCompat = Omit<Required<OpenAICompletionsCompat>, "cacheControlFormat" | "openRouterRouting" | "sendSessionAffinityHeaders" | "reasoningEffortMap" | "supportedReasoningEfforts"> & Pick<OpenAICompletionsCompat, "reasoningEffortMap" | "supportedReasoningEfforts"> & {
  cacheControlFormat?: OpenAICompletionsCompat["cacheControlFormat"];
  openRouterRouting?: OpenAICompletionsCompat["openRouterRouting"];
  sessionAffinity: OpenAICompletionsSessionAffinity;
  visibleReasoningDetailTypes: string[];
  requiresNonEmptyUserOrAssistantMessage: boolean;
  configuredSupportsLongCacheRetention?: boolean;
};
/** Native OpenAI defaults never apply to a configured proxy endpoint. */
declare function isNativeOpenAIEndpoint(model: {
  provider?: string;
  baseUrl?: string;
}): boolean;
declare function isOpenAICodexResponsesModel(model: {
  provider?: string;
  api?: string;
  baseUrl?: string;
}): boolean;
declare function usesNativeOpenAICodexResponsesBackend(model: {
  provider?: string;
  api?: string;
  baseUrl?: string;
}): boolean;
declare function resolveOpenAIPromptCacheKeySupport(model: {
  api?: string;
  provider?: string;
  baseUrl?: string;
  compat?: Pick<OpenAICompletionsCompat, "supportsPromptCacheKey" | "supportsLongCacheRetention"> | null;
}): boolean;
/** Detects endpoint capabilities and defaults for an OpenAI-completions model. */
declare function detectOpenAICompletionsCompat(model: Pick<Model<"openai-completions">, "provider" | "baseUrl" | "id"> & {
  compat?: {
    supportsStore?: boolean;
  } | null;
}, resolveCapabilities?: (input: AiProviderRequestPolicyInput) => ProviderRequestCapabilities): DetectedOpenAICompletionsCompat;
/** Applies explicit model overrides once on top of the canonical transport defaults. */
declare function resolveOpenAICompletionsCompat(model: Pick<Model<"openai-completions">, "id" | "provider" | "baseUrl" | "compat">, resolveCapabilities?: (input: AiProviderRequestPolicyInput) => ProviderRequestCapabilities): ResolvedOpenAICompletionsCompat;
//#endregion
export { resolveOpenAICompletionsCompat as a, isOpenAICodexResponsesModel as i, detectOpenAICompletionsCompat as n, resolveOpenAIPromptCacheKeySupport as o, isNativeOpenAIEndpoint as r, usesNativeOpenAICodexResponsesBackend as s, ResolvedOpenAICompletionsCompat as t };