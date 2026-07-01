import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import type { PluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.js";
import type { PluginOrigin } from "../plugins/plugin-origin.types.js";
import { type PreparedSecretsRuntimeSnapshot } from "./runtime-state.js";
import type { RuntimeWebToolsMetadata } from "./runtime-web-tools.types.js";
export type { SecretResolverWarning } from "./runtime-shared.js";
export type { PreparedSecretsRuntimeSnapshot } from "./runtime-state.js";
/** Prepares a secrets runtime snapshot and records refresh context for later activation. */
export declare function prepareSecretsRuntimeSnapshot(params: {
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    agentDirs?: string[];
    includeAuthStoreRefs?: boolean;
    loadAuthStore?: (agentDir?: string) => AuthProfileStore;
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
    pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins" | "manifestRegistry">;
    /** Test override for discovered loadable plugins and their origins. */
    loadablePluginOrigins?: ReadonlyMap<string, PluginOrigin>;
}): Promise<PreparedSecretsRuntimeSnapshot>;
/** Activates a prepared secrets runtime snapshot for fast runtime lookup. */
export declare function activateSecretsRuntimeSnapshot(snapshot: PreparedSecretsRuntimeSnapshot): void;
export declare function refreshActiveSecretsRuntimeSnapshot(): Promise<boolean>;
export declare function getActiveSecretsRuntimeSnapshot(): PreparedSecretsRuntimeSnapshot | null;
export declare function getActiveSecretsRuntimeEnv(): NodeJS.ProcessEnv;
export declare function getActiveRuntimeWebToolsMetadata(): RuntimeWebToolsMetadata | null;
export declare function clearSecretsRuntimeSnapshot(): void;
