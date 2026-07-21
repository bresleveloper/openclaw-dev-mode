import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as getActivePluginChannelRegistryFromState } from "./runtime-channel-state-D79Ax0is.js";
//#region src/channels/plugins/registry-loaded-read.ts
/**
* Hot-path loaded channel plugin reader.
*
* Reads active runtime channel state without materializing the full registry view.
*/
function coerceLoadedChannelPlugin(plugin) {
	const id = normalizeOptionalString(plugin?.id) ?? "";
	if (!plugin || !id) return;
	if (!plugin.meta || typeof plugin.meta !== "object") plugin.meta = {};
	return plugin;
}
/**
* Reads one loaded channel plugin directly from active runtime state.
*/
function getLoadedChannelPluginForRead(id) {
	const resolvedId = normalizeOptionalString(id) ?? "";
	if (!resolvedId) return;
	const registry = getActivePluginChannelRegistryFromState();
	if (!registry || !Array.isArray(registry.channels)) return;
	for (const entry of registry.channels) {
		const plugin = coerceLoadedChannelPlugin(entry?.plugin);
		if (plugin && plugin.id === resolvedId) return plugin;
	}
}
//#endregion
export { getLoadedChannelPluginForRead as t };
