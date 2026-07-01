import type { AgentModelEntryConfig } from "../config/types.agent-defaults.js";
import type { ModelApi, ModelDefinitionConfig, ModelProviderConfig } from "../config/types.models.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
export type { OpenClawConfig, ModelApi, ModelDefinitionConfig, ModelProviderConfig };
export { resolveAgentModelFallbackValues, resolveAgentModelPrimaryValue, } from "../config/model-input.js";
/** Alias registration accepted by provider onboarding presets. */
export type AgentModelAliasEntry = string | {
    modelRef: string;
    alias?: string;
};
/** Current OpenCode Zen default model ref used by onboarding and repair flows. */
export declare const OPENCODE_ZEN_DEFAULT_MODEL = "opencode/claude-opus-4-6";
/** Pair of preset appliers exposed by provider setup modules. */
export type ProviderOnboardPresetAppliers<TArgs extends unknown[]> = {
    applyProviderConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
    applyConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
};
/** Merge provider alias entries into the agent default model map without clobbering existing aliases. */
export declare function withAgentModelAliases(existing: Record<string, AgentModelEntryConfig> | undefined, aliases: readonly AgentModelAliasEntry[]): Record<string, AgentModelEntryConfig>;
/** Write onboarding-auth model aliases and provider configs into the canonical config sections. */
export declare function applyOnboardAuthAgentModelsAndProviders(cfg: OpenClawConfig, params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providers: Record<string, ModelProviderConfig>;
}): OpenClawConfig;
/** Set the agent default primary model while preserving normalized fallbacks and provider models. */
export declare function applyAgentDefaultModelPrimary(cfg: OpenClawConfig, primary: string): OpenClawConfig;
/** Move configs without a primary default onto the current OpenCode Zen model. */
export declare function applyOpencodeZenModelDefault(cfg: OpenClawConfig): {
    next: OpenClawConfig;
    changed: boolean;
};
/** Merge a provider config and seed required default models when the provider has no matching model yet. */
export declare function applyProviderConfigWithDefaultModels(cfg: OpenClawConfig, params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModels: ModelDefinitionConfig[];
    defaultModelId?: string;
}): OpenClawConfig;
/** Single-model wrapper around `applyProviderConfigWithDefaultModels`. */
export declare function applyProviderConfigWithDefaultModel(cfg: OpenClawConfig, params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModel: ModelDefinitionConfig;
    defaultModelId?: string;
}): OpenClawConfig;
/** Apply a single-model provider preset and set the primary model only when the user has none. */
export declare function applyProviderConfigWithDefaultModelPreset(cfg: OpenClawConfig, params: {
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModel: ModelDefinitionConfig;
    defaultModelId?: string;
    aliases?: readonly AgentModelAliasEntry[];
    primaryModelRef?: string;
}): OpenClawConfig;
/** Build setup appliers for presets that resolve to one default provider model. */
export declare function createDefaultModelPresetAppliers<TArgs extends unknown[]>(params: {
    resolveParams: (cfg: OpenClawConfig, ...args: TArgs) => Omit<Parameters<typeof applyProviderConfigWithDefaultModelPreset>[1], "primaryModelRef"> | null | undefined;
    primaryModelRef: string;
}): ProviderOnboardPresetAppliers<TArgs>;
/** Apply a multi-model provider preset and set the primary model only when the user has none. */
export declare function applyProviderConfigWithDefaultModelsPreset(cfg: OpenClawConfig, params: {
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModels: ModelDefinitionConfig[];
    defaultModelId?: string;
    aliases?: readonly AgentModelAliasEntry[];
    primaryModelRef?: string;
}): OpenClawConfig;
/** Build setup appliers for presets that resolve to multiple default provider models. */
export declare function createDefaultModelsPresetAppliers<TArgs extends unknown[]>(params: {
    resolveParams: (cfg: OpenClawConfig, ...args: TArgs) => Omit<Parameters<typeof applyProviderConfigWithDefaultModelsPreset>[1], "primaryModelRef"> | null | undefined;
    primaryModelRef: string;
}): ProviderOnboardPresetAppliers<TArgs>;
/** Merge a provider config with a catalog while preserving existing model entries first. */
export declare function applyProviderConfigWithModelCatalog(cfg: OpenClawConfig, params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    catalogModels: ModelDefinitionConfig[];
}): OpenClawConfig;
/** Apply a catalog-backed provider preset and set the primary model only when the user has none. */
export declare function applyProviderConfigWithModelCatalogPreset(cfg: OpenClawConfig, params: {
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    catalogModels: ModelDefinitionConfig[];
    aliases?: readonly AgentModelAliasEntry[];
    primaryModelRef?: string;
}): OpenClawConfig;
/** Build setup appliers for presets that resolve to a provider model catalog. */
export declare function createModelCatalogPresetAppliers<TArgs extends unknown[]>(params: {
    resolveParams: (cfg: OpenClawConfig, ...args: TArgs) => Omit<Parameters<typeof applyProviderConfigWithModelCatalogPreset>[1], "primaryModelRef"> | null | undefined;
    primaryModelRef: string;
}): ProviderOnboardPresetAppliers<TArgs>;
/** Ensure static model allowlists include a provider model ref after onboarding. */
export declare function ensureModelAllowlistEntry(params: {
    cfg: OpenClawConfig;
    modelRef: string;
    defaultProvider?: string;
}): OpenClawConfig;
