import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import { type PluginSlotKey } from "../../../plugins/slots.js";
type StalePluginSurface = "allow" | "deny" | "entries" | "slot" | "channel" | "heartbeat" | "modelByChannel";
type StalePluginConfigHit = {
    pluginId: string;
    pathLabel: string;
    surface: StalePluginSurface;
    slotKey?: PluginSlotKey;
};
/** Return true when plugin discovery errors should pause stale-plugin auto-removal. */
export declare function isStalePluginAutoRepairBlocked(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): boolean;
/** Scan plugin/channel config surfaces for ids no longer present in manifests or installs. */
export declare function scanStalePluginConfig(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): StalePluginConfigHit[];
/** Format warnings for stale plugin config hits. */
export declare function collectStalePluginConfigWarnings(params: {
    hits: StalePluginConfigHit[];
    doctorFixCommand: string;
    autoRepairBlocked?: boolean;
}): string[];
/** Remove stale plugin ids and dangling channel references when discovery is healthy. */
export declare function maybeRepairStalePluginConfig(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv, params?: {
    preservePluginIds?: Iterable<string>;
}): {
    config: OpenClawConfig;
    changes: string[];
};
export {};
