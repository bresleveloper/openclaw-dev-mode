import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as listChannelCatalogEntries } from "./channel-catalog-registry-BokgJgGN.js";
import { a as getBundledChannelSetupPlugin, i as getBundledChannelSecrets, o as getBundledChannelSetupSecrets, p as resolveBundledChannelRootScope, r as getBundledChannelPlugin } from "./bundled-rTRi0B0q.js";
//#region src/channels/plugins/bundled-ids.ts
/**
* Bundled channel id listing helpers.
*
* Reads generated channel catalog entries for current package/cache scope.
*/
/**
* Lists bundled channel ids for a package root/cache scope.
*/
function listBundledChannelIdsForRoot(_packageRoot, env = process.env, discovery) {
	return listChannelCatalogEntries({
		origin: "bundled",
		env,
		discovery
	}).map((entry) => entry.channel.id).filter((channelId) => Boolean(channelId)).toSorted((left, right) => left.localeCompare(right));
}
/**
* Lists bundled channel ids for the current runtime root scope.
*/
function listBundledChannelIds(env = process.env, discovery) {
	return listBundledChannelIdsForRoot(resolveBundledChannelRootScope(env).cacheKey, env, discovery);
}
//#endregion
//#region src/channels/plugins/bootstrap-registry.ts
/**
* Bundled channel bootstrap registry.
*
* Provides channel plugin metadata before the full runtime registry is installed.
*/
function resolveBootstrapChannelId(id) {
	return normalizeOptionalString(id) ?? "";
}
function mergePluginSection(runtimeValue, setupValue) {
	if (runtimeValue && setupValue && typeof runtimeValue === "object" && typeof setupValue === "object") {
		const merged = { ...runtimeValue };
		for (const [key, value] of Object.entries(setupValue)) if (value !== void 0) merged[key] = value;
		return { ...merged };
	}
	return setupValue ?? runtimeValue;
}
function mergeBootstrapPlugin(runtimePlugin, setupPlugin) {
	return {
		...runtimePlugin,
		...setupPlugin,
		meta: mergePluginSection(runtimePlugin.meta, setupPlugin.meta),
		capabilities: mergePluginSection(runtimePlugin.capabilities, setupPlugin.capabilities),
		commands: mergePluginSection(runtimePlugin.commands, setupPlugin.commands),
		doctor: mergePluginSection(runtimePlugin.doctor, setupPlugin.doctor),
		reload: mergePluginSection(runtimePlugin.reload, setupPlugin.reload),
		config: mergePluginSection(runtimePlugin.config, setupPlugin.config),
		setup: mergePluginSection(runtimePlugin.setup, setupPlugin.setup),
		messaging: mergePluginSection(runtimePlugin.messaging, setupPlugin.messaging),
		actions: mergePluginSection(runtimePlugin.actions, setupPlugin.actions),
		secrets: mergePluginSection(runtimePlugin.secrets, setupPlugin.secrets)
	};
}
/**
* Loads a bundled channel plugin for bootstrap, merging runtime and setup artifacts.
*/
function getBootstrapChannelPlugin(id) {
	const resolvedId = resolveBootstrapChannelId(id);
	if (!resolvedId) return;
	let runtimePlugin;
	let setupPlugin;
	try {
		runtimePlugin = getBundledChannelPlugin(resolvedId);
		setupPlugin = getBundledChannelSetupPlugin(resolvedId);
	} catch {
		return;
	}
	return runtimePlugin && setupPlugin ? mergeBootstrapPlugin(runtimePlugin, setupPlugin) : setupPlugin ?? runtimePlugin;
}
/**
* Loads bootstrap secret metadata from bundled runtime and setup artifacts.
*/
function getBootstrapChannelSecrets(id) {
	const resolvedId = resolveBootstrapChannelId(id);
	if (!resolvedId) return;
	try {
		return mergePluginSection(getBundledChannelSecrets(resolvedId), getBundledChannelSetupSecrets(resolvedId));
	} catch {
		return;
	}
}
//#endregion
export { getBootstrapChannelSecrets as n, listBundledChannelIds as r, getBootstrapChannelPlugin as t };
