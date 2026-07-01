import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import type { PluginOrigin } from "../plugins/plugin-origin.types.js";
import type { PreparedSecretsRuntimeSnapshot, SecretsRuntimeRefreshContext } from "./runtime-state.js";
import type { RuntimeWebToolsMetadata } from "./runtime-web-tools.types.js";
/**
 * Merges caller env with process path env needed for config and agent-dir resolution.
 */
export declare function mergeSecretsRuntimeEnv(env: NodeJS.ProcessEnv | Record<string, string | undefined> | undefined): Record<string, string | undefined>;
/**
 * Collects default and named agent directories that may contain auth profile stores.
 */
export declare function collectCandidateAgentDirs(config: OpenClawConfig, env?: NodeJS.ProcessEnv | Record<string, string | undefined>): string[];
/**
 * Combines explicit refresh agent dirs with config-derived dirs for runtime refresh.
 */
export declare function resolveRefreshAgentDirs(config: OpenClawConfig, context: SecretsRuntimeRefreshContext): string[];
/**
 * Returns whether auth profile files or OAuth state exist for candidate agent dirs.
 */
export declare function hasCandidateAuthProfileStoreSources(params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv | Record<string, string | undefined>;
    agentDirs?: string[];
}): boolean;
/**
 * Creates empty web-tool metadata for snapshots that do not need secret resolution.
 */
export declare function createEmptyRuntimeWebToolsMetadata(): RuntimeWebToolsMetadata;
/**
 * Returns whether a snapshot can skip full SecretRef/web-tool resolution.
 */
/** Returns whether current config/auth/plugin state allows skipping full secret preparation. */
export declare function canUseSecretsRuntimeFastPath(params: {
    sourceConfig: OpenClawConfig;
    authStores: Array<{
        agentDir: string;
        store: AuthProfileStore;
    }>;
}): boolean;
/**
 * Prepares a runtime snapshot without resolving refs when config and auth stores contain none.
 */
export declare function prepareSecretsRuntimeFastPathSnapshot(params: {
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    agentDirs?: string[];
    includeAuthStoreRefs?: boolean;
    loadAuthStore?: (agentDir?: string) => AuthProfileStore;
    loadablePluginOrigins?: ReadonlyMap<string, PluginOrigin>;
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): {
    snapshot: PreparedSecretsRuntimeSnapshot;
    refreshContext: SecretsRuntimeRefreshContext;
    usesAuthStoreFallback: boolean;
} | null;
