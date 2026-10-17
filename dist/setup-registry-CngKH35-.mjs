import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as getActivePluginChannelRegistry, v as requireActivePluginRegistry } from "./runtime-DfYPSUKC.mjs";
import { t as compareChannelPlugins } from "./registry-loaded-BugfxX6l.mjs";
import { s as listBundledChannelSetupPlugins } from "./bundled-DN3obb3J.mjs";
//#region src/channels/plugins/setup-registry.ts
function sortChannelSetupPlugins(plugins) {
	const seen = /* @__PURE__ */ new Set();
	const resolved = [];
	for (const plugin of plugins) {
		const id = normalizeOptionalString(plugin.id) ?? "";
		if (!id || seen.has(id)) continue;
		seen.add(id);
		resolved.push(plugin);
	}
	return resolved.toSorted(compareChannelPlugins);
}
function listChannelSetupPlugins() {
	const registryPlugins = (requireActivePluginRegistry().channelSetups ?? []).map((entry) => entry.plugin);
	return sortChannelSetupPlugins(registryPlugins.length > 0 ? registryPlugins : listBundledChannelSetupPlugins());
}
/**
* Lists setup plugins from the active channel registry only.
*/
function listActiveChannelSetupPlugins() {
	return sortChannelSetupPlugins((getActivePluginChannelRegistry()?.channelSetups ?? []).map((entry) => entry.plugin));
}
/**
* Returns one setup-capable channel plugin by id.
*/
function getChannelSetupPlugin(id) {
	const resolvedId = normalizeOptionalString(id) ?? "";
	if (!resolvedId) return;
	return listChannelSetupPlugins().find((plugin) => plugin.id === resolvedId);
}
//#endregion
export { listActiveChannelSetupPlugins as n, listChannelSetupPlugins as r, getChannelSetupPlugin as t };
