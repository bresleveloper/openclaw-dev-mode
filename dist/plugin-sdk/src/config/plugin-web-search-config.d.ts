type PluginWebSearchConfigCarrier = {
    plugins?: {
        entries?: Record<string, {
            config?: unknown;
        }>;
    };
};
/** Resolve a plugin-owned `config.webSearch` object without interpreting provider fields. */
export declare function resolvePluginWebSearchConfig(config: PluginWebSearchConfigCarrier | undefined, pluginId: string): Record<string, unknown> | undefined;
export {};
