import type { OpenClawConfig } from "../../../config/types.openclaw.js";
type BundledPluginLoadPathHit = {
    pluginId: string;
    fromPath: string;
    toPath: string;
    pathLabel: string;
};
/** Find configured plugin load paths that alias bundled plugins already shipped by OpenClaw. */
export declare function scanBundledPluginLoadPathMigrations(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): BundledPluginLoadPathHit[];
/** Format user-facing warnings for redundant bundled plugin load path aliases. */
export declare function collectBundledPluginLoadPathWarnings(params: {
    hits: BundledPluginLoadPathHit[];
    doctorFixCommand: string;
}): string[];
/** Remove redundant bundled plugin load path aliases while preserving unrelated custom paths. */
export declare function maybeRepairBundledPluginLoadPaths(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): {
    config: OpenClawConfig;
    changes: string[];
};
export {};
