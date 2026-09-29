import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { i as resolvePackageExtensionEntries } from "./package-manifest-C8sTeZKW.mjs";
import { o as resetPluginSlotsToDefaults } from "./slots-D4OMSTbt.mjs";
import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import "./manifest-DHkEL08H.mjs";
import { a as resolveDefaultPluginExtensionsDir, c as resolvePluginInstallDir } from "./install-paths-DnOgVB7K.mjs";
import { i as validatePackageExtensionEntriesForInstall } from "./package-entry-resolution-D32N9wpN.mjs";
import { o as reconcileRegisteredOpenClawHostLinks } from "./plugin-peer-link-C9fwm_tB.mjs";
import { t as setPluginEnabledInConfig } from "./toggle-config-CKuWGLOi.mjs";
import "./install-Bt8Oq4jr.mjs";
import path from "node:path";
//#region src/plugins/externalized-bundled-plugins.ts
function normalizePluginId(value) {
	return value?.trim() ?? "";
}
function normalizeOptionalSpec(value) {
	return value?.trim() ?? "";
}
function getExternalizedBundledPluginNpmSpec(bridge) {
	return normalizeOptionalSpec(bridge.npmSpec);
}
function getExternalizedBundledPluginClawHubSpec(bridge) {
	return normalizeOptionalSpec(bridge.clawhubSpec);
}
function getExternalizedBundledPluginTargetId(bridge) {
	return normalizePluginId(bridge.pluginId) || normalizePluginId(bridge.bundledPluginId);
}
function getExternalizedBundledPluginLookupIds(bridge) {
	return Array.from(new Set([
		bridge.bundledPluginId,
		bridge.pluginId,
		...bridge.legacyPluginIds ?? [],
		...bridge.channelIds ?? []
	].map(normalizePluginId).filter(Boolean)));
}
function getExternalizedBundledPluginLegacyPathSuffix(bridge) {
	return ["extensions", bridge.bundledDirName ?? bridge.bundledPluginId].join("/");
}
//#endregion
//#region src/plugins/update-config.ts
async function hasRunnableInstalledNpmPayload(params) {
	const extensions = resolvePackageExtensionEntries(params.manifest);
	if (extensions.status !== "ok") return false;
	return (await validatePackageExtensionEntriesForInstall({
		packageDir: params.installPath,
		extensions: extensions.entries,
		manifest: params.manifest ?? {}
	})).ok;
}
function userPathsEqual(left, right, env = process.env) {
	if (!left || !right) return false;
	return resolveUserPath(left, env) === resolveUserPath(right, env);
}
function resolveRecordedExtensionsDir(params) {
	const parentDir = path.dirname(params.installPath);
	try {
		return userPathsEqual(resolvePluginInstallDir(params.pluginId, parentDir), params.installPath) ? parentDir : void 0;
	} catch {
		return;
	}
}
function buildLoadPathHelpers(existing, env = process.env) {
	let paths = [...existing];
	const resolveSet = () => new Set(paths.map((entry) => resolveUserPath(entry, env)));
	let resolved = resolveSet();
	let changed = false;
	const addPath = (value) => {
		const normalized = resolveUserPath(value, env);
		if (resolved.has(normalized)) return;
		paths.push(value);
		resolved.add(normalized);
		changed = true;
	};
	const removePath = (value) => {
		const normalized = resolveUserPath(value, env);
		if (!resolved.has(normalized)) return;
		paths = paths.filter((entry) => resolveUserPath(entry, env) !== normalized);
		resolved = resolveSet();
		changed = true;
	};
	const removeMatching = (predicate) => {
		const next = paths.filter((entry) => !predicate(entry));
		if (next.length === paths.length) return;
		paths = next;
		resolved = resolveSet();
		changed = true;
	};
	return {
		addPath,
		removePath,
		removeMatching,
		get changed() {
			return changed;
		},
		get paths() {
			return paths;
		}
	};
}
function normalizePathSegment(value) {
	return value?.trim().replaceAll("\\", "/").replace(/^\/+|\/+$/g, "") ?? "";
}
function pathEndsWithSegment(params) {
	const value = normalizePathSegment(params.value ? resolveUserPath(params.value, params.env) : "");
	const segment = normalizePathSegment(params.segment);
	return Boolean(value && segment && (value === segment || value.endsWith(`/${segment}`)));
}
function isBridgeBundledPathRecord(params) {
	if (params.record.source !== "path") return false;
	if (params.bundledLocalPath && (userPathsEqual(params.record.sourcePath, params.bundledLocalPath, params.env) || userPathsEqual(params.record.installPath, params.bundledLocalPath, params.env))) return true;
	const bundledPathSuffix = getExternalizedBundledPluginLegacyPathSuffix(params.bridge);
	return pathEndsWithSegment({
		value: params.record.sourcePath,
		segment: bundledPathSuffix,
		env: params.env
	}) || pathEndsWithSegment({
		value: params.record.installPath,
		segment: bundledPathSuffix,
		env: params.env
	});
}
function removeBridgeBundledLoadPaths(params) {
	const bundledPathSuffix = getExternalizedBundledPluginLegacyPathSuffix(params.bridge);
	params.loadPaths.removeMatching((entry) => pathEndsWithSegment({
		value: entry,
		segment: bundledPathSuffix,
		env: params.env
	}));
}
function resolveBridgeInstallRecord(params) {
	for (const pluginId of getExternalizedBundledPluginLookupIds(params.bridge)) {
		if (!Object.hasOwn(params.installs, pluginId)) continue;
		const record = params.installs[pluginId];
		if (record) return {
			pluginId,
			record
		};
	}
}
function isBridgeChannelEnabledByConfig(params) {
	const channels = params.config.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return false;
	for (const channelId of params.bridge.channelIds ?? []) {
		const entry = channels[channelId];
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
		if (Object.is(entry.enabled, true)) return true;
	}
	return false;
}
function isExternalizedBundledPluginEnabled(params) {
	const normalized = normalizePluginsConfig(params.config.plugins);
	if (!normalized.enabled) return false;
	const pluginIds = getExternalizedBundledPluginLookupIds(params.bridge);
	if (pluginIds.some((pluginId) => normalized.deny.includes(pluginId) || Object.is(normalized.entries[pluginId]?.enabled, false))) return false;
	for (const pluginId of pluginIds) if (resolveEffectiveEnableState({
		id: pluginId,
		origin: "bundled",
		config: normalized,
		rootConfig: params.config,
		enabledByDefault: params.bridge.enabledByDefault
	}).enabled) return true;
	if (isBridgeChannelEnabledByConfig(params)) return true;
	return false;
}
function replacePluginIdInList(entries, fromId, toId) {
	if (!entries || entries.length === 0 || fromId === toId || !entries.includes(fromId)) return entries;
	const next = [];
	for (const entry of entries) {
		const value = entry === fromId ? toId : entry;
		if (!next.includes(value)) next.push(value);
	}
	return next;
}
function migratePluginConfigId(cfg, fromId, toId) {
	const plugins = cfg.plugins;
	if (fromId === toId || !plugins) return cfg;
	let nextPlugins = plugins;
	const ensureNextPlugins = () => {
		if (nextPlugins === plugins) nextPlugins = { ...plugins };
		return nextPlugins;
	};
	const installs = plugins.installs;
	if (installs && Object.hasOwn(installs, fromId)) {
		const record = installs[fromId];
		const nextInstalls = { ...installs };
		if (record && !Object.hasOwn(installs, toId)) Object.defineProperty(nextInstalls, toId, {
			configurable: true,
			enumerable: true,
			value: record,
			writable: true
		});
		delete nextInstalls[fromId];
		ensureNextPlugins().installs = nextInstalls;
	}
	const entries = plugins.entries;
	if (entries && Object.hasOwn(entries, fromId)) {
		const entry = entries[fromId];
		const existingEntry = Object.hasOwn(entries, toId) ? entries[toId] : void 0;
		const nextEntries = { ...entries };
		if (entry) Object.defineProperty(nextEntries, toId, {
			configurable: true,
			enumerable: true,
			value: existingEntry ? {
				...entry,
				...existingEntry
			} : entry,
			writable: true
		});
		delete nextEntries[fromId];
		ensureNextPlugins().entries = nextEntries;
	}
	const allow = replacePluginIdInList(plugins.allow, fromId, toId);
	if (allow !== plugins.allow) ensureNextPlugins().allow = allow;
	const deny = replacePluginIdInList(plugins.deny, fromId, toId);
	if (deny !== plugins.deny) ensureNextPlugins().deny = deny;
	const slots = plugins.slots;
	if (slots?.memory === fromId || slots?.contextEngine === fromId) ensureNextPlugins().slots = {
		...slots,
		...slots.memory === fromId ? { memory: toId } : {},
		...slots.contextEngine === fromId ? { contextEngine: toId } : {}
	};
	return nextPlugins === plugins ? cfg : {
		...cfg,
		plugins: nextPlugins
	};
}
function disablePluginAfterUpdateFailure(config, pluginId) {
	const disabled = setPluginEnabledInConfig(config, pluginId, false, { updateChannelConfig: false });
	const pluginsConfig = disabled.plugins ?? {};
	return {
		...disabled,
		plugins: {
			...pluginsConfig,
			slots: resetPluginSlotsToDefaults(pluginsConfig.slots, pluginId)
		}
	};
}
/** Repairs a legacy npm-owned extensions-root host without reinstalling its package. */
async function repairRegisteredOpenClawHostLink(params) {
	return (await reconcileRegisteredOpenClawHostLinks({
		installRecords: { [params.pluginId]: params.record },
		extensionsDir: resolveDefaultPluginExtensionsDir(),
		mode: "repair",
		logger: params.logger,
		beforePersistentApply: params.beforePersistentEffect
	})).repaired > 0;
}
async function repairOpenClawPeerLinksForNpmInstalls(params) {
	return (await reconcileRegisteredOpenClawHostLinks({
		installRecords: params.config.plugins?.installs ?? {},
		extensionsDir: resolveDefaultPluginExtensionsDir(),
		mode: "repair",
		logger: params.logger,
		beforePersistentApply: params.beforePersistentEffect,
		onPackageReadError: (error, packageDir) => {
			params.logger.warn?.(`Could not repair openclaw peer link at ${packageDir}: ${String(error)}`);
		}
	})).repaired > 0;
}
//#endregion
export { isExternalizedBundledPluginEnabled as a, repairOpenClawPeerLinksForNpmInstalls as c, resolveRecordedExtensionsDir as d, userPathsEqual as f, getExternalizedBundledPluginTargetId as h, isBridgeBundledPathRecord as i, repairRegisteredOpenClawHostLink as l, getExternalizedBundledPluginNpmSpec as m, disablePluginAfterUpdateFailure as n, migratePluginConfigId as o, getExternalizedBundledPluginClawHubSpec as p, hasRunnableInstalledNpmPayload as r, removeBridgeBundledLoadPaths as s, buildLoadPathHelpers as t, resolveBridgeInstallRecord as u };
