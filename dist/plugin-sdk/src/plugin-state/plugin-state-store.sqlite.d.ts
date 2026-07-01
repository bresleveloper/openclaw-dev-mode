import { type PluginStateEntry, type PluginStateStoreProbeResult } from "./plugin-state-store.types.js";
export declare const MAX_PLUGIN_STATE_VALUE_BYTES = 65536;
export declare const MAX_PLUGIN_STATE_ENTRIES_PER_PLUGIN = 50000;
type PluginStateSeedEntryForTests = {
    pluginId: string;
    namespace: string;
    key: string;
    valueJson: string;
    createdAt?: number;
    expiresAt?: number | null;
};
export declare function pluginStateRegister(params: {
    pluginId: string;
    namespace: string;
    key: string;
    valueJson: string;
    maxEntries: number;
    ttlMs?: number;
    env?: NodeJS.ProcessEnv;
}): void;
export declare function pluginStateRegisterIfAbsent(params: {
    pluginId: string;
    namespace: string;
    key: string;
    valueJson: string;
    maxEntries: number;
    ttlMs?: number;
    env?: NodeJS.ProcessEnv;
}): boolean;
export declare function pluginStateUpdate(params: {
    pluginId: string;
    namespace: string;
    key: string;
    maxEntries: number;
    updateValueJson: (current: unknown) => {
        valueJson: string;
        ttlMs?: number;
    } | undefined;
    env?: NodeJS.ProcessEnv;
}): boolean;
export declare function pluginStateLookup(params: {
    pluginId: string;
    namespace: string;
    key: string;
    env?: NodeJS.ProcessEnv;
}): unknown;
export declare function pluginStateConsume(params: {
    pluginId: string;
    namespace: string;
    key: string;
    env?: NodeJS.ProcessEnv;
}): unknown;
export declare function pluginStateDelete(params: {
    pluginId: string;
    namespace: string;
    key: string;
    env?: NodeJS.ProcessEnv;
}): boolean;
export declare function pluginStateEntries(params: {
    pluginId: string;
    namespace: string;
    env?: NodeJS.ProcessEnv;
}): PluginStateEntry<unknown>[];
export declare function pluginStateClear(params: {
    pluginId: string;
    namespace: string;
    env?: NodeJS.ProcessEnv;
}): void;
export declare function sweepExpiredPluginStateEntries(): number;
export declare function isPluginStateDatabaseOpen(): boolean;
export declare function clearPluginStateDatabaseForTests(): void;
export declare function setMaxPluginStateEntriesPerPluginForTests(value?: number): void;
export declare function countPluginStateLiveEntries(pluginId: string): number;
export declare function seedPluginStateDatabaseEntriesForTests(entries: readonly PluginStateSeedEntryForTests[]): void;
export declare function probePluginStateStore(): PluginStateStoreProbeResult;
export declare function closePluginStateDatabase(): void;
export {};
