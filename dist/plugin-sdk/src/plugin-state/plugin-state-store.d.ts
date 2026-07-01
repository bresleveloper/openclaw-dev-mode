import type { OpenKeyedStoreOptions, PluginStateKeyedStore, PluginStateSyncKeyedStore } from "./plugin-state-store.types.js";
export type { OpenKeyedStoreOptions, PluginStateEntry, PluginStateKeyedStore, PluginStateSyncKeyedStore, PluginStateStoreErrorCode, PluginStateStoreOperation, PluginStateStoreProbeResult, PluginStateStoreProbeStep, } from "./plugin-state-store.types.js";
export { PluginStateStoreError } from "./plugin-state-store.types.js";
export { closePluginStateDatabase, countPluginStateLiveEntries, isPluginStateDatabaseOpen, MAX_PLUGIN_STATE_ENTRIES_PER_PLUGIN, probePluginStateStore, setMaxPluginStateEntriesPerPluginForTests, sweepExpiredPluginStateEntries, } from "./plugin-state-store.sqlite.js";
/** Opens an async plugin-state namespace for a non-core plugin id. */
export declare function createPluginStateKeyedStore<T>(pluginId: string, options: OpenKeyedStoreOptions): PluginStateKeyedStore<T>;
/** Opens a sync plugin-state namespace for a non-core plugin id. */
export declare function createPluginStateSyncKeyedStore<T>(pluginId: string, options: OpenKeyedStoreOptions): PluginStateSyncKeyedStore<T>;
/** Opens a sync plugin-state namespace for a trusted core owner id. */
export declare function createCorePluginStateSyncKeyedStore<T>(options: OpenKeyedStoreOptions & {
    ownerId: `core:${string}`;
}): PluginStateSyncKeyedStore<T>;
/** Clears plugin-state rows and option signatures for tests. */
export declare function clearPluginStateStoreForTests(): void;
/** Resets plugin-state module/database state for isolated tests. */
export declare function resetPluginStateStoreForTests(options?: {
    closeDatabase?: boolean;
}): void;
