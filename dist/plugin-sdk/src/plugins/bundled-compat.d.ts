/** Compatibility helpers that auto-enable bundled plugins for legacy and Vitest flows. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Returns config with selected bundled plugins explicitly enabled when compat rules require it. */
export declare function withBundledPluginEnablementCompat(params: {
    config: OpenClawConfig | undefined;
    pluginIds: readonly string[];
}): OpenClawConfig | undefined;
/** Enables bundled plugins in Vitest when tests did not provide explicit plugin config. */
export declare function withBundledPluginVitestCompat(params: {
    config: OpenClawConfig | undefined;
    pluginIds: readonly string[];
    env?: NodeJS.ProcessEnv;
}): OpenClawConfig | undefined;
