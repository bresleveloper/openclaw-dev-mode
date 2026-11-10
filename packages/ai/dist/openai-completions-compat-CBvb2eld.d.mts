import "./index-DSprYWaz.mjs";
import { N as OpenAICompletionsCompat, k as Model } from "./types-CVYzKrMl.mjs";
import { a as AiProviderRequestPolicyInput, i as AiProviderRequestCapabilities } from "./host-jJOffdlW.mjs";
//#region packages/ai/src/transports/openai-completions-compat.d.ts
type OpenAICompletionsSessionAffinity = "none" | "openai" | "openrouter";
type OpenAICompletionsCompatDefaults = {
  supportsStore: boolean;
  supportsDeveloperRole: boolean;
  supportsReasoningEffort: boolean;
  supportsUsageInStreaming: boolean;
  maxTokensField: "max_completion_tokens" | "max_tokens";
  thinkingFormat: "openai" | "openrouter" | "deepseek" | "together" | "zai";
  emitsDsmlToolCalls: boolean;
  visibleReasoningDetailTypes: string[];
  supportsStrictMode: boolean;
  requiresTypedUnionBranches: boolean;
  supportsJsonSchemaResponseFormat: boolean;
  requiresReasoningContentOnAssistantMessages: boolean;
  requiresNonEmptyUserOrAssistantMessage: boolean;
  cacheControlFormat?: OpenAICompletionsCompat["cacheControlFormat"];
  sessionAffinityFormat: Exclude<OpenAICompletionsSessionAffinity, "none">;
  supportsLongCacheRetention: boolean;
};
type ResolvedOpenAICompletionsCompat = Omit<Required<OpenAICompletionsCompat>, "cacheControlFormat" | "openRouterRouting" | "sendSessionAffinityHeaders" | "reasoningEffortMap" | "supportedReasoningEfforts"> & Pick<OpenAICompletionsCompat, "reasoningEffortMap" | "supportedReasoningEfforts"> & {
  cacheControlFormat?: OpenAICompletionsCompat["cacheControlFormat"];
  openRouterRouting?: OpenAICompletionsCompat["openRouterRouting"];
  sessionAffinity: OpenAICompletionsSessionAffinity;
  visibleReasoningDetailTypes: string[];
  emitsDsmlToolCalls: boolean;
  requiresNonEmptyUserOrAssistantMessage: boolean;
  requiresTypedUnionBranches: boolean;
  configuredSupportsLongCacheRetention?: boolean;
  reasoningEffortForOff: "none" | null;
  thinkingOffControlUndeclared: boolean;
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
declare function detectOpenAICompletionsCompat(model: Pick<Model<"openai-completions">, "provider" | "baseUrl" | "id" | "reasoning"> & {
  compat?: {
    supportsStore?: boolean;
  } | null;
}, resolveCapabilities?: (input: AiProviderRequestPolicyInput) => AiProviderRequestCapabilities): {
  capabilities: AiProviderRequestCapabilities;
  defaults: OpenAICompletionsCompatDefaults;
};
/** Applies explicit model overrides once on top of the canonical transport defaults. */
declare function resolveOpenAICompletionsCompat(model: Pick<Model<"openai-completions">, "id" | "provider" | "baseUrl" | "compat" | "reasoning">, resolveCapabilities?: (input: AiProviderRequestPolicyInput) => AiProviderRequestCapabilities): ResolvedOpenAICompletionsCompat;
//#endregion
export { resolveOpenAICompletionsCompat as a, isOpenAICodexResponsesModel as i, detectOpenAICompletionsCompat as n, resolveOpenAIPromptCacheKeySupport as o, isNativeOpenAIEndpoint as r, usesNativeOpenAICodexResponsesBackend as s, ResolvedOpenAICompletionsCompat as t };