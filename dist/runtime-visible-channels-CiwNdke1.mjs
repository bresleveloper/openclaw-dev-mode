import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as getLoadedChannelPlugin, r as listChannelPlugins, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
//#region src/infra/outbound/runtime-visible-channels.ts
/** Finds a channel plugin in a registry by id or channel alias. */
function findChannelPluginInRegistry(registry, channel) {
	if (!registry) return;
	const normalizedChannel = normalizeOptionalLowercaseString(channel);
	if (!normalizedChannel) return;
	for (const entry of registry.channels) {
		const plugin = entry?.plugin;
		if (normalizeOptionalLowercaseString(plugin?.id) === normalizedChannel || plugin?.meta?.aliases?.some((alias) => normalizeOptionalLowercaseString(alias) === normalizedChannel)) return plugin;
	}
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
	const scopedPluginIds = /* @__PURE__ */ new Set();
	const scopedPlugins = [];
	for (const entry of scopedRegistry.channels) {
		const plugin = entry?.plugin;
		if (!plugin?.id || scopedPluginIds.has(plugin.id)) continue;
		scopedPluginIds.add(plugin.id);
		scopedPlugins.push(plugin);
	}
	return [...plugins.filter((plugin) => !scopedPluginIds.has(plugin.id)), ...scopedPlugins];
}
//#endregion
export { getRuntimeVisibleChannelPlugin as n, listRuntimeVisibleChannelPlugins as r, findChannelPluginInRegistry as t };
