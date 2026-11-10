import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as resolveChannelConfigRecord, n as hasMeaningfulChannelConfigShallow } from "./channel-config-activation-C8WitDLu.mjs";
import { a as listBundledChannelIdsForPackageState, n as hasBundledChannelPackageState } from "./package-state-probes-B0GI9kSw.mjs";
import { a as getBundledChannelSetupSecrets, i as getBundledChannelSetupPlugin, n as getBundledChannelPlugin, r as getBundledChannelSecrets } from "./bundled-CEh6W_x7.mjs";
//#region src/channels/plugins/merge-plugin-section.ts
function mergeChannelPluginSection(baseValue, overrideValue) {
	if (baseValue && overrideValue && typeof baseValue === "object" && typeof overrideValue === "object") {
		const merged = { ...baseValue };
		for (const [key, value] of Object.entries(overrideValue)) if (value !== void 0) merged[key] = value;
		return merged;
	}
	return overrideValue ?? baseValue;
}
//#endregion
//#region src/channels/plugins/bootstrap-registry.ts
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
	const resolvedId = normalizeOptionalString(id);
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
	const resolvedId = normalizeOptionalString(id);
	if (!resolvedId) return;
	try {
		return mergeChannelPluginSection(getBundledChannelSecrets(resolvedId), getBundledChannelSetupSecrets(resolvedId));
	} catch {
		return;
	}
}
//#endregion
//#region src/config/channel-configured.ts
function isChannelConfigured(cfg, channelId, env = process.env) {
	if (hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId), channelId)) return true;
	if (listBundledChannelIdsForPackageState("configuredState").includes(channelId.trim())) return hasBundledChannelPackageState({
		metadataKey: "configuredState",
		channelId,
		cfg,
		env
	});
	const plugin = getBootstrapChannelPlugin(channelId);
	return Boolean(plugin?.config?.hasConfiguredState?.({
		cfg,
		env
	}));
}
//#endregion
export { mergeChannelPluginSection as i, getBootstrapChannelPlugin as n, getBootstrapChannelSecrets as r, isChannelConfigured as t };
