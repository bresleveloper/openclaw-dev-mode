import { P as OpenAICompletionsCompat, k as Model } from "./types-B1ZIh9Ch.mjs";
import "./index-94l3uJ39.mjs";
import { a as AiProviderRequestPolicyInput, i as AiProviderRequestCapabilities } from "./host-CNOUExXM.mjs";
type OpenAICompletionsSessionAffinity = "none" | "openai" | "openrouter";
/** Mistral's Chat Completions API names the sampling seed `random_seed`. */
type OpenAICompletionsSeedField = "seed" | "random_seed";
type OpenAICompletionsCompatDefaults = {
  supportsStore: boolean;
  supportsDeveloperRole: boolean;
  supportsReasoningEffort: boolean;
  supportsUsageInStreaming: boolean;
  maxTokensField: "max_completion_tokens" | "max_tokens";
  seedField: OpenAICompletionsSeedField;
  thinkingFormat: "openai" | "openrouter" | "deepseek" | "together" | "zai";
  emitsDsmlToolCalls: boolean;
  visibleReasoningDetailTypes: string[];
  supportsStrictMode: boolean;
  requiresTypedUnionBranches: boolean;
  supportsJsonSchemaResponseFormat: boolean;
  requiresReasoningContentOnAssistantMessages: boolean;
  requiresNonEmptyUserOrAssistantMessage: boolean;
  cacheControlFormat?: OpenAICompletionsCompat["cacheControlFormat"];
  cacheControlSystemOnly: boolean;
  cacheControlSharedSystem: boolean;
  sessionAffinityFormat: Exclude<OpenAICompletionsSessionAffinity, "none">;
  supportsLongCacheRetention: boolean;
};
type ResolvedOpenAICompletionsCompat = Omit<Required<OpenAICompletionsCompat>, "cacheControlFormat" | "openRouterRouting" | "sendSessionAffinityHeaders" | "reasoningEffortMap" | "supportedReasoningEfforts"> & Pick<OpenAICompletionsCompat, "reasoningEffortMap" | "supportedReasoningEfforts"> & {
  cacheControlFormat?: OpenAICompletionsCompat["cacheControlFormat"];
  cacheControlSystemOnly: boolean;
  cacheControlSharedSystem: boolean;
  openRouterRouting?: OpenAICompletionsCompat["openRouterRouting"];
  sessionAffinity: OpenAICompletionsSessionAffinity;
  visibleReasoningDetailTypes: string[];
  emitsDsmlToolCalls: boolean;
  requiresNonEmptyUserOrAssistantMessage: boolean;
  requiresTypedUnionBranches: boolean;
  configuredSupportsLongCacheRetention?: boolean;
  thinkingOffControlUndeclared: boolean;
  /** Absent means `seed`. */
  seedField?: OpenAICompletionsSeedField;
};
/** Native OpenAI defaults never apply to a configured proxy endpoint. */
declare function isNativeOpenAIEndpoint(model: {
  provider?: string;
  baseUrl?: string;
}): boolean;
/** Model-name defaults apply only on a known OpenAI endpoint. */
declare function isKnownOpenAIEndpoint(model: {
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
declare function detectOpenAICompletionsCompat(model: Pick<Model<"openai-completions">, "provider" | "baseUrl" | "id" | "reasoning"> & {
  compat?: AiProviderRequestPolicyInput["compat"];
}, resolveCapabilities?: (input: AiProviderRequestPolicyInput) => AiProviderRequestCapabilities): {
  capabilities: AiProviderRequestCapabilities;
  defaults: OpenAICompletionsCompatDefaults;
};
/** Applies explicit model overrides once on top of the canonical transport defaults. */
declare function resolveOpenAICompletionsCompat(model: Pick<Model<"openai-completions">, "id" | "provider" | "baseUrl" | "compat" | "reasoning" | "thinkingLevelMap">, resolveCapabilities?: (input: AiProviderRequestPolicyInput) => AiProviderRequestCapabilities): ResolvedOpenAICompletionsCompat;
export { isOpenAICodexResponsesModel as a, usesNativeOpenAICodexResponsesBackend as c, isNativeOpenAIEndpoint as i, detectOpenAICompletionsCompat as n, resolveOpenAICompletionsCompat as o, isKnownOpenAIEndpoint as r, resolveOpenAIPromptCacheKeySupport as s, ResolvedOpenAICompletionsCompat as t };