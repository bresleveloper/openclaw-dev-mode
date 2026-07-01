import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginModelCatalogMetadataSnapshot } from "./plugin-model-catalog.js";
/** Resolve the workspace directory model discovery should use for agent scope. */
export declare function resolveModelWorkspaceDir(cfg: OpenClawConfig | undefined, explicitWorkspaceDir: string | undefined): string | undefined;
/**
 * Resolve the plugin metadata snapshot for model discovery.
 *
 * Explicit snapshots win for tests and prepared runtimes. Otherwise we prefer
 * the current process snapshot, then fall back to resolving from config/env.
 */
export declare function resolveModelPluginMetadataSnapshot(params: {
    allowWorkspaceScopedCurrent?: boolean;
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    pluginMetadataSnapshot?: PluginModelCatalogMetadataSnapshot;
    useRuntimeConfig?: boolean;
    workspaceDir?: string;
}): PluginModelCatalogMetadataSnapshot | undefined;
