import type { ProviderDefaultThinkingPolicyContext, ProviderThinkingProfile, ProviderThinkingPolicyContext } from "./provider-thinking.types.js";
type ThinkingHookParams<TContext> = {
    provider: string;
    context: TContext;
};
/** Resolves whether a provider treats thinking as binary on/off. */
export declare function resolveProviderBinaryThinking(params: ThinkingHookParams<ProviderThinkingPolicyContext>): boolean | undefined;
/** Resolves whether a provider supports xhigh thinking. */
export declare function resolveProviderXHighThinking(params: ThinkingHookParams<ProviderThinkingPolicyContext>): boolean | undefined;
/** Resolves a provider thinking profile from active plugins or bundled policy surface. */
export declare function resolveProviderThinkingProfile(params: ThinkingHookParams<ProviderDefaultThinkingPolicyContext>): ProviderThinkingProfile | null | undefined;
/** Resolves the provider default thinking level from the active plugin registry. */
export declare function resolveProviderDefaultThinkingLevel(params: ThinkingHookParams<ProviderDefaultThinkingPolicyContext>): "adaptive" | "high" | "low" | "medium" | "minimal" | "off" | "xhigh" | null | undefined;
export {};
