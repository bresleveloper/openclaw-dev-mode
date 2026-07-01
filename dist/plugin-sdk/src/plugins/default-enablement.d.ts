/** Manifest fields that control default plugin enablement. */
export type PluginDefaultEnablement = {
    enabledByDefault?: boolean;
    enabledByDefaultOnPlatforms?: readonly string[];
};
/** True when a plugin should be enabled by default for a platform. */
export declare function isPluginEnabledByDefaultForPlatform(plugin: PluginDefaultEnablement, platform?: NodeJS.Platform): boolean;
