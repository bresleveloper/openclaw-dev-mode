import { o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { l as normalizeSortedUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { n as getPluginRuntimeLoadContextState } from "./load-context-state-Dj3BDflJ.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { X as resolveConfigEnvVars } from "./redact-B5EGyLvV.mjs";
import { f as resolvePluginRuntimeArtifactPreference, m as resolvePluginRuntimeExecutionArtifact, p as resolvePluginRuntimeArtifactSelection } from "./bundled-dir-BGJkK8G5.mjs";
import { o as createConfigRuntimeEnv } from "./config-env-vars-BHI12YH5.mjs";
import { d as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as normalizePluginsConfig, n as createPluginActivationSource, t as applyTestPluginDefaults } from "./config-state-BEAL5gWH.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { n as resolvePluginDiscoveryContext } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { i as getCurrentPluginMetadataSnapshot, p as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-D2uZ1zpS.mjs";
import "./env-vars-jrzBxc1h.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-CpKxe5XX.mjs";
import { s as getPluginLoaderCacheState } from "./registry-lifecycle-xdpzLZzd.mjs";
import { f as getActivePluginRegistryWorkspaceDir, l as getActivePluginRegistry, u as getActivePluginRegistryKey } from "./runtime-B2zZQffc.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { t as resolvePluginRegistrationConfigKey } from "./loader-registration-config-Cnug19UU.mjs";
import { n as getPluginRegistryRuntime } from "./registry-runtime-binding-i7RQa2C4.mjs";
import { createHash } from "node:crypto";
//#region src/plugins/loader-load-context.ts
const runtimeBindingCacheIds = /* @__PURE__ */ new WeakMap();
let nextRuntimeBindingCacheId = 1;
function resolveRuntimeBindingCacheId(value) {
	if (!value) return;
	const existing = runtimeBindingCacheIds.get(value);
	if (existing !== void 0) return existing;
	const id = nextRuntimeBindingCacheId++;
	runtimeBindingCacheIds.set(value, id);
	return id;
}
function buildActivationMetadataHash(params) {
	const sourceChannelEnablement = Object.entries(params.activationSource.rootConfig?.channels ?? {}).flatMap(([channelId, value]) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return [];
		const enabled = value.enabled;
		return typeof enabled === "boolean" ? [[channelId, enabled]] : [];
	}).toSorted(([left], [right]) => left.localeCompare(right));
	const pluginEntryInputs = Object.entries(params.activationSource.plugins.entries).map(([pluginId, { enabled }]) => [pluginId, enabled]).toSorted(([left], [right]) => left.localeCompare(right));
	const autoEnableReasonEntries = Object.entries(params.autoEnabledReasons).map(([pluginId, reasons]) => [pluginId, [...reasons]]).toSorted(([left], [right]) => left.localeCompare(right));
	return createHash("sha256").update(JSON.stringify({
		enabled: params.activationSource.plugins.enabled,
		allow: params.activationSource.plugins.allow,
		deny: params.activationSource.plugins.deny,
		memorySlot: params.activationSource.plugins.slots.memory,
		entries: pluginEntryInputs,
		channelEnablement: sourceChannelEnablement,
		autoEnabledReasons: autoEnableReasonEntries
	})).digest("hex");
}
function buildCacheKeys(params) {
	const { roots, loadPaths, devSourceRoot } = params.discoveryContext;
	const installs = Object.fromEntries(Object.entries(params.installs ?? {}).map(([pluginId, install]) => [pluginId, {
		...install,
		installPath: typeof install.installPath === "string" ? resolveUserPath(install.installPath, params.env) : install.installPath,
		sourcePath: typeof install.sourcePath === "string" ? resolveUserPath(install.sourcePath, params.env) : install.sourcePath
	}]));
	const cacheIdentity = {
		roots,
		devSourceRoot,
		plugins: {
			...params.plugins,
			loadPaths,
			entries: Object.entries(params.plugins.entries).map(([id, entry]) => [id, entry.enabled])
		},
		registrationConfigKey: params.registrationConfigKey,
		installs,
		discoverySources: params.discovery?.candidates.map((candidate) => [
			candidate.effectivePluginId ?? candidate.idHint,
			candidate.origin,
			candidate.rootDir,
			candidate.source,
			candidate.setupSource,
			candidate.sourcePreferred,
			candidate.configSelected,
			candidate.packageManifest?.build?.bundledDist
		]),
		activationMetadataKey: params.activationMetadataKey ?? "",
		capabilityCatalogIdentity: params.capabilityCatalogIdentity,
		allowProcessHomeSessionCatalogs: params.allowProcessHomeSessionCatalogs !== false,
		onlyPluginIds: params.onlyPluginIds,
		includeSetupOnlyChannelPlugins: params.includeSetupOnlyChannelPlugins === true,
		forceSetupOnlyChannelPlugins: params.forceSetupOnlyChannelPlugins === true,
		channelPluginLoadIntent: params.channelPluginLoadIntent,
		artifactPreference: params.artifactPreference,
		resolveRawConfigEnvVars: params.resolveRawConfigEnvVars === true,
		loadModules: params.loadModules !== false,
		toolDiscovery: params.toolDiscovery === true,
		runtimeSubagentMode: params.runtimeSubagentMode ?? "default",
		runtimeBindingIdentity: params.runtimeBindingIdentity ?? "{}",
		pluginSdkResolution: params.pluginSdkResolution ?? "auto",
		coreGatewayMethodNames: params.coreGatewayMethodNames ?? [],
		activate: params.activate !== false,
		runtimeSideEffects: params.runtimeSideEffects,
		mode: params.mode,
		expectedSourceDigests: params.expectedSourceDigests ? Object.entries(params.expectedSourceDigests).toSorted(([a], [b]) => a.localeCompare(b)) : void 0
	};
	const requestIdentity = JSON.stringify(cacheIdentity);
	const resolveManifestCacheKey = (manifestRegistry) => createHash("sha256").update(requestIdentity).update(JSON.stringify(manifestRegistry?.plugins.map((plugin) => [
		plugin.id,
		plugin.origin,
		plugin.rootDir,
		plugin.source,
		plugin.setupSource,
		plugin.providerDiscoverySource,
		plugin.capabilityCatalogSource,
		plugin.sourcePreferred,
		plugin.packageManifest?.build?.bundledDist
	])) ?? "").digest("hex");
	return {
		cacheKey: resolveManifestCacheKey(params.manifestRegistry),
		resolveManifestCacheKey
	};
}
function resolveRuntimeSubagentMode(runtimeOptions) {
	if (runtimeOptions?.allowGatewaySubagentBinding === true) return "gateway-bindable";
	return runtimeOptions?.subagent ? "explicit" : "default";
}
function resolveCoreGatewayMethodNames(options) {
	const names = new Set(options.coreGatewayMethodNames ?? []);
	for (const name of Object.keys(options.coreGatewayHandlers ?? {})) names.add(name);
	return Array.from(names).sort();
}
function mergePluginTrustList(runtimeList, sourceList) {
	if (runtimeList === sourceList || sourceList.length === 0) return runtimeList;
	const merged = [...runtimeList];
	const seen = new Set(merged);
	for (const entry of sourceList) if (!seen.has(entry)) {
		merged.push(entry);
		seen.add(entry);
	}
	return merged.length === runtimeList.length ? runtimeList : merged;
}
function mergeTrustPluginConfigFromActivationSource(params) {
	const source = params.activationSource.plugins;
	const allow = mergePluginTrustList(params.normalized.allow, source.allow);
	const deny = mergePluginTrustList(params.normalized.deny, source.deny);
	const loadPaths = mergePluginTrustList(params.normalized.loadPaths, source.loadPaths);
	if (allow === params.normalized.allow && deny === params.normalized.deny && loadPaths === params.normalized.loadPaths) return params.normalized;
	return {
		...params.normalized,
		allow,
		deny,
		loadPaths
	};
}
function resolvePluginLoadCacheContext(options = {}) {
	const cacheState = getPluginLoaderCacheState();
	const shouldResolveRawConfigEnvVars = options.resolveRawConfigEnvVars === true;
	const baseEnv = options.env ?? process.env;
	const rawConfig = options.config ?? {};
	const rawActivationSourceConfig = resolvePluginActivationSourceConfig({
		config: options.config,
		activationSourceConfig: options.activationSourceConfig
	});
	const env = shouldResolveRawConfigEnvVars ? createConfigRuntimeEnv(rawConfig, baseEnv) : baseEnv;
	const runtimeConfig = applyTestPluginDefaults(shouldResolveRawConfigEnvVars ? resolveConfigEnvVars(rawConfig, env, { onMissing: () => void 0 }) : rawConfig, env);
	const activationConfig = shouldResolveRawConfigEnvVars ? resolveConfigEnvVars(rawActivationSourceConfig, env, { onMissing: () => void 0 }) : rawActivationSourceConfig;
	const cfg = captureRuntimeConfig(runtimeConfig);
	const activationSourceConfig = activationConfig === runtimeConfig ? cfg : captureRuntimeConfig(activationConfig);
	const normalized = normalizePluginsConfig(cfg.plugins);
	const activationSource = createPluginActivationSource({
		config: activationSourceConfig,
		plugins: cfg.plugins === activationSourceConfig.plugins ? normalized : void 0
	});
	const trustNormalized = mergeTrustPluginConfigFromActivationSource({
		normalized,
		activationSource
	});
	const onlyPluginIds = normalizePluginIdScope(options.onlyPluginIds);
	const includeSetupOnlyChannelPlugins = options.includeSetupOnlyChannelPlugins === true;
	const forceSetupOnlyChannelPlugins = options.forceSetupOnlyChannelPlugins === true;
	const channelPluginLoadIntent = options.channelPluginLoadIntent ?? "full";
	const artifactPreference = resolvePluginRuntimeArtifactPreference(options.preferBuiltPluginArtifacts);
	const runtimeSubagentMode = resolveRuntimeSubagentMode(options.runtimeOptions);
	const activeRegistry = runtimeSubagentMode === "gateway-bindable" && options.mode !== "cli-metadata" && (!options.runtimeOptions?.nodes || !options.runtimeOptions?.subagent) ? getActivePluginRegistry() : void 0;
	const borrowedGatewayRuntime = activeRegistry ? getPluginRegistryRuntime(activeRegistry) : void 0;
	const coreGatewayMethodNames = resolveCoreGatewayMethodNames(options);
	const currentMetadataSnapshot = options.installRecords === void 0 && trustNormalized.loadPaths === normalized.loadPaths && !shouldResolveRawConfigEnvVars && (options.env === void 0 || options.env === process.env) ? getCurrentPluginMetadataSnapshot({
		config: rawConfig,
		env,
		workspaceDir: options.workspaceDir
	}) ?? (onlyPluginIds !== void 0 ? getCurrentPluginMetadataSnapshot({
		config: rawConfig,
		env,
		workspaceDir: options.workspaceDir,
		pluginIds: onlyPluginIds
	}) : void 0) : void 0;
	const preparedInstallRecords = currentMetadataSnapshot && (options.manifestRegistry === void 0 || options.manifestRegistry === currentMetadataSnapshot.manifestRegistry) ? extractPluginInstallRecordsFromInstalledPluginIndex(currentMetadataSnapshot.index) : void 0;
	const installRecords = {
		...options.installRecords ?? preparedInstallRecords ?? loadInstalledPluginIndexInstallRecordsSync({ env }),
		...cfg.plugins?.installs
	};
	const discoveryContext = resolvePluginDiscoveryContext({
		workspaceDir: options.workspaceDir,
		loadPaths: trustNormalized.loadPaths,
		env
	});
	const registrationConfigKey = resolvePluginRegistrationConfigKey({
		runtimeEntries: normalized.entries,
		sourceEntries: activationSource.plugins.entries
	});
	const shouldActivate = options.mode !== "cli-metadata" && options.activate !== false;
	const runtimeSideEffects = options.runtimeSideEffects ?? shouldActivate;
	const { cacheKey, resolveManifestCacheKey } = buildCacheKeys({
		discoveryContext,
		plugins: trustNormalized,
		registrationConfigKey,
		activationMetadataKey: buildActivationMetadataHash({
			activationSource,
			autoEnabledReasons: options.autoEnabledReasons ?? {}
		}),
		installs: installRecords,
		manifestRegistry: options.manifestRegistry ?? (options.discovery === void 0 ? currentMetadataSnapshot?.manifestRegistry : void 0),
		discovery: options.manifestRegistry ? void 0 : options.discovery,
		env,
		onlyPluginIds,
		includeSetupOnlyChannelPlugins,
		forceSetupOnlyChannelPlugins,
		channelPluginLoadIntent,
		artifactPreference,
		resolveRawConfigEnvVars: options.resolveRawConfigEnvVars,
		toolDiscovery: options.toolDiscovery,
		capabilityCatalogIdentity: options.capabilityCatalog ? JSON.stringify([
			options.capabilityCatalog.family,
			resolveRuntimeBindingCacheId(options.capabilityCatalog.context),
			resolveRuntimeBindingCacheId(getPluginCache()),
			resolveRuntimeBindingCacheId(getPluginRegistryForContext() ?? void 0)
		]) : void 0,
		loadModules: options.loadModules,
		runtimeSubagentMode,
		runtimeBindingIdentity: JSON.stringify({
			capabilityCatalogContext: resolveRuntimeBindingCacheId(options.capabilityCatalogContext),
			modelAuth: resolveRuntimeBindingCacheId(options.runtimeOptions?.modelAuth),
			modelConfig: resolveRuntimeBindingCacheId(options.runtimeOptions?.modelConfig),
			nodes: resolveRuntimeBindingCacheId(options.runtimeOptions?.nodes),
			subagent: resolveRuntimeBindingCacheId(options.runtimeOptions?.subagent),
			borrowedGatewayRuntime: shouldActivate ? void 0 : resolveRuntimeBindingCacheId(borrowedGatewayRuntime)
		}),
		pluginSdkResolution: options.pluginSdkResolution,
		coreGatewayMethodNames,
		allowProcessHomeSessionCatalogs: options.allowProcessHomeSessionCatalogs,
		activate: shouldActivate,
		runtimeSideEffects,
		expectedSourceDigests: options.expectedSourceDigests,
		mode: options.mode ?? "full"
	});
	return {
		cacheState,
		env,
		cfg,
		registrationConfigKey,
		metadataSnapshot: currentMetadataSnapshot,
		normalized: trustNormalized,
		activationSourceConfig,
		activationSource,
		autoEnabledReasons: options.autoEnabledReasons ?? {},
		onlyPluginIds,
		includeSetupOnlyChannelPlugins,
		forceSetupOnlyChannelPlugins,
		channelPluginLoadIntent,
		artifactPreference,
		shouldActivate,
		runtimeSideEffects,
		shouldLoadModules: options.loadModules !== false,
		runtimeSubagentMode,
		borrowedGatewayRuntime,
		installRecords,
		devSourceRoot: discoveryContext.devSourceRoot,
		cacheKey,
		resolveManifestCacheKey
	};
}
//#endregion
//#region src/plugins/plugin-runtime-artifact-binding.ts
const RUNTIME_ARTIFACT_SELECTION = Symbol.for("openclaw.pluginRuntimeArtifactSelection");
/** Preserve selection inputs on the loaded owner, outside status/protocol serialization. */
function bindPluginRuntimeArtifactSelection(record, params) {
	const selection = {
		sourcePreferred: params.sourcePreferred === true,
		sourceExternal: params.packageManifest?.build?.bundledDist === false,
		runtimeEntry: params.runtimeEntry,
		setupEntry: params.setupEntry,
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts,
		runtimeRegistrationComplete: false
	};
	Object.defineProperty(record, RUNTIME_ARTIFACT_SELECTION, { value: selection });
	return selection;
}
function hasCompletedPluginRuntimeRegistration(record) {
	return record.status === "loaded" && record[RUNTIME_ARTIFACT_SELECTION]?.runtimeRegistrationComplete === true;
}
function getPluginRuntimeEntrySource(record) {
	return record[RUNTIME_ARTIFACT_SELECTION]?.runtimeEntry.source;
}
/** Acquire recovery custody before shutdown revokes the previous runtime's module loader. */
function capturePluginRuntimeRecovery(record) {
	const instance = getPluginInstance(record);
	const selection = record[RUNTIME_ARTIFACT_SELECTION];
	if (!instance || !selection) return;
	return {
		module: instance.captureModuleLoaderRecovery(),
		runtimeEntry: { ...selection.runtimeEntry },
		...selection.setupEntry ? { setupEntry: { ...selection.setupEntry } } : {}
	};
}
function matchesPluginRuntimeArtifactSelection(record, params, preferBuiltPluginArtifacts) {
	const loaded = record[RUNTIME_ARTIFACT_SELECTION];
	if (loaded?.sourcePreferred === true !== (params.sourcePreferred === true) || loaded?.sourceExternal === true !== (params.packageManifest?.build?.bundledDist === false) || preferBuiltPluginArtifacts !== void 0 && loaded?.preferBuiltPluginArtifacts !== preferBuiltPluginArtifacts) return false;
	if (!loaded) return record.format === "bundle" && record.rootDir === params.rootDir && record.source === params.source;
	const matchesEntry = (entry, source, entryKind) => {
		const selected = resolvePluginRuntimeExecutionArtifact(resolvePluginRuntimeArtifactSelection({
			...params,
			source,
			entryKind,
			origin: record.origin,
			preferBuiltPluginArtifacts: loaded.preferBuiltPluginArtifacts === true
		}));
		return entry.rootDir === selected.rootDir && entry.source === selected.source;
	};
	return matchesEntry(loaded.runtimeEntry, params.source, "runtime") && (!loaded.setupEntry || params.setupSource !== void 0 && matchesEntry(loaded.setupEntry, params.setupSource, "setup"));
}
//#endregion
//#region src/plugins/active-runtime-registry.ts
function getActiveRuntimePluginRegistry() {
	return getActivePluginRegistry();
}
/** Return the exact active registry without triggering a fresh load on cache miss. */
function resolveCompatibleRuntimePluginRegistry(options) {
	const activeRegistry = getActivePluginRegistry() ?? void 0;
	if (!activeRegistry || options === void 0) return activeRegistry;
	const activeCacheKey = getActivePluginRegistryKey();
	if (!activeCacheKey) return;
	const requestedKey = resolvePluginLoadCacheContext(options).cacheKey;
	if (requestedKey === activeCacheKey) return activeRegistry;
	const identity = getPluginRuntimeLoadContextState(activeRegistry)?.loaderCacheIdentity;
	return identity && (identity.requestKey === activeCacheKey && identity.resolvedKey === requestedKey || identity.resolvedKey === activeCacheKey && identity.requestKey === requestedKey) ? activeRegistry : void 0;
}
function isRuntimePluginRecordLoaded(plugin) {
	return plugin.status === "loaded" && (plugin.format === "bundle" || plugin.imported !== false);
}
/** Lists runtime-loaded plugin ids from an immutable/request-scoped registry handle. */
function listRuntimePluginIdsFromRegistry(registry) {
	return normalizeSortedUniqueStringEntries(registry.plugins.filter(isRuntimePluginRecordLoaded).map((plugin) => plugin.id));
}
function listLoadedRuntimePluginIds() {
	const registry = getActivePluginRegistry();
	return registry ? listRuntimePluginIdsFromRegistry(registry) : [];
}
function normalizeRequiredPluginIds(ids) {
	if (ids === void 0) return;
	return normalizeSortedUniqueStringEntries(ids);
}
function registryContainsRuntimePluginIds(registry, pluginIds) {
	if (pluginIds === void 0) return true;
	if (pluginIds.length === 0 && registry.plugins.length > 0) return false;
	const missing = new Set(pluginIds);
	for (const plugin of registry.plugins) if (plugin.status === void 0 || isRuntimePluginRecordLoaded(plugin)) missing.delete(plugin.id);
	if (pluginIds.length > 0 && missing.size === 0) return true;
	if (registry.plugins.some((plugin) => missing.has(plugin.id))) return false;
	for (const [key, value] of Object.entries(registry)) {
		if (key === "diagnostics" || key === "channelSetups" || !Array.isArray(value)) continue;
		for (const entry of value) if (entry && typeof entry === "object" && "pluginId" in entry) {
			const pluginId = entry.pluginId;
			if (typeof pluginId === "string" && pluginId.length > 0) {
				if (pluginIds.length === 0) return false;
				missing.delete(pluginId);
				if (missing.size === 0) return true;
			}
		}
	}
	return pluginIds.length === 0;
}
/** Indexes selected owners; omitted artifact preference retains the loaded owner's policy. */
function createRuntimePluginManifestLookup(registry, manifestPlugins, preferBuiltPluginArtifacts) {
	const records = new Map(registry.plugins.filter(isRuntimePluginRecordLoaded).map((plugin) => [plugin.id, plugin]));
	const manifests = new Map(manifestPlugins.toReversed().map((plugin) => [plugin.id, plugin]));
	return (pluginId) => {
		const record = records.get(pluginId);
		const manifest = manifests.get(pluginId);
		return record && manifest && record.origin === manifest.origin && matchesPluginRuntimeArtifactSelection(record, manifest, preferBuiltPluginArtifacts) ? record : void 0;
	};
}
function getLoadedRuntimePluginRegistry(params = {}) {
	const requiredPluginIds = normalizeRequiredPluginIds(params.requiredPluginIds ?? params.loadOptions?.onlyPluginIds);
	if (params.loadOptions && requiredPluginIds === void 0) return resolveCompatibleRuntimePluginRegistry(params.loadOptions);
	const activeWorkspaceDir = getActivePluginRegistryWorkspaceDir();
	const requestedWorkspaceDir = params.workspaceDir ?? params.loadOptions?.workspaceDir;
	if ((Object.hasOwn(params, "workspaceDir") || params.loadOptions || requestedWorkspaceDir !== void 0) && activeWorkspaceDir !== requestedWorkspaceDir) return;
	const registry = getActivePluginRegistry();
	if (!registry) return;
	if (!registryContainsRuntimePluginIds(registry, requiredPluginIds) || params.loadOptions?.manifestRegistry && requiredPluginIds !== void 0 && !requiredPluginIds.every(createRuntimePluginManifestLookup(registry, params.loadOptions.manifestRegistry.plugins, params.loadOptions.preferBuiltPluginArtifacts))) return;
	if (params.loadOptions?.discovery && !params.loadOptions.manifestRegistry) return resolveCompatibleRuntimePluginRegistry(params.loadOptions);
	return registry;
}
//#endregion
export { listRuntimePluginIdsFromRegistry as a, bindPluginRuntimeArtifactSelection as c, hasCompletedPluginRuntimeRegistration as d, resolvePluginLoadCacheContext as f, listLoadedRuntimePluginIds as i, capturePluginRuntimeRecovery as l, getActiveRuntimePluginRegistry as n, registryContainsRuntimePluginIds as o, resolveRuntimeSubagentMode as p, getLoadedRuntimePluginRegistry as r, resolveCompatibleRuntimePluginRegistry as s, createRuntimePluginManifestLookup as t, getPluginRuntimeEntrySource as u };
