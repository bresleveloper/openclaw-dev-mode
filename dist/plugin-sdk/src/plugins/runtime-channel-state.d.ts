import type { ActivePluginChannelRegistry } from "./channel-registry-state.types.js";
/** Global symbol that stores process-current plugin registry state. */
export declare const PLUGIN_REGISTRY_STATE: unique symbol;
export type ActivePluginChannelRegistrySnapshot = {
    registry: ActivePluginChannelRegistry | null;
    version: number;
};
/** Returns a cached channel registry snapshot, preferring pinned channel state when populated. */
export declare function getActivePluginChannelRegistrySnapshotFromState(): ActivePluginChannelRegistrySnapshot;
/** Returns the active plugin channel registry from global runtime state. */
export declare function getActivePluginChannelRegistryFromState(): ActivePluginChannelRegistry | null;
/** Returns the active plugin channel registry version from global runtime state. */
export declare function getActivePluginChannelRegistryVersionFromState(): number;
