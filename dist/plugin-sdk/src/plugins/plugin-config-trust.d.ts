import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginManifestRecord } from "./manifest-registry.js";
/** Normalizes plugin ids used in config allow/deny/entry lists. */
export declare function normalizePluginConfigId(id: unknown): string;
/** Resolves whether workspace plugin config allows one plugin manifest record. */
export declare function isWorkspacePluginAllowedByConfig(params: {
    config: OpenClawConfig | undefined;
    isImplicitlyAllowed?: (pluginId: string) => boolean;
    plugin: PluginManifestRecord;
}): boolean;
