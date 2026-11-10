import { c as getPluginCache, p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { n as createStaticProviderModelIdNormalizer, s as normalizeStaticProviderModelId } from "./model-ref-shared-BRJ3VRZV.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { r as loadPluginManifest } from "./manifest-gUPkNRN0.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { i as projectModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-wdC9jpCz.mjs";
import { n as indexFirstByKey, t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-BqtrPPLI.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import "./defaults-Bg930vxE.mjs";
import { i as passesManifestOwnerBasePolicy, n as isActivatedManifestOwner, r as isBundledManifestOwner, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { n as modelTransportRoutesMatch } from "./model-compat-catalog-VI3Psdyr.mjs";
import { r as planManifestModelCatalogSuppressions } from "./manifest-planner-sZi1SDO4.mjs";
import { t as listOpenClawPluginManifestMetadata } from "./manifest-metadata-scan-CTTfwx1C.mjs";
import { r as isProviderCatalogSourceAllowed } from "./provider-config-owner-xL-mNZoa.mjs";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-Ag5B94I6.mjs";
import { r as normalizeResolvedPricing } from "./usage-cost-Va5dwVFW.mjs";
import "./src-D3H6pm7W.mjs";
import { f as resolveOwningPluginIdsForProviderRef, n as resolveActivatableProviderOwnerPluginIds, r as resolveBundledProviderCompatPluginIds } from "./providers-3h1HIigh.mjs";
import { c as runProviderStaticCatalog, n as normalizePluginDiscoveryResult, o as resolveRuntimePluginDiscoveryProviders } from "./provider-discovery-VU-K7aKK.mjs";
import { i as resolveProviderModelInput, n as completeInlineProviderModel, t as buildInlineProviderModels } from "./model.inline-provider-DwjZUIZW.mjs";
import { r as resolveBuiltInModelSuppressionFromManifest } from "./model-suppression-BWbx1-dY.mjs";
import { t as resolveProviderTransport } from "./model.provider-transport-1LpjfXEc.mjs";
//#region src/agents/embedded-agent-runner/model.static-catalog-row.ts
function modelFromStaticCatalogRow(row) {
	return {
		id: row.id,
		name: row.name || row.id,
		provider: row.provider,
		api: row.api ?? "openai-responses",
		baseUrl: row.baseUrl ?? "",
		reasoning: row.reasoning,
		input: resolveProviderModelInput({ input: row.input }),
		cost: normalizeResolvedPricing(row.cost ?? {}),
		contextWindow: row.contextWindow ?? 2e5,
		contextWindows: row.contextWindows?.map((option) => ({ ...option })),
		contextWindowDefault: row.contextWindowDefault,
		contextTokens: row.contextTokens,
		maxTokens: row.maxTokens ?? 2e5,
		thinkingLevelMap: row.thinkingLevelMap ? { ...row.thinkingLevelMap } : void 0,
		headers: row.headers,
		compat: row.compat,
		mediaInput: row.mediaInput
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/model.static-id.ts
function matchesStaticModelId(params, normalizeModelId) {
	const normalizedProvider = normalizeProviderId(params.provider);
	if (params.rowProvider && normalizeProviderId(params.rowProvider) !== normalizedProvider) return false;
	return normalizeModelId(normalizedProvider, params.candidateId).trim().toLowerCase() === normalizeModelId(normalizedProvider, params.modelId).trim().toLowerCase();
}
function staticModelIdMatches(params) {
	return matchesStaticModelId(params, normalizeStaticProviderModelId);
}
/** Builds a matcher pinned to one prepared manifest-policy generation. */
function createStaticModelIdMatcher(options = {}) {
	const normalizeModelId = createStaticProviderModelIdNormalizer(options);
	return (params) => matchesStaticModelId(params, normalizeModelId);
}
function createPreparedConfiguredRuntimeModelLookup(models, metadataSnapshot) {
	const normalizeModelId = createStaticProviderModelIdNormalizer({ manifestPlugins: metadataSnapshot });
	const exactKey = (provider, modelId) => JSON.stringify([normalizeProviderId(provider), modelId]);
	const staticKey = (provider, modelId) => exactKey(provider, normalizeModelId(provider, modelId).trim().toLowerCase());
	const exact = indexFirstByKey(models, ({ provider, modelId }) => exactKey(provider, modelId));
	const equivalent = indexFirstByKey(models, ({ provider, modelId }) => staticKey(provider, modelId));
	return (provider, modelId) => (exact.get(exactKey(provider, modelId)) ?? equivalent.get(staticKey(provider, modelId)))?.model;
}
//#endregion
//#region src/agents/embedded-agent-runner/model.manifest-alias.ts
function resolveConfiguredModelCatalogProviderRoute(params) {
	const provider = normalizeProviderId(params.provider);
	const config = provider ? findNormalizedProviderValue(params.cfg?.models?.providers, provider) : void 0;
	const modelId = params.modelId?.trim() ?? "";
	const models = config?.models ?? [];
	const matches = (candidate) => Boolean(provider && modelId) && staticModelIdMatches({
		candidateId: candidate.id,
		provider,
		modelId
	});
	return {
		hasEndpoint: Boolean(config?.baseUrl?.trim()) || models.some((model) => Boolean(model.baseUrl?.trim()) && matches(model)),
		api: models.find(matches)?.api ?? config?.api
	};
}
function resolveManifestAliasTargetApi(params) {
	const providerCatalog = findNormalizedProviderValue(params.plugin.modelCatalog?.providers, params.provider);
	if (!providerCatalog) return;
	const modelId = params.modelId?.trim();
	return (modelId ? providerCatalog.models.find((candidate) => staticModelIdMatches({
		candidateId: candidate.id,
		provider: params.provider,
		modelId
	})) : void 0)?.api ?? providerCatalog.api;
}
function resolveManifestModelCatalogProviderAliasMetadata(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider) return { provider: params.provider };
	const env = params.env ?? process.env;
	const plugins = (env === process.env ? getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env,
		...params.cfg === void 0 ? { requireDefaultDiscoveryContext: true } : {}
	})?.plugins : void 0) ?? loadPluginManifestRegistryCore({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env
	}).plugins;
	const claims = [];
	const normalizedConfig = normalizePluginsConfig(params.cfg?.plugins);
	for (const plugin of plugins) {
		if (!isActivatedManifestOwner({
			plugin,
			normalizedConfig,
			rootConfig: params.cfg
		}) || !(isBundledManifestOwner(plugin) || plugin.origin === "config" || hasExplicitManifestOwnerTrust({
			plugin,
			normalizedConfig
		}))) continue;
		for (const [rawAlias, alias] of Object.entries(plugin.modelCatalog?.aliases ?? {})) {
			const normalizedAlias = normalizeProviderId(rawAlias);
			const normalizedTarget = normalizeProviderId(alias.provider);
			if (normalizedAlias !== provider || !normalizedTarget || !plugin.providers.some((providerId) => normalizeProviderId(providerId) === normalizedTarget)) continue;
			const modelId = params.modelId?.trim();
			const hasApplicableSuppression = modelId && planManifestModelCatalogSuppressions({
				registry: { plugins: [plugin] },
				providerFilter: provider,
				modelFilter: modelId
			}).suppressions.some((suppression) => !suppression.when && normalizeProviderId(suppression.provider) === provider);
			const configuredRoute = resolveConfiguredModelCatalogProviderRoute({
				provider,
				modelId: params.modelId,
				cfg: params.cfg
			});
			const hasEndpointSurface = Boolean(alias.baseUrl?.trim()) || configuredRoute.hasEndpoint;
			const transportApi = configuredRoute.api ?? alias.api ?? resolveManifestAliasTargetApi({
				plugin,
				provider: normalizedTarget,
				modelId: params.modelId
			});
			if (Boolean(alias.api?.trim() || alias.baseUrl?.trim()) && hasEndpointSurface && !hasApplicableSuppression) {
				const baseUrl = alias.baseUrl?.trim();
				claims.push(transportApi ? {
					provider: params.provider,
					transport: {
						api: transportApi,
						...baseUrl ? { baseUrl } : {}
					}
				} : {
					provider: params.provider,
					ambiguous: true
				});
			} else claims.push({ provider: normalizedTarget });
		}
	}
	return claims.length > 1 ? {
		provider: params.provider,
		ambiguous: true
	} : claims[0] ?? { provider: params.provider };
}
//#endregion
//#region src/agents/embedded-agent-runner/model.static-catalog.ts
const defaultBundledStaticCatalogConfig = {};
function resolveBundledStaticCatalogMetadataSnapshot(params) {
	if (params.metadataSnapshot) return params.metadataSnapshot;
	const gatewaySnapshot = getGatewayPluginMetadataSnapshot();
	if (gatewaySnapshot) return gatewaySnapshot;
	if (params.env !== process.env) return;
	return getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		env: params.env,
		workspaceDir: params.workspaceDir,
		...params.workspaceDir === void 0 ? { allowWorkspaceScopedSnapshot: true } : {},
		...params.cfg === void 0 ? { requireDefaultDiscoveryContext: true } : {}
	});
}
function listBundledStaticCatalogPlugins(params, metadataSnapshot) {
	const normalizedConfig = normalizePluginsConfig(params.cfg?.plugins);
	return (metadataSnapshot ? metadataSnapshot.plugins.filter((plugin) => plugin.origin === "bundled") : listOpenClawPluginManifestMetadata(params.env).flatMap((record) => {
		if (record.origin !== "bundled") return [];
		const loaded = loadPluginManifest(record.pluginDir);
		return loaded.ok ? [loaded.manifest] : [];
	})).map(({ id, providers, modelCatalog, providerEndpoints }) => ({
		id,
		providers,
		modelCatalog,
		providerEndpoints
	})).filter((plugin) => Boolean(plugin.modelCatalog) && passesManifestOwnerBasePolicy({
		plugin,
		normalizedConfig
	}));
}
function resolveBundledStaticCatalogState(params, metadataSnapshot) {
	const bundledStaticCatalogStatesByOwner = (metadataSnapshot ? getPluginMetadataSnapshotCache(metadataSnapshot) : getPluginCache()).metadata.staticCatalogStates;
	const owner = metadataSnapshot ?? params.env;
	let states = bundledStaticCatalogStatesByOwner.get(owner);
	if (!states) {
		states = /* @__PURE__ */ new WeakMap();
		bundledStaticCatalogStatesByOwner.set(owner, states);
	}
	const config = params.cfg ?? defaultBundledStaticCatalogConfig;
	const cached = states.get(config);
	if (cached) return cached;
	const state = {
		plugins: listBundledStaticCatalogPlugins(params, metadataSnapshot),
		plans: /* @__PURE__ */ new Map(),
		donorRows: /* @__PURE__ */ new Map()
	};
	states.set(config, state);
	return state;
}
/**
* Prepares a process-stable bundled manifest catalog lookup.
* Manifest discovery runs once; provider-specific plans are cached on demand.
*/
function createBundledStaticCatalogModelResolver(params) {
	const catalogParams = {
		...params,
		env: params?.env ?? process.env
	};
	const matchesStaticModelId = params?.metadataSnapshot ? createStaticModelIdMatcher({ manifestPlugins: params.metadataSnapshot }) : staticModelIdMatches;
	return (lookup) => {
		const provider = normalizeProviderId(lookup.provider);
		if (!provider || !lookup.modelId.trim()) return;
		const metadataSnapshot = resolveBundledStaticCatalogMetadataSnapshot(catalogParams);
		const state = resolveBundledStaticCatalogState(catalogParams, metadataSnapshot);
		if (state.plugins.length === 0) return;
		const getPlan = (providerFilter) => {
			const key = providerFilter ?? "";
			let plan = state.plans.get(key);
			if (!plan) {
				plan = planEffectiveModelCatalogRows({
					registry: { plugins: state.plugins },
					config: params?.cfg ?? {},
					...providerFilter ? { providerFilter } : {}
				});
				state.plans.set(key, plan);
			}
			return plan;
		};
		function* acceptedRows(plan) {
			for (const entry of plan.entries) if (entry.discovery === "static" || params?.includeRuntimeDiscovery && (entry.discovery === "runtime" || entry.discovery === "refreshable")) yield* entry.rows;
		}
		for (const row of acceptedRows(getPlan(provider))) if (matchesStaticModelId({
			candidateId: row.id,
			provider,
			modelId: lookup.modelId,
			rowProvider: row.provider
		})) return modelFromStaticCatalogRow(row);
		const configured = findNormalizedProviderValue(params?.cfg?.models?.providers, provider);
		if (!configured?.api || !configured.baseUrl || findConfiguredProviderModel(configured, provider, lookup.modelId) || metadataSnapshot?.owners.providers.has(provider) || state.plugins.some((plugin) => plugin.providers?.some((id) => normalizeProviderId(id) === provider) || findNormalizedProviderValue(plugin.modelCatalog?.providers, provider) || findNormalizedProviderValue(plugin.modelCatalog?.aliases, provider))) return;
		const configuredRoute = {
			api: configured.api,
			baseUrl: configured.baseUrl
		};
		const donorKey = JSON.stringify([
			provider,
			lookup.modelId.trim(),
			params?.includeRuntimeDiscovery === true
		]);
		let donor = state.donorRows.get(donorKey);
		if (donor === void 0) {
			const donors = getPlan();
			donor = null;
			for (const row of acceptedRows(donors)) {
				if (row.id !== lookup.modelId.trim()) continue;
				const route = resolveProviderTransport({
					provider: row.provider,
					modelId: row.id,
					...configuredRoute,
					cfg: projectModelProviderConfig(params?.cfg, row.provider, configuredRoute),
					workspaceDir: params?.workspaceDir
				});
				if (!route.baseUrl || !modelTransportRoutesMatch(row, route)) continue;
				if (donor || donors.conflicts.some((conflict) => conflict.provider === row.provider && conflict.modelId === row.id) || resolveBuiltInModelSuppressionFromManifest({
					provider: row.provider,
					id: row.id,
					baseUrl: route.baseUrl,
					config: projectModelProviderConfig(params?.cfg, row.provider, {
						api: row.api,
						baseUrl: route.baseUrl
					}),
					workspaceDir: params?.workspaceDir,
					metadataSnapshot
				})?.suppress) {
					donor = null;
					break;
				}
				donor = row;
			}
			state.donorRows.set(donorKey, donor);
		}
		return donor ? {
			...modelFromStaticCatalogRow(donor),
			provider
		} : void 0;
	};
}
/** Resolves one bundled static-catalog model row for provider/model lookup. */
function resolveBundledStaticCatalogModel(params) {
	return createBundledStaticCatalogModelResolver(params)(params);
}
function resolveBundledProviderStaticCatalogPluginIds(params) {
	const pluginIds = resolveOwningPluginIdsForProviderRef({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
	});
	if (!pluginIds || pluginIds.length === 0) return [];
	const activatablePluginIds = resolveActivatableProviderOwnerPluginIds({
		pluginIds,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		...params.metadataSnapshot ? {
			registry: params.metadataSnapshot.index,
			manifestRegistry: params.metadataSnapshot.manifestRegistry,
			normalizePluginId: params.metadataSnapshot.normalizePluginId
		} : {}
	});
	if (activatablePluginIds.length === 0) return [];
	const bundledPluginIds = new Set(resolveBundledProviderCompatPluginIds({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		...params.metadataSnapshot ? { manifestRegistry: params.metadataSnapshot.manifestRegistry } : {}
	}));
	return activatablePluginIds.filter((pluginId) => bundledPluginIds.has(pluginId)).toSorted();
}
async function loadBundledProviderStaticCatalogModels(params) {
	const pluginIds = new Set(params.pluginIds);
	const preparedProviders = (params.preparedStaticProviderCatalog?.providers ?? []).filter((provider) => provider.pluginId !== void 0 && pluginIds.has(provider.pluginId));
	const preparedPluginIds = new Set(preparedProviders.flatMap((provider) => provider.pluginId ? [provider.pluginId] : []));
	const missingPluginIds = params.pluginIds.filter((pluginId) => !preparedPluginIds.has(pluginId));
	const discoveredProviders = missingPluginIds.length === 0 ? [] : await resolveRuntimePluginDiscoveryProviders({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: missingPluginIds,
		includeUntrustedWorkspacePlugins: false,
		requireCompleteDiscoveryEntryCoverage: true,
		discoveryEntriesOnly: true,
		includeManifestModelCatalogProviders: false,
		...params.metadataSnapshot ? { pluginMetadataSnapshot: params.metadataSnapshot } : {}
	});
	const providers = [...preparedProviders, ...discoveredProviders];
	const preparedEntries = params.preparedStaticProviderCatalog?.entries.filter(({ provider }) => provider.pluginId !== void 0 && pluginIds.has(provider.pluginId));
	const preparedResults = preparedEntries ? new Map(preparedEntries.map(({ provider, providerConfigs }) => [`${provider.pluginId ?? ""}\0${normalizeProviderId(provider.id)}`, providerConfigs])) : void 0;
	const modelsByProvider = /* @__PURE__ */ new Map();
	for (const catalogProvider of providers) {
		const plugin = params.metadataSnapshot?.manifestRegistry.plugins.find((candidate) => candidate.id === (catalogProvider.pluginId ?? catalogProvider.id));
		const includeProvider = (provider) => isProviderCatalogSourceAllowed({
			provider,
			plugin,
			config: params.cfg
		});
		const soleStaticCatalog = providers.filter((candidate) => (candidate.pluginId ?? normalizeProviderId(candidate.id)) === (catalogProvider.pluginId ?? normalizeProviderId(catalogProvider.id)) && candidate.staticCatalog).length === 1;
		if (![
			catalogProvider.id,
			...catalogProvider.aliases ?? [],
			...catalogProvider.hookAliases ?? [],
			...soleStaticCatalog ? plugin?.providers ?? [] : []
		].some(includeProvider)) continue;
		const preparedResultKey = `${catalogProvider.pluginId ?? ""}\0${normalizeProviderId(catalogProvider.id)}`;
		const normalized = preparedResults?.get(preparedResultKey) ?? normalizePluginDiscoveryResult({
			provider: catalogProvider,
			result: await runProviderStaticCatalog({ provider: catalogProvider })
		});
		for (const [providerIdRaw, providerConfig] of Object.entries(normalized)) {
			const provider = normalizeProviderId(providerIdRaw);
			if (!provider || !includeProvider(provider) || !Array.isArray(providerConfig.models) || providerConfig.models.length === 0) continue;
			const models = modelsByProvider.get(provider) ?? [];
			models.push(...buildInlineProviderModels({ [provider]: providerConfig }, { providerMetadataOwners: params.metadataSnapshot?.owners }).map((model) => completeInlineProviderModel(model, providerConfig)));
			modelsByProvider.set(provider, models);
		}
	}
	return modelsByProvider;
}
/** Reads static rows from discovery entries and captured owners without activating runtimes. */
async function loadBundledProviderStaticCatalogContextModels(params = {}) {
	const env = params.env ?? process.env;
	const metadataSnapshot = resolveBundledStaticCatalogMetadataSnapshot({
		...params,
		env
	});
	const preparedStaticProviderCatalog = {
		providers: dedupeByKey([...params.preparedStaticProviderCatalog?.providers ?? [], ...(params.registeredProviders ?? []).map(({ pluginId, provider }) => Object.assign({}, provider, { pluginId }))], (provider) => `${provider.pluginId}\0${provider.id}`),
		entries: params.preparedStaticProviderCatalog?.entries ?? []
	};
	const staticCatalogPluginIds = new Set((metadataSnapshot?.manifestRegistry?.plugins ?? loadPluginManifestRegistryCore({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env
	}).plugins).flatMap((plugin) => plugin.origin === "bundled" && plugin.providerDiscoverySource ? [plugin.id] : []));
	for (const provider of preparedStaticProviderCatalog.providers) if (provider.pluginId && provider.staticCatalog) staticCatalogPluginIds.add(provider.pluginId);
	const providerScopedPluginIds = params.providerIds?.flatMap((provider) => resolveBundledProviderStaticCatalogPluginIds({
		...params,
		provider,
		env,
		metadataSnapshot
	}));
	const candidatePluginIds = providerScopedPluginIds === void 0 ? resolveBundledProviderCompatPluginIds({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env,
		...metadataSnapshot ? { manifestRegistry: metadataSnapshot.manifestRegistry } : {}
	}) : providerScopedPluginIds;
	const pluginIds = [...new Set(candidatePluginIds)].filter((pluginId) => staticCatalogPluginIds.has(pluginId)).toSorted((left, right) => left.localeCompare(right));
	if (pluginIds.length === 0) return [];
	return (await Promise.allSettled(pluginIds.map((pluginId) => loadBundledProviderStaticCatalogModels({
		pluginIds: [pluginId],
		...params,
		env,
		preparedStaticProviderCatalog,
		metadataSnapshot
	})))).flatMap((result) => result.status === "fulfilled" ? [...result.value.values()].flat() : []);
}
function createScopedBundledProviderStaticCatalogModelResolver(params = {}) {
	const env = params.env ?? process.env;
	const matchesStaticModelId = params.metadataSnapshot ? createStaticModelIdMatcher({ manifestPlugins: params.metadataSnapshot }) : staticModelIdMatches;
	const pluginCatalogs = /* @__PURE__ */ new Map();
	const providerPluginIds = /* @__PURE__ */ new Map();
	return async (lookup, scopedPluginIds) => {
		const provider = normalizeProviderId(lookup.provider);
		if (!provider || !lookup.modelId.trim()) return;
		let pluginIds = scopedPluginIds ?? providerPluginIds.get(provider);
		if (!pluginIds) {
			pluginIds = resolveBundledProviderStaticCatalogPluginIds({
				...params,
				provider,
				env
			});
			providerPluginIds.set(provider, pluginIds);
		}
		if (pluginIds.length === 0) return;
		const catalogKey = pluginIds.join("\0");
		return ((await getOrCreatePromise(pluginCatalogs, catalogKey, () => loadBundledProviderStaticCatalogModels({
			pluginIds,
			...params,
			env
		}))).get(provider) ?? []).find((candidate) => matchesStaticModelId({
			candidateId: candidate.id,
			provider,
			modelId: lookup.modelId
		}));
	};
}
function resolveOwnedNestedProviderLookup(params) {
	const provider = normalizeProviderId(params.lookup.provider);
	const modelId = params.lookup.modelId.trim();
	const slash = modelId.indexOf("/");
	if (!provider || slash <= 0 || slash >= modelId.length - 1) return;
	const nestedProvider = normalizeProviderId(modelId.slice(0, slash));
	const nestedModelId = modelId.slice(slash + 1).trim();
	if (!nestedProvider || nestedProvider === provider || !nestedModelId) return;
	const resolveBundledOwners = (candidateProvider) => resolveBundledProviderStaticCatalogPluginIds({
		...params.resolverParams,
		provider: candidateProvider,
		env: params.env
	});
	const nestedProviderOwners = new Set(resolveBundledOwners(nestedProvider));
	const sharedPluginIds = resolveBundledOwners(provider).filter((pluginId) => nestedProviderOwners.has(pluginId));
	if (sharedPluginIds.length === 0) return;
	return {
		lookup: {
			provider: nestedProvider,
			modelId: nestedModelId
		},
		pluginIds: sharedPluginIds
	};
}
/**
* Prepares context-only provider catalog lookup.
* Nested provider refs may reuse metadata only when both providers have the same plugin owner.
*/
function createBundledProviderStaticCatalogContextResolver(params = {}) {
	const env = params.env ?? process.env;
	const resolveModel = createScopedBundledProviderStaticCatalogModelResolver(params);
	return async (lookup) => {
		const exactModel = await resolveModel(lookup);
		const nested = exactModel ? void 0 : resolveOwnedNestedProviderLookup({
			lookup,
			resolverParams: params,
			env
		});
		const model = exactModel ?? (nested ? await resolveModel(nested.lookup, nested.pluginIds) : void 0);
		if (!model) return;
		return {
			...typeof model.contextWindow === "number" && model.contextWindow > 0 ? { contextWindow: model.contextWindow } : {},
			...typeof model.contextTokens === "number" && model.contextTokens > 0 ? { contextTokens: model.contextTokens } : {},
			...model.contextWindowSource ? { contextWindowSource: model.contextWindowSource } : {}
		};
	};
}
/**
* Resolves one bundled provider static-catalog model row for provider/model lookup.
*
* Some bundled providers expose their canonical offline rows through
* `providerCatalogEntry` instead of manifest `modelCatalog`. This keeps the
* skip-discovery fallback aligned with model list/inspect without running live
* discovery or untrusted workspace plugins.
*/
async function resolveBundledProviderStaticCatalogModel(params) {
	return createScopedBundledProviderStaticCatalogModelResolver(params)(params);
}
//#endregion
export { resolveBundledStaticCatalogModel as a, createStaticModelIdMatcher as c, resolveBundledProviderStaticCatalogModel as i, createBundledStaticCatalogModelResolver as n, resolveManifestModelCatalogProviderAliasMetadata as o, loadBundledProviderStaticCatalogContextModels as r, createPreparedConfiguredRuntimeModelLookup as s, createBundledProviderStaticCatalogContextResolver as t };
