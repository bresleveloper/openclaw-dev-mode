import { D as withPluginCache, d as getPluginMetadataSnapshotCache } from "./plugin-cache-A1nT2dqa.mjs";
import { v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as preparePluginModule } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { f as resolvePluginRuntimeArtifactPreference, u as prefersBuiltPluginArtifacts } from "./bundled-dir-BGJkK8G5.mjs";
import { t as resolvePluginRuntimeRecord } from "./runtime-context-khSFyWth.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { i as loadValidatedPublicSurfaceModule } from "./public-surface-loader-CNXp9Fm5.mjs";
import { t as getPluginSetupModuleLoader } from "./plugin-setup-module-DjAZi3JK.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-Mkqqbxs_.mjs";
import "./generation-scope-DkeaMJw8.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-BFaZ221R.mjs";
import { n as resolvePluginRuntimeArtifact } from "./plugin-runtime-artifact-resolution-D0YkvU1X.mjs";
import { i as withProfile } from "./plugin-load-profile-Bo_sVzOb.mjs";
import { r as getPluginRuntimeLoadContext } from "./load-context-D-CZ4KSw.mjs";
import { o as resolveDiscoveredProviderPluginIds } from "./providers-Bx7WoFEI.mjs";
import { t as buildEffectiveManifestProviderConfig } from "./provider-catalog-DaDnKUnq.mjs";
import { r as resolvePluginProvidersCore } from "./providers.runtime-C-FMduqb.mjs";
//#region src/plugins/provider-discovery.runtime.ts
function normalizeDiscoveryModule(value) {
	const resolved = value && typeof value === "object" && "default" in value && value.default !== void 0 ? value.default : value;
	if (Array.isArray(resolved)) return resolved;
	if (resolved && typeof resolved === "object" && "id" in resolved) return [resolved];
	if (value && typeof value === "object" && !Array.isArray(value)) {
		const record = value;
		if (Array.isArray(record.providers)) return record.providers;
		if (record.provider) return [record.provider];
	}
	return [];
}
function loadProviderDiscoveryProviders(manifest) {
	const registry = getPluginRuntimeGenerationRegistry();
	const loadContext = getPluginRuntimeLoadContext(registry);
	const { source, rootDir } = registry ? resolvePluginRuntimeArtifact({
		pluginId: manifest.id,
		entryKind: "provider-discovery",
		source: manifest.providerDiscoverySource,
		rootDir: manifest.rootDir,
		origin: manifest.origin,
		packageManifest: manifest.packageManifest,
		preferBuiltPluginArtifacts: prefersBuiltPluginArtifacts(resolvePluginRuntimeArtifactPreference(loadContext?.preferBuiltPluginArtifacts), manifest.origin),
		sourcePreferred: manifest.sourcePreferred,
		registry
	}) : {
		source: manifest.providerDiscoverySource,
		rootDir: manifest.rootDir
	};
	const load = (modulePath, loadModule) => normalizeDiscoveryModule(withProfile({
		pluginId: manifest.id,
		source: modulePath
	}, "provider-discovery-entry", loadModule)).map((provider) => Object.assign({}, provider, {
		pluginId: manifest.id,
		pluginRoot: rootDir
	}));
	if (registry && getPluginRegistryForContext() === registry && resolvePluginRuntimeRecord({
		pluginRoot: rootDir,
		pluginId: manifest.id
	})?.status === "loaded") return load(source, () => loadValidatedPublicSurfaceModule({
		modulePath: source,
		boundaryRoot: rootDir,
		surfaceLabel: `plugin provider discovery ${manifest.id}`,
		origin: manifest.origin,
		pluginId: manifest.id
	}));
	const modulePath = registry ? preparePluginModule({
		modulePath: source,
		boundaryRoot: rootDir,
		boundaryLabel: "plugin root",
		surfaceLabel: `plugin provider discovery ${manifest.id}`,
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: manifest.origin,
			rootDir: manifest.rootDir,
			env: loadContext?.env
		})
	}).modulePath : source;
	const moduleLoader = getPluginSetupModuleLoader(manifest, modulePath, rootDir);
	return moduleLoader.initialize(() => load(modulePath, () => moduleLoader(modulePath)));
}
function hasLiveProviderDiscoveryHook(provider) {
	return typeof provider.catalog?.run === "function";
}
function hasProviderCatalogHook(provider) {
	return hasLiveProviderDiscoveryHook(provider) || typeof provider.staticCatalog?.run === "function";
}
function hasProviderAuthEnvCredential(plugin, env) {
	return (plugin.setup?.providers ?? []).flatMap((provider) => provider.envVars ?? []).some((name) => {
		const value = env[name]?.trim();
		return value !== void 0 && value !== "";
	});
}
function prepareManifestCatalogDiscovery(pluginRecords, config, includeProviders) {
	const providers = [];
	const runtimeManifestCatalogPluginIds = /* @__PURE__ */ new Set();
	for (const plugin of pluginRecords) {
		if (!plugin.modelCatalog) continue;
		const ownedProviders = new Set(plugin.providers.map((provider) => normalizeProviderId(provider)));
		if (Object.entries(plugin.modelCatalog.discovery ?? {}).some(([provider, discovery]) => (discovery === "runtime" || discovery === "refreshable") && ownedProviders.has(normalizeProviderId(provider)))) runtimeManifestCatalogPluginIds.add(plugin.id);
		if (!plugin.modelCatalog.providers) continue;
		const plan = planEffectiveModelCatalogRows({
			registry: { plugins: [plugin] },
			config
		});
		for (const entry of plan.entries) {
			if (entry.discovery === "runtime" || entry.discovery === "refreshable") {
				runtimeManifestCatalogPluginIds.add(plugin.id);
				continue;
			}
			if (!includeProviders || entry.rows.length === 0) continue;
			const providerConfig = buildEffectiveManifestProviderConfig(entry.rows);
			if (!providerConfig) continue;
			providers.push({
				id: entry.provider,
				pluginId: plugin.id,
				label: entry.provider,
				auth: [],
				staticCatalog: {
					order: "simple",
					run: async () => ({ providers: { [entry.provider]: providerConfig } })
				}
			});
		}
	}
	return {
		providers,
		runtimeManifestCatalogPluginIds
	};
}
function resolveProviderDiscoveryEntryPlugins(params) {
	const metadataSnapshot = params.pluginMetadataSnapshot ?? loadManifestMetadataSnapshot({
		config: params.config ?? {},
		env: params.env ?? process.env,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	const registry = metadataSnapshot.index;
	const manifestRegistry = metadataSnapshot.manifestRegistry;
	const pluginIds = resolveDiscoveredProviderPluginIds({
		...params,
		registry,
		manifestRegistry
	});
	const pluginIdSet = new Set(pluginIds);
	const pluginRecords = manifestRegistry.plugins.filter((plugin) => pluginIdSet.has(plugin.id));
	const { providers: manifestProviders, runtimeManifestCatalogPluginIds } = prepareManifestCatalogDiscovery(pluginRecords, params.config ?? {}, params.includeManifestModelCatalogProviders !== false);
	const entryRecords = pluginRecords.filter((plugin) => plugin.providerDiscoverySource);
	const entryPluginIds = new Set(entryRecords.map((plugin) => plugin.id));
	const manifestEntryPluginIds = /* @__PURE__ */ new Set();
	for (const pluginId of manifestProviders.map((provider) => provider.pluginId)) if (pluginId) {
		manifestEntryPluginIds.add(pluginId);
		if (!runtimeManifestCatalogPluginIds.has(pluginId)) entryPluginIds.add(pluginId);
	}
	const complete = entryPluginIds.size === pluginIdSet.size;
	const result = {
		providers: manifestProviders,
		complete,
		pluginRecords,
		entryPluginIds,
		runtimeManifestCatalogPluginIds
	};
	const entriesOnlyComplete = (/* @__PURE__ */ new Set([...entryPluginIds, ...manifestEntryPluginIds])).size === pluginIdSet.size;
	if (entryRecords.length === 0) return result;
	if (params.requireCompleteDiscoveryEntryCoverage && !(params.discoveryEntriesOnly === true ? entriesOnlyComplete : complete)) return {
		...result,
		providers: [],
		complete: false
	};
	const providers = [];
	for (const manifest of entryRecords) try {
		providers.push(...withPluginCache(getPluginMetadataSnapshotCache(metadataSnapshot), () => loadProviderDiscoveryProviders(manifest)));
	} catch {
		return {
			...result,
			complete: false,
			entryPluginIds: manifestEntryPluginIds
		};
	}
	return {
		...result,
		providers: [...manifestProviders, ...providers]
	};
}
function resolveRuntimeEntryProviders(entryResult) {
	return entryResult.providers.filter((provider) => {
		if (hasLiveProviderDiscoveryHook(provider)) return true;
		return Boolean(provider.pluginId && entryResult.entryPluginIds.has(provider.pluginId) && typeof provider.staticCatalog?.run === "function");
	});
}
function retainSyntheticAuthProviders(providers, authProviders) {
	const retained = new Set(providers);
	const result = [...providers];
	for (const provider of authProviders) if (!retained.has(provider)) result.push({
		...provider,
		catalog: void 0,
		staticCatalog: void 0
	});
	return result;
}
function planPluginDiscoveryRuntime(params) {
	const env = params.env ?? process.env;
	const entryResult = resolveProviderDiscoveryEntryPlugins({
		...params,
		env
	});
	const entryProviders = entryResult.providers.filter((provider) => hasProviderCatalogHook(provider) || params.includeSyntheticAuthProviders === true && (typeof provider.resolveSyntheticAuth === "function" || typeof provider.prepareSyntheticAuth === "function"));
	const runtimeEntryProviders = resolveRuntimeEntryProviders(entryResult);
	const authProviders = params.includeSyntheticAuthProviders ? entryProviders.filter((provider) => provider.resolveSyntheticAuth || provider.prepareSyntheticAuth) : [];
	if (params.discoveryEntriesOnly === true) return {
		kind: "entries",
		providers: entryProviders
	};
	if (entryResult.providers.length > 0 && entryResult.complete && runtimeEntryProviders.length === entryResult.providers.length && entryResult.runtimeManifestCatalogPluginIds.size === 0) return {
		kind: "entries",
		providers: retainSyntheticAuthProviders(runtimeEntryProviders, authProviders)
	};
	let fullPluginIds = params.onlyPluginIds;
	let retainedProviders;
	if (runtimeEntryProviders.length > 0 || entryResult.runtimeManifestCatalogPluginIds.size > 0) {
		fullPluginIds = sortUniqueStrings([...entryResult.pluginRecords.filter((plugin) => !entryResult.entryPluginIds.has(plugin.id) && (params.onlyPluginIds !== void 0 || hasProviderAuthEnvCredential(plugin, env))).map((plugin) => plugin.id), ...entryResult.runtimeManifestCatalogPluginIds]);
		if (fullPluginIds.length === 0) return {
			kind: "entries",
			providers: retainSyntheticAuthProviders(runtimeEntryProviders, authProviders)
		};
		const fullPluginIdSet = new Set(fullPluginIds);
		retainedProviders = runtimeEntryProviders.filter((provider) => !provider.pluginId || !fullPluginIdSet.has(provider.pluginId));
	} else if (entryProviders.length > 0) {
		const entryPluginIds = sortUniqueStrings(entryProviders.map((provider) => provider.pluginId).filter((pluginId) => typeof pluginId === "string" && pluginId !== ""));
		if (entryPluginIds.length > 0) fullPluginIds = entryPluginIds;
	}
	return {
		kind: "runtime",
		providers: retainSyntheticAuthProviders(retainedProviders ?? [], authProviders),
		pluginIds: fullPluginIds
	};
}
function resolvePluginDiscoveryProvidersRuntime(params) {
	const plan = planPluginDiscoveryRuntime(params);
	if (plan.kind === "entries") return plan.providers;
	const fullProviders = resolvePluginProvidersCore({
		...params,
		env: params.env ?? process.env,
		...plan.pluginIds ? { onlyPluginIds: plan.pluginIds } : {}
	});
	const providers = [...plan.providers];
	const entryIndices = new Map(providers.map((provider, index) => [normalizeProviderId(provider.id), index]));
	for (const provider of fullProviders) {
		const index = entryIndices.get(normalizeProviderId(provider.id));
		const entry = index === void 0 ? void 0 : providers[index];
		if (index !== void 0 && entry && entry.pluginId === provider.pluginId) providers[index] = provider.resolveSyntheticAuth || provider.prepareSyntheticAuth ? provider : {
			...provider,
			resolveSyntheticAuth: entry.resolveSyntheticAuth,
			prepareSyntheticAuth: entry.prepareSyntheticAuth
		};
		else if (hasProviderCatalogHook(provider)) providers.push(provider);
	}
	return providers;
}
//#endregion
export { resolvePluginDiscoveryProvidersRuntime as n, planPluginDiscoveryRuntime as t };
