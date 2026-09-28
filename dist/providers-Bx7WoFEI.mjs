import { v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { Q as compileSafeRegex } from "./redact-B5EGyLvV.mjs";
import { d as resolveEffectivePluginActivationState } from "./config-state-BEAL5gWH.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { a as loadPluginRegistrySnapshotWithMetadata, i as loadPluginRegistrySnapshot } from "./plugin-registry-snapshot-BAw04cGV.mjs";
import { r as loadPluginManifestRegistryForInstalledIndex } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { i as getCurrentPluginMetadataSnapshot, u as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { r as pluginOwnsProviderRef } from "./provider-owner-index-eVSJvcfU.mjs";
import { i as passesManifestOwnerBasePolicy, n as isActivatedManifestOwner } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { r as normalizePluginsConfigWithRegistry } from "./plugin-registry-contributions-CHC0CCKR.mjs";
import "./plugin-registry-CVPVm6lt.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
//#region src/plugins/providers.ts
function loadProviderRegistrySnapshot(params) {
	if (params.registry) return params.registry;
	return loadPluginRegistrySnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
}
function loadScopedProviderRegistry(params) {
	return {
		registry: loadProviderRegistrySnapshot(params),
		onlyPluginIdSet: createPluginIdScopeSet(params.onlyPluginIds)
	};
}
function listRegistryPluginIds(registry, predicate) {
	return registry.plugins.filter(predicate).map((plugin) => plugin.pluginId).toSorted((left, right) => left.localeCompare(right));
}
function resolveProviderSurfacePluginIdSet(params) {
	return new Set(resolveManifestRegistry({
		...params,
		includeDisabled: true
	}).plugins.flatMap((plugin) => plugin.providers.length > 0 ? [plugin.id] : []));
}
function manifestPluginResolvesRuntimeModelCatalogAugment(plugin) {
	return plugin.modelCatalog?.runtimeAugment === true || plugin.origin !== "bundled" && plugin.providers.length > 0;
}
function resolveProviderOwnerPluginIds(params) {
	if (params.pluginIds.length === 0) return [];
	const pluginIdSet = new Set(params.pluginIds);
	const registry = loadProviderRegistrySnapshot(params);
	const normalizedConfig = normalizePluginsConfigWithRegistry(params.config?.plugins, registry, { manifestRegistry: params.manifestRegistry });
	return listRegistryPluginIds(registry, (plugin) => pluginIdSet.has(plugin.pluginId) && params.isEligible(plugin, normalizedConfig));
}
function resolveEffectiveRegistryPluginActivation(params) {
	return resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		channelIds: params.plugin.contributions?.channels,
		config: params.normalizedConfig,
		rootConfig: params.rootConfig,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin)
	});
}
function toManifestOwnerRecord(plugin) {
	return {
		id: plugin.pluginId,
		origin: plugin.origin,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin)
	};
}
function resolveBundledProviderCompatPluginIds(params) {
	if (params.manifestRegistry) {
		const onlyPluginIdSet = createPluginIdScopeSet(params.onlyPluginIds);
		return params.manifestRegistry.plugins.filter((plugin) => plugin.origin === "bundled" && plugin.providers.length > 0 && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.id))).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
	}
	const { registry, onlyPluginIdSet } = loadScopedProviderRegistry(params);
	const providerSurfacePluginIds = resolveProviderSurfacePluginIdSet({
		...params,
		registry
	});
	return listRegistryPluginIds(registry, (plugin) => plugin.origin === "bundled" && providerSurfacePluginIds.has(plugin.pluginId) && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.pluginId)));
}
function resolveEnabledProviderPluginIds(params) {
	const { registry, onlyPluginIdSet } = loadScopedProviderRegistry(params);
	const providerSurfacePluginIds = resolveProviderSurfacePluginIdSet({
		...params,
		registry
	});
	const normalizedConfig = normalizePluginsConfigWithRegistry(params.config?.plugins, registry, { manifestRegistry: params.manifestRegistry });
	return listRegistryPluginIds(registry, (plugin) => providerSurfacePluginIds.has(plugin.pluginId) && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.pluginId)) && resolveEffectiveRegistryPluginActivation({
		plugin,
		normalizedConfig,
		rootConfig: params.config
	}).activated);
}
function resolveExternalAuthProfileProviderPluginIds(params) {
	return resolveRegistryManifestContractPluginIds({
		...params,
		contract: "externalAuthProviders"
	});
}
function resolveRegistryManifestContractPluginIds(params) {
	const { registry, onlyPluginIdSet } = loadScopedProviderRegistry(params);
	return resolveManifestRegistry({
		...params,
		registry,
		includeDisabled: true
	}).plugins.filter((plugin) => {
		if (params.origin && plugin.origin !== params.origin) return false;
		if (onlyPluginIdSet && !onlyPluginIdSet.has(plugin.id)) return false;
		return (plugin.contracts?.[params.contract] ?? []).length > 0;
	}).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
function resolveDiscoveredProviderPluginIds(params) {
	const { registry, onlyPluginIdSet } = loadScopedProviderRegistry(params);
	const providerSurfacePluginIds = resolveProviderSurfacePluginIdSet({
		...params,
		registry
	});
	const shouldFilterUntrustedWorkspacePlugins = params.includeUntrustedWorkspacePlugins !== true;
	const normalizedConfig = normalizePluginsConfigWithRegistry(params.config?.plugins, registry, { manifestRegistry: params.manifestRegistry });
	return listRegistryPluginIds(registry, (plugin) => {
		if (!(providerSurfacePluginIds.has(plugin.pluginId) && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.pluginId)))) return false;
		return isProviderPluginEligibleForSetupDiscovery({
			plugin,
			shouldFilterUntrustedWorkspacePlugins,
			normalizedConfig,
			rootConfig: params.config
		});
	});
}
function isProviderPluginEligibleForSetupDiscovery(params) {
	if (params.plugin.origin === "workspace") {
		if (!params.shouldFilterUntrustedWorkspacePlugins) return true;
	}
	if (!passesManifestOwnerBasePolicy({
		plugin: toManifestOwnerRecord(params.plugin),
		normalizedConfig: params.normalizedConfig
	})) return false;
	if (params.plugin.origin === "bundled") return true;
	return isActivatedManifestOwner({
		plugin: toManifestOwnerRecord(params.plugin),
		normalizedConfig: params.normalizedConfig,
		rootConfig: params.rootConfig
	});
}
function resolveDiscoverableProviderOwnerPluginIds(params) {
	const shouldFilterUntrustedWorkspacePlugins = params.includeUntrustedWorkspacePlugins !== true;
	return resolveProviderOwnerPluginIds({
		...params,
		isEligible: (plugin, normalizedConfig) => isProviderPluginEligibleForSetupDiscovery({
			plugin,
			shouldFilterUntrustedWorkspacePlugins,
			normalizedConfig,
			rootConfig: params.config
		})
	});
}
function isProviderPluginEligibleForRuntimeOwnerActivation(params) {
	if (!passesManifestOwnerBasePolicy({
		plugin: toManifestOwnerRecord(params.plugin),
		normalizedConfig: params.normalizedConfig
	})) return false;
	if (params.plugin.origin !== "workspace") return true;
	return isActivatedManifestOwner({
		plugin: toManifestOwnerRecord(params.plugin),
		normalizedConfig: params.normalizedConfig,
		rootConfig: params.rootConfig
	});
}
function resolveActivatableProviderOwnerPluginIds(params) {
	return resolveProviderOwnerPluginIds({
		...params,
		isEligible: (plugin, normalizedConfig) => isProviderPluginEligibleForRuntimeOwnerActivation({
			plugin,
			normalizedConfig,
			rootConfig: params.config
		})
	});
}
function resolveManifestRegistry(params) {
	if (params.manifestRegistry) return params.manifestRegistry;
	if (params.metadataSnapshot) return params.metadataSnapshot.manifestRegistry;
	if (!params.registry) {
		const currentSnapshot = getCurrentPluginMetadataSnapshot({
			config: params.config,
			env: params.env,
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
			allowWorkspaceScopedSnapshot: true
		});
		if (currentSnapshot) return currentSnapshot.manifestRegistry;
	}
	const registry = params.registry ?? loadProviderRegistrySnapshot(params);
	return loadPluginManifestRegistryForInstalledIndex({
		index: registry,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includeDisabled: params.includeDisabled
	});
}
function stripModelProfileSuffix(value) {
	return splitTrailingAuthProfile(value).model;
}
function splitExplicitModelRef(rawModel) {
	const trimmed = rawModel.trim();
	if (!trimmed) return null;
	const slash = trimmed.indexOf("/");
	if (slash === -1) {
		const modelId = stripModelProfileSuffix(trimmed);
		return modelId ? { modelId } : null;
	}
	const provider = normalizeProviderId(trimmed.slice(0, slash));
	const modelId = stripModelProfileSuffix(trimmed.slice(slash + 1));
	if (!provider || !modelId) return null;
	return {
		provider,
		modelId
	};
}
function matchesModelPattern(plugin, modelId) {
	const patterns = plugin.modelSupport?.modelPatterns ?? [];
	for (const patternSource of patterns) if (compileSafeRegex(patternSource, "u")?.test(modelId)) return true;
	return false;
}
function classifyProviderRefOwnership(pluginIds) {
	if (!pluginIds || pluginIds.length === 0) return { status: "unowned" };
	if (pluginIds.length === 1) return {
		status: "owned",
		pluginIds
	};
	return {
		status: "ambiguous",
		pluginIds
	};
}
function listNormalizedOwnerMapPluginIds(owners, normalizedId) {
	const matched = [];
	for (const [ownedId, pluginIds] of owners) if (normalizeProviderId(ownedId) === normalizedId) matched.push(...pluginIds);
	return sortUniqueStrings(matched);
}
function resolveOwningPluginIdsForProviderFromSnapshot(snapshot, normalizedProvider) {
	const directOwners = listNormalizedOwnerMapPluginIds(snapshot.owners.providers, normalizedProvider);
	const aliasOwners = listNormalizedOwnerMapPluginIds(snapshot.owners.modelCatalogProviders, normalizedProvider).filter((pluginId) => {
		const plugin = snapshot.byPluginId.get(pluginId);
		return plugin ? pluginOwnsProviderRef(plugin, normalizedProvider) : false;
	});
	const pluginIds = sortUniqueStrings([...directOwners, ...aliasOwners]);
	return pluginIds.length > 0 ? pluginIds : void 0;
}
function resolvePreferredManifestPluginIds(registry, matchedPluginIds) {
	if (matchedPluginIds.length === 0) return;
	const uniquePluginIds = sortUniqueStrings(matchedPluginIds);
	if (uniquePluginIds.length <= 1) return uniquePluginIds;
	const nonBundledPluginIds = uniquePluginIds.filter((pluginId) => {
		return registry.plugins.find((entry) => entry.id === pluginId)?.origin !== "bundled";
	});
	if (nonBundledPluginIds.length === 1) return nonBundledPluginIds;
	if (nonBundledPluginIds.length > 1) return;
}
function resolveProviderOwnershipContext(params) {
	const metadataSnapshot = params.metadataSnapshot ?? (params.manifestRegistry ? void 0 : getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		allowWorkspaceScopedSnapshot: true
	}));
	const manifestRegistry = params.manifestRegistry ?? metadataSnapshot?.manifestRegistry;
	if (manifestRegistry) return {
		manifestRegistry,
		...metadataSnapshot ? { metadataSnapshot } : {}
	};
	const registryParams = {
		config: params.config ?? {},
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env
	};
	const loaded = loadPluginRegistrySnapshotWithMetadata(registryParams);
	return { manifestRegistry: loadPluginManifestRegistryForInstalledIndex({
		...registryParams,
		index: loaded.snapshot,
		manifestRegistry: loaded.manifestRegistry,
		includeDisabled: true
	}) };
}
function resolveOwningPluginIdsForProviderFromContext(normalizedProvider, context) {
	const metadataSnapshot = context.metadataSnapshot;
	if (metadataSnapshot) {
		const ownerIds = resolveOwningPluginIdsForProviderFromSnapshot(metadataSnapshot, normalizedProvider);
		if (ownerIds) return ownerIds;
	}
	const pluginIds = context.manifestRegistry.plugins.filter((plugin) => pluginOwnsProviderRef(plugin, normalizedProvider)).map((plugin) => plugin.id);
	return pluginIds.length > 0 ? pluginIds : void 0;
}
function resolveOwningPluginIdsForProvider(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	if (!normalizedProvider) return;
	return resolveOwningPluginIdsForProviderFromContext(normalizedProvider, resolveProviderOwnershipContext(params));
}
function resolveOwningPluginIdsForCliBackendFromContext(normalizedBackend, context) {
	const metadataSnapshot = context.metadataSnapshot;
	if (metadataSnapshot) {
		const ownerIds = listNormalizedOwnerMapPluginIds(metadataSnapshot.owners.cliBackends, normalizedBackend);
		if (ownerIds.length > 0) return ownerIds;
	}
	const pluginIds = context.manifestRegistry.plugins.filter((plugin) => plugin.cliBackends.some((backendId) => normalizeProviderId(backendId) === normalizedBackend) || (plugin.setup?.cliBackends ?? []).some((backendId) => normalizeProviderId(backendId) === normalizedBackend)).map((plugin) => plugin.id);
	const deduped = sortUniqueStrings(pluginIds);
	return deduped.length > 0 ? deduped : void 0;
}
function resolveOwningPluginIdsForProviderRef(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	if (!normalizedProvider) return;
	const context = resolveProviderOwnershipContext(params);
	return resolveOwningPluginIdsForProviderFromContext(normalizedProvider, context) ?? resolveOwningPluginIdsForCliBackendFromContext(normalizedProvider, context);
}
function resolveProviderRefOwnership(params) {
	return classifyProviderRefOwnership(resolveOwningPluginIdsForProviderRef(params));
}
function resolveOwningPluginIdsForModelRef(params) {
	const parsed = splitExplicitModelRef(params.model);
	if (!parsed) return;
	if (parsed.provider) return resolveOwningPluginIdsForProviderRef({
		provider: parsed.provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		manifestRegistry: params.manifestRegistry
	});
	const manifestRegistry = resolveManifestRegistry({
		...params,
		includeDisabled: true
	});
	const matchedByPattern = manifestRegistry.plugins.filter((plugin) => matchesModelPattern(plugin, parsed.modelId));
	const preferredPatternPluginIds = resolvePreferredManifestPluginIds(manifestRegistry, matchedByPattern.map((plugin) => plugin.id));
	if (preferredPatternPluginIds) return preferredPatternPluginIds;
	const patternMatches = matchedByPattern.length > 0 ? new Set(matchedByPattern) : void 0;
	const matchedByPrefix = [];
	for (const plugin of manifestRegistry.plugins) {
		if (patternMatches?.has(plugin)) continue;
		for (const prefix of plugin.modelSupport?.modelPrefixes ?? []) if (parsed.modelId.startsWith(prefix)) {
			matchedByPrefix.push(plugin.id);
			break;
		}
	}
	return resolvePreferredManifestPluginIds(manifestRegistry, matchedByPrefix);
}
function resolveOwningPluginIdsForModelRefs(params) {
	const manifestRegistry = params.manifestRegistry ?? resolveManifestRegistry({
		...params,
		registry: loadProviderRegistrySnapshot(params),
		includeDisabled: true
	});
	return sortUniqueStrings(params.models.flatMap((model) => resolveOwningPluginIdsForModelRef({
		model,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		manifestRegistry
	}) ?? []));
}
function resolveCatalogHookProviderPluginIds(params) {
	const registry = loadProviderRegistrySnapshot(params);
	const manifestRegistry = resolveManifestRegistry({
		...params,
		registry,
		includeDisabled: true
	});
	const providerSurfacePluginIds = new Set(manifestRegistry.plugins.flatMap((plugin) => plugin.providers.length > 0 ? [plugin.id] : []));
	const runtimeAugmentPluginIds = new Set(manifestRegistry.plugins.flatMap((plugin) => manifestPluginResolvesRuntimeModelCatalogAugment(plugin) ? [plugin.id] : []));
	const normalizedConfig = normalizePluginsConfigWithRegistry(params.config?.plugins, registry);
	const enabledProviderPluginIds = listRegistryPluginIds(registry, (plugin) => providerSurfacePluginIds.has(plugin.pluginId) && runtimeAugmentPluginIds.has(plugin.pluginId) && resolveEffectiveRegistryPluginActivation({
		plugin,
		normalizedConfig,
		rootConfig: params.config
	}).activated);
	const bundledCompatPluginIds = resolveBundledProviderCompatPluginIds({
		...params,
		manifestRegistry
	}).filter((pluginId) => runtimeAugmentPluginIds.has(pluginId));
	return sortUniqueStrings([...enabledProviderPluginIds, ...bundledCompatPluginIds]);
}
function resolveUsageHookProviderPluginContracts(params) {
	const { snapshot: registry, manifestRegistry: preparedManifestRegistry } = loadPluginRegistrySnapshotWithMetadata(params);
	const manifestRegistry = resolveManifestRegistry({
		...params,
		registry,
		manifestRegistry: preparedManifestRegistry,
		includeDisabled: true
	});
	const usagePluginIds = new Set(manifestRegistry.plugins.flatMap((plugin) => plugin.contracts?.usageProviders?.length ? [plugin.id] : []));
	const normalizedConfig = normalizePluginsConfigWithRegistry(params.config?.plugins, registry, { manifestRegistry });
	const enabledPluginIds = listRegistryPluginIds(registry, (plugin) => usagePluginIds.has(plugin.pluginId) && resolveEffectiveRegistryPluginActivation({
		plugin,
		normalizedConfig,
		rootConfig: params.config
	}).activated);
	const bundledCompatPluginIds = resolveBundledProviderCompatPluginIds({
		...params,
		manifestRegistry
	}).filter((pluginId) => usagePluginIds.has(pluginId));
	const pluginIds = sortUniqueStrings([...enabledPluginIds, ...bundledCompatPluginIds]);
	const manifestsById = new Map(manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
	return pluginIds.flatMap((pluginId) => {
		const providerIds = sortUniqueStrings((manifestsById.get(pluginId)?.contracts?.usageProviders ?? []).map(normalizeProviderId).filter(Boolean));
		return providerIds.length > 0 ? [{
			pluginId,
			providerIds
		}] : [];
	});
}
//#endregion
export { resolveDiscoverableProviderOwnerPluginIds as a, resolveExternalAuthProfileProviderPluginIds as c, resolveOwningPluginIdsForProvider as d, resolveOwningPluginIdsForProviderRef as f, resolveCatalogHookProviderPluginIds as i, resolveOwningPluginIdsForModelRef as l, resolveUsageHookProviderPluginContracts as m, resolveActivatableProviderOwnerPluginIds as n, resolveDiscoveredProviderPluginIds as o, resolveProviderRefOwnership as p, resolveBundledProviderCompatPluginIds as r, resolveEnabledProviderPluginIds as s, manifestPluginResolvesRuntimeModelCatalogAugment as t, resolveOwningPluginIdsForModelRefs as u };
