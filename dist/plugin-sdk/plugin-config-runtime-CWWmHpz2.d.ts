import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
//#region src/plugin-sdk/plugin-config-runtime.d.ts
/** Requires an already-resolved runtime config at plugin runtime boundaries. */
declare function requireRuntimeConfig(config: OpenClawConfig, context: string): OpenClawConfig;
/** Reads a plugin's object-shaped `plugins.entries[id].config` block from resolved config. */
declare function resolvePluginConfigObject(config: OpenClawConfig | undefined, pluginId: string): Record<string, unknown> | undefined;
/** Resolves live plugin config through a loader, falling back to startup config when unavailable. */
declare function resolveLivePluginConfigObject(runtimeConfigLoader: (() => OpenClawConfig | undefined) | undefined, pluginId: string, startupPluginConfig?: Record<string, unknown>): Record<string, unknown> | undefined;
//#endregion
export { resolveLivePluginConfigObject as n, resolvePluginConfigObject as r, requireRuntimeConfig as t };