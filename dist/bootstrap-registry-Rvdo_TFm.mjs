import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as getBundledChannelSetupSecrets, i as getBundledChannelSetupPlugin, n as getBundledChannelPlugin, r as getBundledChannelSecrets } from "./bundled-D8dZgG2d.mjs";
//#region src/channels/plugins/merge-plugin-section.ts
function mergeChannelPluginSection(baseValue, overrideValue) {
	if (baseValue && overrideValue && typeof baseValue === "object" && typeof overrideValue === "object") {
		const merged = { ...baseValue };
		for (const [key, value] of Object.entries(overrideValue)) if (value !== void 0) merged[key] = value;
		return { ...merged };
	}
	return overrideValue ?? baseValue;
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
function mergeBootstrapPlugin(runtimePlugin, setupPlugin) {
	return {
		...runtimePlugin,
		...setupPlugin,
		meta: mergeChannelPluginSection(runtimePlugin.meta, setupPlugin.meta),
		capabilities: mergeChannelPluginSection(runtimePlugin.capabilities, setupPlugin.capabilities),
		commands: mergeChannelPluginSection(runtimePlugin.commands, setupPlugin.commands),
		doctor: mergeChannelPluginSection(runtimePlugin.doctor, setupPlugin.doctor),
		reload: mergeChannelPluginSection(runtimePlugin.reload, setupPlugin.reload),
		config: mergeChannelPluginSection(runtimePlugin.config, setupPlugin.config),
		messaging: mergeChannelPluginSection(runtimePlugin.messaging, setupPlugin.messaging),
		actions: mergeChannelPluginSection(runtimePlugin.actions, setupPlugin.actions),
		secrets: mergeChannelPluginSection(runtimePlugin.secrets, setupPlugin.secrets)
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
		return mergeChannelPluginSection(getBundledChannelSecrets(resolvedId), getBundledChannelSetupSecrets(resolvedId));
	} catch {
		return;
	}
}
//#endregion
export { getBootstrapChannelSecrets as n, mergeChannelPluginSection as r, getBootstrapChannelPlugin as t };
