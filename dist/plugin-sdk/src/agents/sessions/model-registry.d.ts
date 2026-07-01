/**
 * Model registry - manages configured/provider-owned models and API key resolution.
 */
import { type Static, Type } from "typebox";
import type { Api, AssistantMessageEventStreamContract, Context, Model, SimpleStreamOptions } from "../../llm/types.js";
import type { OAuthProviderInterface } from "../../llm/utils/oauth/types.js";
import { type PluginModelCatalogMetadataSnapshot } from "../plugin-model-catalog.js";
import type { AuthStatus, AuthStorage } from "./auth-storage.js";
import { clearConfigValueCache } from "./resolve-config-value.js";
declare const ProviderAuthModeSchema: Type.TUnion<[Type.TLiteral<"api-key">, Type.TLiteral<"aws-sdk">, Type.TLiteral<"oauth">, Type.TLiteral<"token">]>;
type ProviderAuthMode = Static<typeof ProviderAuthModeSchema>;
export type ResolvedRequestAuth = {
    ok: true;
    apiKey?: string;
    headers?: Record<string, string>;
} | {
    ok: false;
    error: string;
};
type ModelRegistryOptions = {
    pluginMetadataSnapshot?: PluginModelCatalogMetadataSnapshot;
    workspaceDir?: string;
};
/** Clear the config value command cache. Exported for testing. */
export declare const clearApiKeyCache: typeof clearConfigValueCache;
/**
 * Model registry - loads and manages models, resolves API keys via AuthStorage.
 */
export declare class ModelRegistry {
    private models;
    private providerRequestConfigs;
    private modelRequestHeaders;
    private registeredProviders;
    private loadError;
    readonly authStorage: AuthStorage;
    private modelsJsonPath;
    private pluginMetadataSnapshot;
    private constructor();
    static create(authStorage: AuthStorage, modelsJsonPath?: string, options?: ModelRegistryOptions): ModelRegistry;
    static inMemory(authStorage: AuthStorage): ModelRegistry;
    /**
     * Reload models from disk (models.json).
     */
    refresh(): void;
    /** Get any root or generated plugin catalog load error. */
    getError(): string | undefined;
    private loadModels;
    private loadCustomModels;
    private validateConfig;
    private parseModels;
    /**
     * Get all configured models.
     */
    getAll(): Model[];
    /**
     * Get only models that have auth configured.
     * This is a fast check that doesn't refresh OAuth tokens.
     */
    getAvailable(): Model[];
    /**
     * Find a model by provider and ID.
     */
    find(provider: string, modelId: string): Model | undefined;
    /**
     * Get API key for a model.
     */
    hasConfiguredAuth(model: Model): boolean;
    private getModelRequestKey;
    private storeProviderRequestConfig;
    private storeModelHeaders;
    /**
     * Get API key and request headers for a model.
     */
    getApiKeyAndHeaders(model: Model): Promise<ResolvedRequestAuth>;
    /**
     * Return auth status for a provider, including request auth configured in models.json.
     * This intentionally does not execute command-backed config values.
     */
    getProviderAuthStatus(provider: string): AuthStatus;
    /**
     * Get display name for a provider.
     */
    getProviderDisplayName(provider: string): string;
    /**
     * Get API key for a provider.
     */
    getApiKeyForProvider(provider: string): Promise<string | undefined>;
    /**
     * Check if a model is using OAuth credentials (subscription).
     */
    isUsingOAuth(model: Model): boolean;
    /**
     * Register a provider dynamically (from extensions).
     *
     * If provider has models: replaces all existing models for this provider.
     * Provider-level request settings are stored for already-known models but
     * never create implicit model rows.
     * If provider has oauth: registers OAuth provider for /login support.
     */
    registerProvider(providerName: string, config: ProviderConfigInput): void;
    /**
     * Unregister a previously registered provider.
     *
     * Removes the provider from the registry and reloads models from disk.
     * Also resets dynamic OAuth and API stream registrations before reapplying
     * remaining dynamic providers.
     * Has no effect if the provider was never registered.
     */
    unregisterProvider(providerName: string): void;
    /**
     * Upsert a provider config into registeredProviders.
     * If the provider is already registered, defined values in the incoming config
     * override existing ones; undefined values are preserved from the stored config.
     * If the provider is not registered, the incoming config is stored as-is.
     */
    private upsertRegisteredProvider;
    private validateProviderConfig;
    private applyProviderConfig;
}
/**
 * Input type for registerProvider API.
 */
export interface ProviderConfigInput {
    name?: string;
    baseUrl?: string;
    apiKey?: string;
    auth?: ProviderAuthMode;
    api?: Api;
    streamSimple?: (model: Model, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamContract;
    headers?: Record<string, string>;
    authHeader?: boolean;
    /** OAuth provider for /login support */
    oauth?: Omit<OAuthProviderInterface, "id">;
    models?: Array<{
        id: string;
        name: string;
        api?: Api;
        baseUrl?: string;
        reasoning: boolean;
        thinkingLevelMap?: Model["thinkingLevelMap"];
        input: ("text" | "image")[];
        cost: {
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
        };
        contextWindow: number;
        maxTokens: number;
        params?: Record<string, unknown>;
        headers?: Record<string, string>;
        compat?: Model["compat"];
    }>;
}
export {};
