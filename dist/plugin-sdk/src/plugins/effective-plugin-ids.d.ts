import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Lists plugin ids that are effectively enabled for a config/discovery context. */
export declare function resolveEffectivePluginIds(params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    workspaceDir?: string;
    bundledPluginsDir?: string;
}): string[];
