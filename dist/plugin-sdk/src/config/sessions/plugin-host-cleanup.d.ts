import type { SessionEntry } from "./types.js";
/** Cleanup variants owned by plugin host lifecycle paths. */
export type PluginHostSessionCleanupMode = "plugin-owned-state" | "promoted-slots";
export type PluginHostSessionCleanupStoreParams = {
    /** Cleanup mode chosen by the plugin host lifecycle reason. */
    mode: PluginHostSessionCleanupMode;
    /** Plugin owner to clear. Omit only for session-scoped all-plugin cleanup. */
    pluginId?: string;
    /** Optional canonical key, alias, or runtime session id filter. */
    sessionKey?: string;
    /** Promoted SessionEntry slots declared by the plugin registry. */
    sessionEntrySlotKeys?: ReadonlySet<string>;
    /** Per-store file-backed transaction boundary. */
    storePath: string;
    /** Cancels the cleanup before persistence when host lifecycle state changes. */
    shouldCleanup?: () => boolean;
};
/** Clears plugin-owned extension state from one session entry. */
export declare function clearPluginOwnedSessionState(entry: SessionEntry, pluginId?: string, sessionEntrySlotKeys?: ReadonlySet<string>): void;
/** Clears plugin host-owned session state in one store transaction. */
export declare function cleanupPluginHostSessionStore(params: PluginHostSessionCleanupStoreParams): Promise<number>;
