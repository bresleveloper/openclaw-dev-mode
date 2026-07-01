import type { ProviderPlugin } from "../plugins/types.js";
export { applyAnthropicEphemeralCacheControlMarkers, applyAnthropicPayloadPolicyToParams, composeProviderStreamWrappers, createAnthropicThinkingPrefillPayloadWrapper, createMoonshotThinkingWrapper, createPlainTextToolCallCompatWrapper, createToolStreamWrapper, createZaiToolStreamWrapper, defaultToolStreamExtraParams, isOpenAICompatibleThinkingEnabled, type ProviderStreamWrapperFactory, resolveAnthropicPayloadPolicy, resolveMoonshotThinkingType, streamWithPayloadPatch, stripTrailingAnthropicAssistantPrefillWhenThinking, } from "./provider-stream-shared.js";
/** Named stream-wrapper bundles that provider plugins can opt into without duplicating policy. */
export type ProviderStreamFamily = 
/** Applies Google thinking-level payload normalization. */
"google-thinking"
/** Applies Kilocode proxy reasoning payload normalization. */
 | "kilocode-thinking"
/** Applies Moonshot thinking type/keep normalization. */
 | "moonshot-thinking"
/** Enables MiniMax high-speed model routing when requested. */
 | "minimax-fast-mode"
/** Applies the default OpenAI Responses wrapper stack. */
 | "openai-responses-defaults"
/** Applies OpenRouter proxy reasoning payload normalization. */
 | "openrouter-thinking"
/** Enables tool-call event streaming unless explicitly disabled. */
 | "tool-stream-default-on";
type ProviderStreamFamilyHooks = Pick<ProviderPlugin, "wrapStreamFn">;
/** Builds provider hook objects for one supported stream-wrapper family. */
export declare function buildProviderStreamFamilyHooks(
/**
 * Family key selecting the exact wrapper bundle to attach to a provider.
 */
family: ProviderStreamFamily): ProviderStreamFamilyHooks;
/** @deprecated Google provider-owned stream hook shortcut; use local provider hooks instead. */
export declare const GOOGLE_THINKING_STREAM_HOOKS: ProviderStreamFamilyHooks;
/** @deprecated Kilocode provider-owned stream hook shortcut; use local provider hooks instead. */
export declare const KILOCODE_THINKING_STREAM_HOOKS: ProviderStreamFamilyHooks;
/** @deprecated Moonshot provider-owned stream hook shortcut; use local provider hooks instead. */
export declare const MOONSHOT_THINKING_STREAM_HOOKS: ProviderStreamFamilyHooks;
/** @deprecated MiniMax provider-owned stream hook shortcut; use local provider hooks instead. */
export declare const MINIMAX_FAST_MODE_STREAM_HOOKS: ProviderStreamFamilyHooks;
/** @deprecated OpenAI provider-owned stream hook shortcut; use local provider hooks instead. */
export declare const OPENAI_RESPONSES_STREAM_HOOKS: ProviderStreamFamilyHooks;
/** @deprecated OpenRouter provider-owned stream hook shortcut; use local provider hooks instead. */
export declare const OPENROUTER_THINKING_STREAM_HOOKS: ProviderStreamFamilyHooks;
/** @deprecated Provider-owned stream hook shortcut; use local provider hooks instead. */
export declare const TOOL_STREAM_DEFAULT_ON_HOOKS: ProviderStreamFamilyHooks;
export { createAnthropicToolPayloadCompatibilityWrapper, createOpenAIAnthropicToolPayloadCompatibilityWrapper, } from "../llm/providers/stream-wrappers/anthropic-family-tool-payload-compat.js";
export { createGoogleThinkingPayloadWrapper, sanitizeGoogleThinkingPayload, } from "../llm/providers/stream-wrappers/google.js";
export { createKilocodeWrapper, createOpenRouterSystemCacheWrapper, createOpenRouterWrapper, isProxyReasoningUnsupported, } from "../llm/providers/stream-wrappers/proxy.js";
export { createMinimaxFastModeWrapper } from "../llm/providers/stream-wrappers/minimax.js";
export { createOpenAIAttributionHeadersWrapper, createCodexNativeWebSearchWrapper, createOpenAIDefaultTransportWrapper, createOpenAIFastModeWrapper, createOpenAIReasoningCompatibilityWrapper, createOpenAIResponsesContextManagementWrapper, createOpenAIServiceTierWrapper, createOpenAITextVerbosityWrapper, resolveOpenAIFastMode, resolveOpenAIServiceTier, resolveOpenAITextVerbosity, } from "../llm/providers/stream-wrappers/openai.js";
export { getOpenRouterModelCapabilities, loadOpenRouterModelCapabilities, } from "../agents/embedded-agent-runner/openrouter-model-capabilities.js";
