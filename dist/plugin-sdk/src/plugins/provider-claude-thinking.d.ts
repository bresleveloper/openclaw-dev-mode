import type { ProviderThinkingProfile } from "./provider-thinking.types.js";
/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
export declare function isClaudeAdaptiveThinkingDefaultModelId(
/** Claude model id to check against adaptive-thinking default families. */
modelId: string): boolean;
/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
export declare function resolveClaudeThinkingProfile(
/** Claude model id used to choose available thinking levels and defaults. */
modelId: string, params?: Record<string, unknown>, options?: {
    includeNativeMax?: boolean;
}): ProviderThinkingProfile;
