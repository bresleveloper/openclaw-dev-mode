/** Tracks active and retired plugin registries so stale runtime calls can be rejected. */
import type { PluginRegistry } from "./registry-types.js";
/** Marks a registry retired so late runtime calls can reject stale plugin state. */
export declare function markPluginRegistryRetired(registry: PluginRegistry | null | undefined): void;
/** Marks a registry active and clears any previous retired state. */
export declare function markPluginRegistryActive(registry: PluginRegistry | null | undefined): void;
/** True when a registry has been activated for runtime use. */
export declare function isPluginRegistryActivated(registry: PluginRegistry): boolean;
/** True when a registry has been retired by a newer active registry. */
export declare function isPluginRegistryRetired(registry: PluginRegistry): boolean;
