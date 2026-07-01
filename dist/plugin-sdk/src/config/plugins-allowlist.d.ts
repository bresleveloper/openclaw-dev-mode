type PluginAllowlistConfigCarrier = {
    plugins?: {
        allow?: string[];
    };
};
/** Return a config copy with `pluginId` appended to an existing restrictive plugin allowlist. */
export declare function ensurePluginAllowlisted<T extends PluginAllowlistConfigCarrier>(cfg: T, pluginId: string): T;
export {};
