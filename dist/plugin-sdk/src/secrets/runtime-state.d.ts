import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import { type RuntimeConfigSnapshotRefreshHandler } from "../config/runtime-snapshot.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import type { PluginOrigin } from "../plugins/plugin-origin.types.js";
import type { SecretResolverWarning } from "./runtime-shared.js";
import type { RuntimeWebToolsMetadata } from "./runtime-web-tools.types.js";
/** Prepared secrets runtime snapshot activated for fast secret resolution. */
export type PreparedSecretsRuntimeSnapshot = {
    sourceConfig: OpenClawConfig;
    config: OpenClawConfig;
    authStores: Array<{
        agentDir: string;
        store: AuthProfileStore;
    }>;
    warnings: SecretResolverWarning[];
    webTools: RuntimeWebToolsMetadata;
};
/** Context needed to refresh active secrets runtime snapshots without losing plugin origin data. */
export type SecretsRuntimeRefreshContext = {
    env: Record<string, string | undefined>;
    explicitAgentDirs: string[] | null;
    includeAuthStoreRefs: boolean;
    loadAuthStore?: (agentDir?: string) => AuthProfileStore;
    loadablePluginOrigins: ReadonlyMap<string, PluginOrigin>;
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
};
/**
 * Clones refresh context while preserving callback identity and isolating mutable maps/config.
 */
export declare function cloneSecretsRuntimeRefreshContext(context: SecretsRuntimeRefreshContext): SecretsRuntimeRefreshContext;
/**
 * Associates a prepared snapshot with the refresh context needed after activation.
 */
export declare function setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot: PreparedSecretsRuntimeSnapshot, context: SecretsRuntimeRefreshContext): void;
/**
 * Returns the refresh context stored for a prepared snapshot, if any.
 */
export declare function getPreparedSecretsRuntimeSnapshotRefreshContext(snapshot: PreparedSecretsRuntimeSnapshot): SecretsRuntimeRefreshContext | null;
/**
 * Returns the active refresh context without exposing mutable runtime state.
 */
export declare function getActiveSecretsRuntimeRefreshContext(): SecretsRuntimeRefreshContext | null;
/**
 * Returns the env used by the active runtime snapshot, falling back to process env.
 */
export declare function getActiveSecretsRuntimeEnv(): NodeJS.ProcessEnv;
/**
 * Registers cleanup hooks that run whenever the active secrets runtime snapshot is cleared.
 */
export declare function registerSecretsRuntimeStateClearHook(clearHook: () => void): void;
/**
 * Atomically activates a prepared secrets snapshot across config, auth-store, and web-tool state.
 */
export declare function activateSecretsRuntimeSnapshotState(params: {
    snapshot: PreparedSecretsRuntimeSnapshot;
    refreshContext: SecretsRuntimeRefreshContext | null;
    refreshHandler: RuntimeConfigSnapshotRefreshHandler | null;
}): void;
/**
 * Returns a cloned active secrets runtime snapshot for callers that need mutable data.
 */
export declare function getActiveSecretsRuntimeSnapshot(): PreparedSecretsRuntimeSnapshot | null;
export declare function getActiveSecretsRuntimeConfigSnapshot(): Pick<PreparedSecretsRuntimeSnapshot, "config" | "sourceConfig"> | null;
/**
 * Returns current auth stores, preferring live auth-store snapshots over activation-time clones.
 */
export declare function getLiveSecretsRuntimeAuthStores(): PreparedSecretsRuntimeSnapshot["authStores"];
/**
 * Clears active secrets runtime state and all linked config/auth/web-tool snapshots.
 */
export declare function clearSecretsRuntimeSnapshot(): void;
