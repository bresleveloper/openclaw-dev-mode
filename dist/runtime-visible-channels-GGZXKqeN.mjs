import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as getLoadedChannelPlugin, r as listChannelPlugins, t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
//#region src/infra/outbound/runtime-visible-channels.ts
/** Finds a channel plugin in a registry by id or channel alias. */
function findChannelPluginInRegistry(registry, channel) {
	if (!registry) return;
	const normalizedChannel = normalizeOptionalLowercaseString(channel);
	if (!normalizedChannel) return;
	return registry.channels.find((entry) => {
		const plugin = entry?.plugin;
		return normalizeOptionalLowercaseString(plugin?.id) === normalizedChannel || plugin?.meta?.aliases?.some((alias) => normalizeOptionalLowercaseString(alias) === normalizedChannel);
	})?.plugin;
}
/** Resolves a channel plugin visible to this process, including registry handles in scope. */
function getRuntimeVisibleChannelPlugin(channel) {
	return findChannelPluginInRegistry(getPluginRuntimeGatewayRequestScope()?.pluginRegistry, channel) ?? getLoadedChannelPlugin(channel) ?? getChannelPlugin(channel);
}
/** Lists channel plugins visible to this process, including registry handles in scope. */
function listRuntimeVisibleChannelPlugins() {
	const scopedRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const plugins = listChannelPlugins();
	if (!scopedRegistry) return plugins;
	const scopedPlugins = /* @__PURE__ */ new Map();
	for (const entry of scopedRegistry.channels) {
		const plugin = entry?.plugin;
		if (!plugin?.id || scopedPlugins.has(plugin.id)) continue;
		scopedPlugins.set(plugin.id, plugin);
	}
	return [...plugins.filter((plugin) => !scopedPlugins.has(plugin.id)), ...scopedPlugins.values()];
}
//#endregion
export { getRuntimeVisibleChannelPlugin as n, listRuntimeVisibleChannelPlugins as r, findChannelPluginInRegistry as t };
