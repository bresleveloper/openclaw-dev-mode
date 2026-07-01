import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ContextTokenResolutionParams, type ModelsConfig } from "./context-resolution.js";
export { ANTHROPIC_CONTEXT_1M_TOKENS, ANTHROPIC_FABLE_CONTEXT_TOKENS, ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS, } from "./context-resolution.js";
export { resetContextWindowCacheForTest } from "./context-runtime-state.js";
type ModelEntry = {
    id: string;
    provider?: string;
    contextWindow?: number;
    contextTokens?: number;
};
export declare function applyDiscoveredContextWindows(params: {
    cache: Map<string, number>;
    models: ModelEntry[];
}): void;
export declare function applyConfiguredContextWindows(params: {
    cache: Map<string, number>;
    windowCache: Map<string, number>;
    modelsConfig: ModelsConfig | undefined;
}): void;
export declare function ensureContextWindowCacheLoaded(): Promise<void>;
/** Replace cached model context metadata for the active runtime configuration. */
export declare function refreshContextWindowCache(cfg: OpenClawConfig): Promise<void>;
export declare function lookupContextTokens(modelId?: string, options?: {
    allowAsyncLoad?: boolean;
    skipRuntimeConfigLoad?: boolean;
}): number | undefined;
export declare function resolveContextTokensForModel(params: ContextTokenResolutionParams): number | undefined;
