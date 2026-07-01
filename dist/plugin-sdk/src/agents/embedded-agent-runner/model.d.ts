import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ModelRegistry as CoreModelRegistry } from "../../llm/model-registry.js";
import type { Model } from "../../llm/types.js";
import { applyProviderResolvedTransportWithPlugin, buildProviderUnknownModelHintWithPlugin, normalizeProviderTransportWithPlugin, prepareProviderDynamicModel, runProviderDynamicModel, normalizeProviderResolvedModelWithPlugin, shouldPreferProviderRuntimeResolvedModel } from "../../plugins/provider-runtime.js";
import { type AuthStorage, type ModelRegistry } from "../sessions/index.js";
type ProviderRuntimeHooks = {
    applyProviderResolvedTransportWithPlugin?: (params: Parameters<typeof applyProviderResolvedTransportWithPlugin>[0]) => unknown;
    buildProviderUnknownModelHintWithPlugin: (params: Parameters<typeof buildProviderUnknownModelHintWithPlugin>[0]) => string | undefined;
    prepareProviderDynamicModel: (params: Parameters<typeof prepareProviderDynamicModel>[0]) => Promise<void>;
    runProviderDynamicModel: (params: Parameters<typeof runProviderDynamicModel>[0]) => unknown;
    shouldPreferProviderRuntimeResolvedModel?: (params: Parameters<typeof shouldPreferProviderRuntimeResolvedModel>[0]) => boolean;
    normalizeProviderResolvedModelWithPlugin: (params: Parameters<typeof normalizeProviderResolvedModelWithPlugin>[0]) => unknown;
    normalizeProviderTransportWithPlugin: typeof normalizeProviderTransportWithPlugin;
};
export declare function resolveModelWithRegistry(params: {
    provider: string;
    modelId: string;
    modelRegistry: CoreModelRegistry;
    cfg?: OpenClawConfig;
    agentDir?: string;
    workspaceDir?: string;
    authProfileId?: string;
    preferredProfile?: string;
    runtimeHooks?: ProviderRuntimeHooks;
    skipConfiguredFallback?: boolean;
}): Model | undefined;
export declare function resolveModel(provider: string, modelId: string, agentDir?: string, cfg?: OpenClawConfig, options?: {
    authStorage?: AuthStorage;
    modelRegistry?: ModelRegistry;
    runtimeHooks?: ProviderRuntimeHooks;
    skipProviderRuntimeHooks?: boolean;
    workspaceDir?: string;
    authProfileId?: string;
    preferredProfile?: string;
}): {
    model?: Model;
    error?: string;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry;
};
export declare function resolveModelAsync(provider: string, modelId: string, agentDir?: string, cfg?: OpenClawConfig, options?: {
    authStorage?: AuthStorage;
    modelRegistry?: ModelRegistry;
    allowBundledStaticCatalogFallback?: boolean;
    preferBundledStaticCatalogTransport?: boolean;
    retryTransientProviderRuntimeMiss?: boolean;
    runtimeHooks?: ProviderRuntimeHooks;
    skipProviderRuntimeHooks?: boolean;
    skipAgentDiscovery?: boolean;
    workspaceDir?: string;
    authProfileId?: string;
    preferredProfile?: string;
}): Promise<{
    model?: Model;
    error?: string;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry;
}>;
export {};
