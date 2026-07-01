import { DEFAULT_MODEL, DEFAULT_PROVIDER } from "../../agents/defaults.js";
import { modelKey } from "../../agents/model-selection.js";
import { type OpenClawConfig } from "../../config/config.js";
import type { AgentModelEntryConfig } from "../../config/types.agent-defaults.js";
export declare const ensureFlagCompatibility: (opts: {
    json?: boolean;
    plain?: boolean;
}) => void;
/** Formats token counts as compact K-suffixed labels. */
export declare const formatTokenK: (value?: number | null) => string;
/** Formats millisecond durations for model command output. */
export declare const formatMs: (value?: number | null) => string;
/** Loads config from disk and throws a formatted error when validation fails. */
export declare function loadValidConfigOrThrow(): Promise<OpenClawConfig>;
/** Runtime config snapshot supplied to model config mutators. */
export type UpdateConfigContext = {
    runtimeConfig: OpenClawConfig;
};
/** Reads source config, applies a mutator, and writes only the source-form config. */
export declare function updateConfig(mutator: (cfg: OpenClawConfig, context: UpdateConfigContext) => OpenClawConfig): Promise<OpenClawConfig>;
/** Resolves a CLI model reference through aliases and catalog provider aliases. */
export declare function resolveModelTarget(params: {
    raw: string;
    cfg: OpenClawConfig;
}): {
    provider: string;
    model: string;
};
/** Resolves model reference strings to canonical provider/model keys. */
export declare function resolveModelKeysFromEntries(params: {
    cfg: OpenClawConfig;
    entries: readonly string[];
}): string[];
/** Validates an optional agent id against configured agents. */
export declare function resolveKnownAgentId(params: {
    cfg: OpenClawConfig;
    rawAgentId?: string | null;
}): string | undefined;
/** Resolves the selected model-command agent and its profile directory. */
export declare function resolveModelsTargetAgent(cfg: OpenClawConfig, rawAgentId?: string): {
    agentId: string;
    agentDir: string;
};
/** Normalized primary/fallback config shape used by text and image defaults. */
export type PrimaryFallbackConfig = {
    primary?: string;
    fallbacks?: string[];
};
/** Upserts the canonical model entry and folds legacy key metadata into it. */
export declare function upsertCanonicalModelConfigEntry(models: Record<string, AgentModelEntryConfig>, params: {
    provider: string;
    model: string;
}): string;
/** Merges primary/fallback patches while normalizing refs for config storage. */
export declare function mergePrimaryFallbackConfig(existing: PrimaryFallbackConfig | undefined, patch: {
    primary?: string;
    fallbacks?: string[];
}): PrimaryFallbackConfig;
/** Applies a default text/image primary-model update and ensures the model entry exists. */
export declare function applyDefaultModelPrimaryUpdate(params: {
    cfg: OpenClawConfig;
    resolveCfg?: OpenClawConfig;
    modelRaw: string;
    field: "model" | "imageModel";
}): OpenClawConfig;
export { modelKey };
export { DEFAULT_MODEL, DEFAULT_PROVIDER };
/**
 * Model key format: "provider/model"
 *
 * The model key is displayed in `/model status` and used to reference models.
 * When using `/model <key>`, use the exact format shown (e.g., "openrouter/moonshotai/kimi-k2").
 *
 * For providers with hierarchical model IDs (e.g., OpenRouter), the model ID may include
 * sub-providers (e.g., "moonshotai/kimi-k2"), resulting in a key like "openrouter/moonshotai/kimi-k2".
 */
