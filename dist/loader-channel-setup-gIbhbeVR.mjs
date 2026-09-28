import { n as unwrapDefaultModuleExport } from "./module-export-BbYMQUy2.mjs";
import { r as mergeChannelPluginSection } from "./bootstrap-registry-Rvdo_TFm.mjs";
import { t as isChannelConfigured } from "./channel-configured-CMGjO82Q.mjs";
//#region src/plugins/loader-channel-setup.ts
function mergeSetupRuntimeChannelPlugin(runtimePlugin, setupPlugin) {
	return {
		...runtimePlugin,
		...setupPlugin,
		meta: mergeChannelPluginSection(runtimePlugin.meta, setupPlugin.meta),
		capabilities: mergeChannelPluginSection(runtimePlugin.capabilities, setupPlugin.capabilities),
		commands: mergeChannelPluginSection(runtimePlugin.commands, setupPlugin.commands),
		doctor: mergeChannelPluginSection(runtimePlugin.doctor, setupPlugin.doctor),
		reload: mergeChannelPluginSection(runtimePlugin.reload, setupPlugin.reload),
		config: mergeChannelPluginSection(runtimePlugin.config, setupPlugin.config),
		setup: mergeChannelPluginSection(runtimePlugin.setup, setupPlugin.setup),
		messaging: mergeChannelPluginSection(runtimePlugin.messaging, setupPlugin.messaging),
		actions: mergeChannelPluginSection(runtimePlugin.actions, setupPlugin.actions),
		secrets: mergeChannelPluginSection(runtimePlugin.secrets, setupPlugin.secrets)
	};
}
function resolveBundledRuntimeChannelRegistration(moduleExport) {
	const resolved = unwrapDefaultModuleExport(moduleExport);
	if (!resolved || typeof resolved !== "object") return {};
	const entryRecord = resolved;
	if (entryRecord.kind !== "bundled-channel-entry" || typeof entryRecord.id !== "string" || typeof entryRecord.loadChannelPlugin !== "function") return {};
	return {
		id: entryRecord.id,
		loadChannelPlugin: entryRecord.loadChannelPlugin,
		...typeof entryRecord.loadChannelSecrets === "function" ? { loadChannelSecrets: entryRecord.loadChannelSecrets } : {},
		...typeof entryRecord.setChannelRuntime === "function" ? { setChannelRuntime: entryRecord.setChannelRuntime } : {}
	};
}
function loadBundledRuntimeChannelPlugin(params) {
	if (typeof params.registration.loadChannelPlugin !== "function") return {};
	try {
		const loadedPlugin = params.registration.loadChannelPlugin();
		const loadedSecrets = params.registration.loadChannelSecrets?.();
		if (!loadedPlugin || typeof loadedPlugin !== "object") return {};
		const mergedSecrets = mergeChannelPluginSection(loadedPlugin.secrets, loadedSecrets);
		return { plugin: {
			...loadedPlugin,
			...mergedSecrets !== void 0 ? { secrets: mergedSecrets } : {}
		} };
	} catch (err) {
		return { loadError: err };
	}
}
function resolveSetupChannelRegistration(moduleExport) {
	const resolved = unwrapDefaultModuleExport(moduleExport);
	if (!resolved || typeof resolved !== "object") return {};
	const setupEntryRecord = resolved;
	if (setupEntryRecord.kind === "bundled-channel-setup-entry" && typeof setupEntryRecord.loadSetupPlugin === "function") try {
		const loadedPlugin = setupEntryRecord.loadSetupPlugin();
		const loadedSecrets = typeof setupEntryRecord.loadSetupSecrets === "function" ? setupEntryRecord.loadSetupSecrets() : void 0;
		if (loadedPlugin && typeof loadedPlugin === "object") {
			const mergedSecrets = mergeChannelPluginSection(loadedPlugin.secrets, loadedSecrets);
			return {
				plugin: {
					...loadedPlugin,
					...mergedSecrets !== void 0 ? { secrets: mergedSecrets } : {}
				},
				usesBundledSetupContract: true,
				...typeof setupEntryRecord.setChannelRuntime === "function" ? { setChannelRuntime: setupEntryRecord.setChannelRuntime } : {},
				...typeof setupEntryRecord.registerSetupRuntime === "function" ? { registerSetupRuntime: setupEntryRecord.registerSetupRuntime } : {}
			};
		}
	} catch (err) {
		return { loadError: err };
	}
	const setup = resolved;
	if (!setup.plugin || typeof setup.plugin !== "object") return {};
	return {
		plugin: setup.plugin,
		...typeof setup.setChannelRuntime === "function" ? { setChannelRuntime: setup.setChannelRuntime } : {}
	};
}
function shouldLoadChannelPluginInSetupRuntime(params) {
	if (params.channelPluginLoadIntent !== "setup" || !params.setupSource || params.manifestChannels.length === 0) return false;
	return !params.manifestChannels.some((channelId) => isChannelConfigured(params.cfg, channelId, params.env));
}
function channelPluginIdBelongsToManifest(params) {
	if (!params.channelId) return true;
	return params.channelId === params.pluginId || params.manifestChannels.includes(params.channelId);
}
//#endregion
export { resolveSetupChannelRegistration as a, resolveBundledRuntimeChannelRegistration as i, loadBundledRuntimeChannelPlugin as n, shouldLoadChannelPluginInSetupRuntime as o, mergeSetupRuntimeChannelPlugin as r, channelPluginIdBelongsToManifest as t };
