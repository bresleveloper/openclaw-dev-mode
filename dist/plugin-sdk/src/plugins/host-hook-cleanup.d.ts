import { clearPluginOwnedSessionState } from "../config/sessions/session-accessor.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginHostCleanupReason } from "./host-hooks.js";
import type { PluginRegistry } from "./registry-types.js";
export { clearPluginOwnedSessionState };
/** Failure captured while running plugin cleanup hooks. */
/** Failure captured while running one plugin cleanup callback. */
export type PluginHostCleanupFailure = {
    pluginId: string;
    hookId: string;
    error: unknown;
};
/** Aggregate cleanup result for plugin host state. */
export type PluginHostCleanupResult = {
    cleanupCount: number;
    failures: PluginHostCleanupFailure[];
};
type ResolveCleanupSessionStorePaths = () => readonly string[];
/** Runs persistent and in-memory cleanup for a plugin, session, or host lifecycle event. */
/** Runs cleanup callbacks for one plugin and returns failures instead of throwing. */
export declare function runPluginHostCleanup(params: {
    cfg?: OpenClawConfig;
    registry?: PluginRegistry | null;
    pluginId?: string;
    reason: PluginHostCleanupReason;
    sessionKey?: string;
    runId?: string;
    preserveSchedulerJobIds?: ReadonlySet<string>;
    shouldCleanup?: () => boolean;
    restartPromotedSessionEntrySlotKeys?: ReadonlySet<string>;
    preserveSchedulerOwnerRegistry?: PluginRegistry | null;
    sessionStorePaths?: readonly string[];
    resolveSessionStorePaths?: ResolveCleanupSessionStorePaths;
    skipPersistentSessionState?: boolean;
}): Promise<PluginHostCleanupResult>;
/** Cleans up plugin host state when a registry snapshot is replaced. */
export declare function cleanupReplacedPluginHostRegistry(params: {
    cfg: OpenClawConfig;
    previousRegistry?: PluginRegistry | null;
    nextRegistry?: PluginRegistry | null;
    shouldCleanup?: () => boolean;
}): Promise<PluginHostCleanupResult>;
