import { buildAnthropicReplayPolicyForModel, buildGoogleGeminiReplayPolicy, buildHybridAnthropicOrOpenAIReplayPolicy, buildNativeAnthropicReplayPolicyForModel, buildOpenAICompatibleReplayPolicy, buildPassthroughGeminiSanitizingReplayPolicy, buildStrictAnthropicReplayPolicy, resolveTaggedReasoningOutputMode, sanitizeGoogleGeminiReplayHistory } from "../plugins/provider-replay-helpers.js";
import type { ProviderPlugin } from "../plugins/types.js";
export type { ModelApi, ModelProviderDeclarationConfig as ModelProviderConfig, } from "../config/types.models.js";
export { resolveClaudeFable5ModelIdentity, resolveClaudeModelIdentity, resolveClaudeNativeThinkingLevelMap, supportsClaudeAdaptiveThinking, supportsClaudeNativeMaxEffort, supportsClaudeNativeXhighEffort, } from "@openclaw/llm-core";
export type { UnifiedModelCatalogEntry, UnifiedModelCatalogKind, UnifiedModelCatalogSource, } from "@openclaw/model-catalog-core/model-catalog-types";
export type { BedrockDiscoveryConfig, ModelCompatConfig, ModelDefinitionConfig, } from "../config/types.models.js";
export type { ProviderEndpointClass, ProviderEndpointResolution, } from "../agents/provider-attribution.js";
export type { ProviderPlugin, UnifiedModelCatalogProviderContext, UnifiedModelCatalogProviderPlugin, } from "../plugins/types.js";
export { DEFAULT_CONTEXT_TOKENS } from "../agents/defaults.js";
export { GPT5_BEHAVIOR_CONTRACT, GPT5_FRIENDLY_CHAT_PROMPT_OVERLAY, GPT5_FRIENDLY_PROMPT_OVERLAY, GPT5_HEARTBEAT_PROMPT_OVERLAY, isGpt5ModelId, normalizeGpt5PromptOverlayMode, renderGpt5PromptOverlay, resolveGpt5PromptOverlayMode, resolveGpt5SystemPromptContribution, type Gpt5PromptOverlayMode, } from "../agents/gpt5-prompt-overlay.js";
export { resolveProviderEndpoint } from "../agents/provider-attribution.js";
export { applyModelCompatPatch, hasToolSchemaProfile, hasNativeWebSearchTool, normalizeModelCompat, resolveUnsupportedToolSchemaKeywords, resolveToolCallArgumentsEncoding, } from "../plugins/provider-model-compat.js";
export { buildAnthropicReplayPolicyForModel, buildGoogleGeminiReplayPolicy, buildHybridAnthropicOrOpenAIReplayPolicy, buildNativeAnthropicReplayPolicyForModel, buildOpenAICompatibleReplayPolicy, buildPassthroughGeminiSanitizingReplayPolicy, resolveTaggedReasoningOutputMode, sanitizeGoogleGeminiReplayHistory, buildStrictAnthropicReplayPolicy, };
/**
 * Normalizes provider ids for config, catalog, and plugin-registry matching.
 */
export declare function normalizeProviderId(
/** Provider id from config, catalog, or plugin metadata. */
provider: string): string;
export { createMoonshotThinkingWrapper, resolveMoonshotThinkingType, } from "../llm/providers/stream-wrappers/moonshot-thinking.js";
export { cloneFirstTemplateModel, matchesExactOrPrefix, } from "../plugins/provider-model-helpers.js";
export { isClaudeAdaptiveThinkingDefaultModelId, resolveClaudeThinkingProfile, } from "../plugins/provider-claude-thinking.js";
/** @deprecated Proxy provider-owned model helper; do not use from third-party plugins. */
export declare function isProxyReasoningUnsupportedModelHint(
/** Model id that may include a provider prefix such as `x-ai/model`. */
modelId: string): boolean;
/**
 * Normalizes Antigravity preview model ids to the canonical provider catalog form.
 */
export declare function normalizeAntigravityPreviewModelId(
/** Antigravity preview model id from config or catalog data. */
id: string): string;
/**
 * Normalizes Google preview model ids to the canonical provider catalog form.
 */
export declare function normalizeGooglePreviewModelId(
/** Google preview model id from config or catalog data. */
id: string): string;
/**
 * Shared replay-policy families reused by provider plugins with matching transcript semantics.
 */
export type ProviderReplayFamily = "openai-compatible" | "anthropic-by-model" | "native-anthropic-by-model" | "google-gemini" | "passthrough-gemini" | "hybrid-anthropic-openai";
type ProviderReplayFamilyHooks = Pick<ProviderPlugin, "buildReplayPolicy" | "sanitizeReplayHistory" | "resolveReasoningOutputMode">;
type BuildProviderReplayFamilyHooksOptions = {
    /** OpenAI-compatible transcript family using OpenAI-style tool calls. */
    family: "openai-compatible";
    /** Whether replay policy should rewrite tool call ids for provider compatibility. */
    sanitizeToolCallIds?: boolean;
    /** Optional output style for repeated tool call ids. */
    duplicateToolCallIdStyle?: "openai";
    /** Whether replay policy should strip reasoning blocks from history. */
    dropReasoningFromHistory?: boolean;
} | {
    /** Anthropic-style transcript policy selected by Claude model id. */
    family: "anthropic-by-model";
} | {
    /** Native Anthropic transcript policy preserving Anthropic ids/signatures. */
    family: "native-anthropic-by-model";
} | {
    /** Google Gemini transcript policy with Gemini replay sanitation hooks. */
    family: "google-gemini";
} | {
    /** OpenAI-compatible transport carrying Gemini-style thought signatures. */
    family: "passthrough-gemini";
} | {
    /** Family that switches between Anthropic and OpenAI-compatible replay by request context. */
    family: "hybrid-anthropic-openai";
    /** Whether Anthropic-model replay should drop thinking blocks in hybrid mode. */
    anthropicModelDropThinkingBlocks?: boolean;
};
/**
 * Builds provider replay hooks for a known transcript/reasoning compatibility family.
 */
export declare function buildProviderReplayFamilyHooks(options: BuildProviderReplayFamilyHooksOptions): ProviderReplayFamilyHooks;
/** @deprecated Provider-owned replay hook shortcut; use local provider hooks instead. */
export declare const OPENAI_COMPATIBLE_REPLAY_HOOKS: ProviderReplayFamilyHooks;
/** @deprecated Anthropic provider-owned replay hook shortcut; use local provider hooks instead. */
export declare const ANTHROPIC_BY_MODEL_REPLAY_HOOKS: ProviderReplayFamilyHooks;
/** @deprecated Anthropic provider-owned replay hook shortcut; use local provider hooks instead. */
export declare const NATIVE_ANTHROPIC_REPLAY_HOOKS: ProviderReplayFamilyHooks;
/** @deprecated Google provider-owned replay hook shortcut; use local provider hooks instead. */
export declare const PASSTHROUGH_GEMINI_REPLAY_HOOKS: ProviderReplayFamilyHooks;
