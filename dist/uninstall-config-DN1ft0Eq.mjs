import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-CAv_plX7.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { o as resetPluginSlotsToDefaults } from "./slots-DarSawuQ.mjs";
//#region src/plugins/uninstall-package-config.ts
const SHARED_CHANNEL_CONFIG_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
function mergePluginConfigUninstallActions(...sources) {
	const actions = createEmptyConfigUninstallActions();
	for (const key of Object.keys(actions)) actions[key] = sources.some((source) => source[key]);
	return actions;
}
function createEmptyConfigUninstallActions() {
	return {
		entry: false,
		install: false,
		allowlist: false,
		denylist: false,
		loadPath: false,
		memorySlot: false,
		contextEngineSlot: false,
		channelConfig: false
	};
}
/** Check whether a managed uninstall target stays inside its owning root. */
function isUninstallPathInsideOrEqual(parent, child) {
	return isPathInside(resolveRealpathOrAbsolute(parent), resolveRealpathOrAbsolute(child));
}
/** Resolve channel config keys owned by a plugin during uninstall. */
function resolveUninstallChannelConfigKeys(pluginId, opts) {
	return uniqueStrings((opts?.channelIds ?? [pluginId]).filter((key) => !SHARED_CHANNEL_CONFIG_KEYS.has(key)));
}
function loadPathMatchesInstallPath(loadPath, installPath) {
	return loadPath === installPath || resolveRealpathOrAbsolute(loadPath) === resolveRealpathOrAbsolute(installPath);
}
function hasMatchingPluginLoadPath(config, ownedPaths) {
	return Boolean(config.plugins?.load?.paths?.some((candidate) => ownedPaths.some((ownedPath) => loadPathMatchesInstallPath(candidate, ownedPath))));
}
function removeMatchingLoadPaths(load, ownedPaths) {
	const loadPaths = load?.paths;
	if (ownedPaths.length === 0 || !Array.isArray(loadPaths)) return {
		load,
		changed: false
	};
	const nextLoadPaths = loadPaths.filter((candidate) => !ownedPaths.some((ownedPath) => loadPathMatchesInstallPath(candidate, ownedPath)));
	return nextLoadPaths.length === loadPaths.length ? {
		load,
		changed: false
	} : {
		load: nextLoadPaths.length > 0 ? {
			...load,
			paths: nextLoadPaths
		} : void 0,
		changed: true
	};
}
function removePluginRuntimePolicyFromConfig(cfg, pluginId, opts) {
	const actions = createEmptyConfigUninstallActions();
	const pluginsConfig = cfg.plugins ?? {};
	let entries = pluginsConfig.entries;
	if (entries && Object.hasOwn(entries, pluginId)) {
		const { [pluginId]: _, ...rest } = entries;
		entries = Object.keys(rest).length > 0 ? rest : void 0;
		actions.entry = true;
	}
	let allow = pluginsConfig.allow;
	if (Array.isArray(allow) && allow.includes(pluginId)) {
		allow = allow.filter((id) => id !== pluginId);
		allow = allow.length > 0 ? allow : void 0;
		actions.allowlist = true;
	}
	let deny = pluginsConfig.deny;
	if (Array.isArray(deny) && deny.includes(pluginId)) {
		deny = deny.filter((id) => id !== pluginId);
		deny = deny.length > 0 ? deny : void 0;
		actions.denylist = true;
	}
	const loadResult = removeMatchingLoadPaths(pluginsConfig.load, opts?.loadPaths ?? []);
	actions.loadPath = loadResult.changed;
	let slots = pluginsConfig.slots;
	if (slots?.memory === pluginId) actions.memorySlot = true;
	if (slots?.contextEngine === pluginId) actions.contextEngineSlot = true;
	slots = resetPluginSlotsToDefaults(slots, pluginId);
	if (slots && Object.keys(slots).length === 0) slots = void 0;
	const cleanedPlugins = {
		...pluginsConfig,
		entries,
		allow,
		deny,
		load: loadResult.load,
		slots
	};
	for (const key of [
		"entries",
		"allow",
		"deny",
		"load",
		"slots"
	]) if (cleanedPlugins[key] === void 0) delete cleanedPlugins[key];
	let channels = cfg.channels;
	for (const key of resolveUninstallChannelConfigKeys(pluginId, opts)) {
		if (!channels || !Object.hasOwn(channels, key)) continue;
		const { [key]: _removed, ...rest } = channels;
		channels = Object.keys(rest).length > 0 ? rest : void 0;
		actions.channelConfig = true;
	}
	if (!Object.values(actions).some(Boolean)) return {
		config: cfg,
		actions
	};
	return {
		config: {
			...cfg,
			plugins: Object.keys(cleanedPlugins).length > 0 ? cleanedPlugins : void 0,
			...actions.channelConfig ? { channels } : {}
		},
		actions
	};
}
function removePluginInstallOwnerFromConfig(cfg, installOwner) {
	const actions = createEmptyConfigUninstallActions();
	const pluginsConfig = cfg.plugins ?? {};
	let installs = pluginsConfig.installs;
	const installRecord = Object.hasOwn(installs ?? {}, installOwner) ? installs?.[installOwner] : void 0;
	if (installs && installRecord) {
		const { [installOwner]: _, ...rest } = installs;
		installs = Object.keys(rest).length > 0 ? rest : void 0;
		actions.install = true;
	}
	const trackedPaths = [installRecord?.installPath, installRecord?.source === "path" ? installRecord.sourcePath : void 0].filter((value) => Boolean(value));
	const loadResult = removeMatchingLoadPaths(pluginsConfig.load, trackedPaths);
	actions.loadPath = loadResult.changed;
	const cleanedPlugins = {
		...pluginsConfig,
		installs,
		load: loadResult.load
	};
	for (const key of ["installs", "load"]) if (cleanedPlugins[key] === void 0) delete cleanedPlugins[key];
	if (!Object.values(actions).some(Boolean)) return {
		config: cfg,
		actions
	};
	return {
		config: {
			...cfg,
			plugins: Object.keys(cleanedPlugins).length > 0 ? cleanedPlugins : void 0
		},
		actions
	};
}
//#endregion
//#region src/plugins/uninstall-config.ts
/** Remove plugin references from config without loading uninstall process/runtime dependencies. */
function removePluginFromConfig(cfg, pluginId, opts) {
	const policy = removePluginRuntimePolicyFromConfig(cfg, pluginId, { ...Object.hasOwn(cfg.plugins?.installs ?? {}, pluginId) ? opts : { channelIds: [] } });
	const owner = removePluginInstallOwnerFromConfig(policy.config, pluginId);
	return {
		config: owner.config,
		actions: mergePluginConfigUninstallActions(policy.actions, owner.actions)
	};
}
//#endregion
export { removePluginInstallOwnerFromConfig as a, mergePluginConfigUninstallActions as i, hasMatchingPluginLoadPath as n, removePluginRuntimePolicyFromConfig as o, isUninstallPathInsideOrEqual as r, resolveUninstallChannelConfigKeys as s, removePluginFromConfig as t };
