import type { OpenClawConfig } from "../config/types.openclaw.js";
type ConfigModelEntry = {
    id?: string;
    contextWindow?: number;
    contextTokens?: number;
};
type ProviderConfigEntry = {
    contextWindow?: number;
    contextTokens?: number;
    models?: ConfigModelEntry[];
};
export type ModelsConfig = {
    providers?: Record<string, ProviderConfigEntry | undefined>;
};
export type ContextTokenResolutionParams = {
    cfg?: OpenClawConfig;
    sourceCfg?: OpenClawConfig | null;
    provider?: string;
    model?: string;
    contextTokensOverride?: number;
    fallbackContextTokens?: number;
    modelContextWindow?: number;
    modelContextTokens?: number;
    allowAsyncLoad?: boolean;
};
export declare const ANTHROPIC_CONTEXT_1M_TOKENS = 1048576;
export declare const ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS = 1000000;
export declare const ANTHROPIC_FABLE_CONTEXT_TOKENS = 1000000;
export declare function resolveAnthropicFixedContextWindow(provider: string, model: string): number | undefined;
export declare function resolveContextTokensForModelFromCache(params: ContextTokenResolutionParams, lookupContextTokens?: (modelId?: string) => number | undefined, lookupContextWindow?: (modelId?: string) => number | undefined): number | undefined;
export {};
