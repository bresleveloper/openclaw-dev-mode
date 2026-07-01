/** Reads the active plugin registry workspace directory from global runtime state,
 *  respecting any pinned workspace from the current async context. */
export declare function getActivePluginRegistryWorkspaceDirFromState(): string | undefined;
/**
 * Pin the active plugin-registry workspace dir for the duration of `fn`.
 * While pinned, calls to `getActivePluginRegistryWorkspaceDirFromState()` return
 * the snapshot taken at pin time, ignoring concurrent mutations from other
 * agent turns or crons. This prevents per-row memo-busting in operations that
 * iterate over many rows (e.g. sessions.list).
 */
export declare function withPinnedActivePluginRegistryWorkspaceDir<T>(fn: () => T): T;
