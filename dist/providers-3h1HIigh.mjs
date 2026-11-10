import { v as sortUniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { t as compileSafeRegex } from "./safe-regex-mjvTiaxD.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { b as normalizePluginsConfigWithResolverCore, p as resolveEffectivePluginActivationState } from "./config-state-DkDfCu7E.mjs";
import { r as loadPluginManifestRegistryForInstalledIndex } from "./plugin-control-plane-context-Cn4izUMk.mjs";
import { i as getCurrentPluginMetadataSnapshot, u as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { a as loadPluginRegistrySnapshotWithMetadata, i as loadPluginRegistrySnapshot } from "./plugin-registry-snapshot-CR0J8rf8.mjs";
import { n as getProviderOwnerIndex } from "./provider-owner-index-B3AXzLxc.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { i as passesManifestOwnerBasePolicy, n as isActivatedManifestOwner } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { r as normalizePluginsConfigWithRegistry } from "./plugin-registry-contributions-BDlJJbko.mjs";
import "./plugin-registry-BKRXR0Si.mjs";
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
	return new Set(resolveManifestRegistry(params).plugins.flatMap((plugin) => plugin.providers.length > 0 ? [plugin.id] : []));
}
function manifestPluginResolvesRuntimeModelCatalogAugment(plugin) {
	return plugin.modelCatalog?.runtimeAugment === true || plugin.origin !== "bundled" && plugin.providers.length > 0;
}
function resolveProviderOwnerPluginIds(params) {
	if (params.pluginIds?.length === 0) return [];
	const registry = loadProviderRegistrySnapshot(params);
	const pluginIdSet = params.pluginIds ? new Set(params.pluginIds) : resolveProviderSurfacePluginIdSet({
		...params,
		registry
	});
	const scope = params.pluginIds ? null : createPluginIdScopeSet(params.onlyPluginIds);
	const normalizedConfig = params.normalizePluginId ? normalizePluginsConfigWithResolverCore(params.config?.plugins, params.normalizePluginId) : normalizePluginsConfigWithRegistry(params.config?.plugins, registry, { manifestRegistry: params.manifestRegistry });
	return listRegistryPluginIds(registry, (plugin) => pluginIdSet.has(plugin.pluginId) && (!scope || scope.has(plugin.pluginId)) && params.isEligible(plugin, normalizedConfig));
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
	return resolveProviderOwnerPluginIds({
		...params,
		isEligible: (plugin, normalizedConfig) => resolveEffectiveRegistryPluginActivation({
			plugin,
			normalizedConfig,
			rootConfig: params.config
		}).activated
	});
}
function resolveExternalAuthProfileProviderPluginIds(params) {
	return resolveManifestRegistry({
		...params,
		registry: loadProviderRegistrySnapshot(params)
	}).plugins.filter((plugin) => (plugin.contracts?.externalAuthProviders?.length ?? 0) > 0).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
function resolveDiscoveredProviderPluginIds(params) {
	return resolveProviderOwnerPluginIds({
		...params,
		isEligible: (plugin, normalizedConfig) => isProviderPluginEligibleForSetupDiscovery({
			plugin,
			shouldFilterUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins !== true,
			normalizedConfig,
			rootConfig: params.config
		})
	});
}
function isProviderPluginEligibleForSetupDiscovery(params) {
	if (params.plugin.origin === "workspace" && !params.shouldFilterUntrustedWorkspacePlugins) return true;
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
	return passesManifestOwnerBasePolicy({
		plugin: toManifestOwnerRecord(params.plugin),
		normalizedConfig: params.normalizedConfig
	}) && (params.plugin.origin !== "workspace" || isActivatedManifestOwner({
		plugin: toManifestOwnerRecord(params.plugin),
		normalizedConfig: params.normalizedConfig,
		rootConfig: params.rootConfig
	}));
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
		includeDisabled: true
	});
}
function splitExplicitModelRef(rawModel) {
	const trimmed = rawModel.trim();
	if (!trimmed) return null;
	const slash = trimmed.indexOf("/");
	if (slash === -1) {
		const modelId = splitTrailingAuthProfile(trimmed).model;
		return modelId ? { modelId } : null;
	}
	const provider = normalizeProviderId(trimmed.slice(0, slash));
	const modelId = splitTrailingAuthProfile(trimmed.slice(slash + 1)).model;
	if (!provider || !modelId) return null;
	return {
		provider,
		modelId
	};
}
function matchesModelPattern(plugin, modelId) {
	return (plugin.modelSupport?.modelPatterns ?? []).some((pattern) => compileSafeRegex(pattern, "u")?.test(modelId));
}
function classifyProviderRefOwnership(pluginIds) {
	return pluginIds?.length ? {
		status: pluginIds.length === 1 ? "owned" : "ambiguous",
		pluginIds
	} : { status: "unowned" };
}
function resolvePreferredManifestPluginIds(registry, matchedPluginIds) {
	if (matchedPluginIds.length === 0) return;
	const uniquePluginIds = sortUniqueStrings(matchedPluginIds);
	if (uniquePluginIds.length <= 1) return uniquePluginIds;
	const nonBundledPluginIds = uniquePluginIds.filter((pluginId) => {
		return registry.plugins.find((entry) => entry.id === pluginId)?.origin !== "bundled";
	});
	return nonBundledPluginIds.length === 1 ? nonBundledPluginIds : void 0;
}
function resolveProviderOwnershipIndex(params) {
	const metadataSnapshot = params.metadataSnapshot ?? (params.manifestRegistry ? void 0 : getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		allowWorkspaceScopedSnapshot: true
	}));
	const manifestRegistry = params.manifestRegistry ?? metadataSnapshot?.manifestRegistry;
	if (manifestRegistry) return getProviderOwnerIndex(manifestRegistry);
	const registryParams = {
		config: params.config ?? {},
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env
	};
	const loaded = loadPluginRegistrySnapshotWithMetadata(registryParams);
	return getProviderOwnerIndex(loadPluginManifestRegistryForInstalledIndex({
		...registryParams,
		index: loaded.snapshot,
		manifestRegistry: loaded.manifestRegistry,
		includeDisabled: true
	}));
}
function resolveOwningPluginIdsForProvider(params) {
	if (!params.provider.trim()) return;
	const owners = resolveProviderOwnershipIndex(params).providers;
	return owners.get(params.provider) ?? owners.get(normalizeProviderId(params.provider));
}
function resolveOwningPluginIdsForProviderRef(params) {
	if (!params.provider.trim()) return;
	const owners = resolveProviderOwnershipIndex(params).refs;
	return owners.get(params.provider) ?? owners.get(normalizeProviderId(params.provider));
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
	const manifestRegistry = resolveManifestRegistry(params);
	const matchedByPattern = manifestRegistry.plugins.filter((plugin) => matchesModelPattern(plugin, parsed.modelId));
	const preferredPatternPluginIds = resolvePreferredManifestPluginIds(manifestRegistry, matchedByPattern.map((plugin) => plugin.id));
	if (preferredPatternPluginIds) return preferredPatternPluginIds;
	const patternMatches = new Set(matchedByPattern);
	return resolvePreferredManifestPluginIds(manifestRegistry, manifestRegistry.plugins.filter((plugin) => !patternMatches.has(plugin) && plugin.modelSupport?.modelPrefixes?.some((prefix) => parsed.modelId.startsWith(prefix))).map((plugin) => plugin.id));
}
function resolveOwningPluginIdsForModelRefs(params) {
	const manifestRegistry = params.manifestRegistry ?? resolveManifestRegistry({
		...params,
		registry: loadProviderRegistrySnapshot(params)
	});
	return sortUniqueStrings(params.models.flatMap((model) => resolveOwningPluginIdsForModelRef({
		model,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		manifestRegistry
	}) ?? []));
}
function resolveHookProviderPluginIds(params, hasHook, normalizedConfig) {
	const enabledPluginIds = listRegistryPluginIds(params.registry, (plugin) => hasHook(plugin.pluginId) && resolveEffectiveRegistryPluginActivation({
		plugin,
		normalizedConfig,
		rootConfig: params.config
	}).activated);
	const bundledCompatPluginIds = resolveBundledProviderCompatPluginIds(params).filter(hasHook);
	return sortUniqueStrings([...enabledPluginIds, ...bundledCompatPluginIds]);
}
function resolveCatalogHookProviderPluginIds(params) {
	const registry = loadProviderRegistrySnapshot(params);
	const manifestRegistry = resolveManifestRegistry({
		...params,
		registry
	});
	const providerSurfacePluginIds = new Set(manifestRegistry.plugins.flatMap((plugin) => plugin.providers.length > 0 ? [plugin.id] : []));
	const runtimeAugmentPluginIds = new Set(manifestRegistry.plugins.flatMap((plugin) => manifestPluginResolvesRuntimeModelCatalogAugment(plugin) ? [plugin.id] : []));
	return resolveHookProviderPluginIds({
		...params,
		registry,
		manifestRegistry
	}, (pluginId) => providerSurfacePluginIds.has(pluginId) && runtimeAugmentPluginIds.has(pluginId), normalizePluginsConfigWithRegistry(params.config?.plugins, registry));
}
function resolveUsageHookProviderPluginContracts(params) {
	const { snapshot: registry, manifestRegistry: preparedManifestRegistry } = loadPluginRegistrySnapshotWithMetadata(params);
	const manifestRegistry = resolveManifestRegistry({
		...params,
		registry,
		manifestRegistry: preparedManifestRegistry
	});
	const usagePluginIds = new Set(manifestRegistry.plugins.flatMap((plugin) => plugin.contracts?.usageProviders?.length ? [plugin.id] : []));
	const pluginIds = resolveHookProviderPluginIds({
		...params,
		registry,
		manifestRegistry
	}, (pluginId) => usagePluginIds.has(pluginId), normalizePluginsConfigWithRegistry(params.config?.plugins, registry, { manifestRegistry }));
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
