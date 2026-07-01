import type { OpenClawConfig } from "../config/types.js";
export { normalizePluginsConfig, resolveEffectiveEnableState } from "../plugins/config-state.js";
/** Requires an already-resolved runtime config at plugin runtime boundaries. */
export declare function requireRuntimeConfig(config: OpenClawConfig, context: string): OpenClawConfig;
/** Reads a plugin's object-shaped `plugins.entries[id].config` block from resolved config. */
export declare function resolvePluginConfigObject(config: OpenClawConfig | undefined, pluginId: string): Record<string, unknown> | undefined;
/** Resolves live plugin config through a loader, falling back to startup config when unavailable. */
export declare function resolveLivePluginConfigObject(runtimeConfigLoader: (() => OpenClawConfig | undefined) | undefined, pluginId: string, startupPluginConfig?: Record<string, unknown>): Record<string, unknown> | undefined;
