type ProviderPluginConfig = {
    /** Whether this plugin entry is enabled in the persisted plugin registry. */
    enabled?: boolean;
};
type ProviderEnableConfigCarrier = {
    plugins?: {
        /** Global plugin switch; false blocks provider setup from enabling entries. */
        enabled?: boolean;
        /** Plugin ids that provider setup must not enable. */
        deny?: string[];
        /** Plugin ids allowed to load after provider setup enables them. */
        allow?: string[];
        /** Per-plugin registry entries updated by provider setup flows. */
        entries?: Record<string, ProviderPluginConfig | undefined>;
    };
};
/** Result of enabling a provider plugin while honoring plugin allow/deny policy. */
export type PluginEnableResult<TConfig extends ProviderEnableConfigCarrier> = {
    /** Config object to persist after the enable attempt. Unchanged when policy blocks the plugin. */
    config: TConfig;
    /** Whether the plugin was enabled and allowlisted. */
    enabled: boolean;
    /** Human-readable policy reason when the plugin cannot be enabled. */
    reason?: string;
};
/**
 * Enables provider plugins for provider contract setup without applying channel
 * normalization from the core plugin enable path.
 */
export declare function enablePluginInConfig<TConfig extends ProviderEnableConfigCarrier>(
/** Provider setup config object to update without channel normalization. */
cfg: TConfig, 
/** Provider plugin id to enable and allowlist. */
pluginId: string): PluginEnableResult<TConfig>;
export {};
