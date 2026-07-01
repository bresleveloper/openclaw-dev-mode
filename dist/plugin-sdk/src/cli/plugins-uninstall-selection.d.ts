import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginRecord } from "../plugins/registry.js";
/** Resolve user input to the plugin id that should be removed from config/install records. */
export declare function resolvePluginUninstallId<TPlugin extends Pick<PluginRecord, "id" | "name">>(params: {
    rawId: string;
    config: OpenClawConfig;
    plugins: TPlugin[];
}): {
    pluginId: string;
    plugin?: TPlugin;
};
