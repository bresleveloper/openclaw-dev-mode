import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { PluginManifestRegistry } from "../../../plugins/manifest-registry.js";
/** Collect warnings when plugin allowlists block tools referenced by active tool policies. */
export declare function collectPluginToolAllowlistWarnings(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    manifestRegistry?: PluginManifestRegistry;
}): string[];
