import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CaqgRIEy.mjs";
//#region src/gateway/plugin-activation-runtime-config.ts
function mergeEnabledEntries(runtimeValue, activationValue) {
	if (!isRecord(activationValue)) return;
	const runtimeEntries = isRecord(runtimeValue) ? runtimeValue : {};
	let nextEntries;
	for (const [id, activationEntry] of Object.entries(activationValue)) {
		if (!isRecord(activationEntry) || !Object.hasOwn(activationEntry, "enabled")) continue;
		const runtimeEntry = runtimeEntries[id];
		nextEntries ??= { ...runtimeEntries };
		nextEntries[id] = {
			...isRecord(runtimeEntry) ? runtimeEntry : {},
			enabled: activationEntry.enabled
		};
	}
	return nextEntries;
}
/** Merges plugin/channel activation enablement into the runtime config shape. */
function mergeActivationSectionsIntoRuntimeConfig(params) {
	const { runtimeConfig, activationConfig } = params;
	const nextChannels = mergeEnabledEntries(runtimeConfig.channels, activationConfig.channels);
	const activationPlugins = activationConfig.plugins;
	let nextPlugins;
	if (isRecord(activationPlugins)) {
		const runtimePlugins = isRecord(runtimeConfig.plugins) ? runtimeConfig.plugins : {};
		if (Array.isArray(activationPlugins.allow)) nextPlugins = {
			...runtimePlugins,
			allow: [...activationPlugins.allow]
		};
		const nextEntries = mergeEnabledEntries(runtimePlugins.entries, activationPlugins.entries);
		if (nextEntries !== void 0) nextPlugins = {
			...runtimePlugins,
			...nextPlugins,
			entries: nextEntries
		};
	}
	if (nextChannels === void 0 && nextPlugins === void 0) return runtimeConfig;
	return {
		...runtimeConfig,
		...nextChannels === void 0 ? {} : { channels: nextChannels },
		...nextPlugins === void 0 ? {} : { plugins: nextPlugins }
	};
}
function resolveGatewayStartupPluginActivationConfig(params) {
	return mergeActivationSectionsIntoRuntimeConfig({
		runtimeConfig: params.runtimeConfig,
		activationConfig: applyPluginAutoEnable({
			config: params.activationSourceConfig,
			env: params.env,
			...params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {},
			discovery: params.discovery,
			ambientEnvTriggers: params.ambientEnvTriggers
		}).config
	});
}
/** Re-derives source-owned plugin activation for a reload candidate. */
function resolveGatewayReloadPluginActivationCandidate(params) {
	return applyPluginAutoEnable({
		config: params.sourceConfig,
		env: params.env,
		...params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {},
		discovery: params.discovery,
		ambientEnvTriggers: params.ambientEnvTriggers
	}).config;
}
//#endregion
export { resolveGatewayReloadPluginActivationCandidate as n, resolveGatewayStartupPluginActivationConfig as r, mergeActivationSectionsIntoRuntimeConfig as t };
