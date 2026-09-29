import { d as getPluginMetadataSnapshotCache, o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { r as loadPluginManifest } from "./manifest-DHkEL08H.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { i as passesManifestOwnerBasePolicy, n as isActivatedManifestOwner, r as isBundledManifestOwner, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { n as createStaticProviderModelIdNormalizer, s as normalizeStaticProviderModelId } from "./model-ref-shared-BgRrSHjn.mjs";
import "./defaults-BbU4k6fu.mjs";
import { t as modelTransportRoutesMatch } from "./model-compat-catalog-DU9GPmr_.mjs";
import { r as planManifestModelCatalogSuppressions } from "./manifest-planner-LLbsmVKX.mjs";
import { t as listOpenClawPluginManifestMetadata } from "./manifest-metadata-scan-DIjm0r-Z.mjs";
import { i as projectModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-BbSyhfVf.mjs";
import { n as dedupeByKey, r as indexFirstByKey } from "./provider-thinking-catalog-B0d_iUnw.mjs";
import { n as isProviderCatalogSourceAllowed } from "./provider-config-owner-CewfXQTW.mjs";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-BFaZ221R.mjs";
import { f as resolveOwningPluginIdsForProviderRef, n as resolveActivatableProviderOwnerPluginIds, r as resolveBundledProviderCompatPluginIds } from "./providers-Bx7WoFEI.mjs";
import { r as normalizeResolvedPricing } from "./usage-cost-Va5dwVFW.mjs";
import "./src-BpANEEBH.mjs";
import { c as runProviderStaticCatalog, n as normalizePluginDiscoveryResult, o as resolveRuntimePluginDiscoveryProviders } from "./provider-discovery-gl0uPs1A.mjs";
import { m as normalizeProviderTransportWithPlugin } from "./provider-runtime-BofzCM_V.mjs";
import { n as completeInlineProviderModel, r as normalizeResolvedTransportApi, t as buildInlineProviderModels } from "./model.inline-provider-BrhnLKm5.mjs";
import { r as resolveBuiltInModelSuppressionFromManifest } from "./model-suppression-BVXq4y94.mjs";
//#region src/agents/embedded-agent-runner/model.provider-transport.ts
function resolveProviderTransport(params) {
	const normalized = (params.runtimeHooks ?? { normalizeProviderTransportWithPlugin }).normalizeProviderTransportWithPlugin({
		provider: params.provider,
		...params.modelId ? { modelId: params.modelId } : {},
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		context: {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			...params.modelId ? { modelId: params.modelId } : {},
			api: params.api,
			baseUrl: params.baseUrl
		}
	});
	return {
		api: normalizeResolvedTransportApi(normalized?.api ?? params.api),
		baseUrl: normalized?.baseUrl ?? params.baseUrl
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/model.static-catalog-row.ts
function normalizeStaticCatalogInput(input) {
	const normalizedInput = (input ?? []).filter((item) => item === "text" || item === "image");
	return normalizedInput.length > 0 ? normalizedInput : ["text"];
}
/** Converts a normalized catalog row into the provider runtime model shape. */
function modelFromStaticCatalogRow(row) {
	return {
		id: row.id,
		name: row.name || row.id,
		provider: row.provider,
		api: row.api ?? "openai-responses",
		baseUrl: row.baseUrl ?? "",
		reasoning: row.reasoning,
		input: normalizeStaticCatalogInput(row.input),
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
function hasModelCatalogAliasTransportOverride(alias) {
	return Boolean(alias.api?.trim() || alias.baseUrl?.trim());
}
function hasModelCatalogAliasEndpointSurface(alias) {
	return Boolean(alias.baseUrl?.trim());
}
function findConfiguredModelCatalogProviderConfig(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider) return;
	for (const [providerId, providerConfig] of Object.entries(params.cfg?.models?.providers ?? {})) if (normalizeProviderId(providerId) === provider) return providerConfig;
}
function hasConfiguredModelCatalogProviderEndpointSurface(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider) return false;
	const config = findConfiguredModelCatalogProviderConfig({
		provider,
		cfg: params.cfg
	});
	if (config?.baseUrl?.trim()) return true;
	const modelId = params.modelId?.trim();
	if (!modelId || !Array.isArray(config?.models)) return false;
	return config.models.some((model) => Boolean(model.baseUrl?.trim()) && staticModelIdMatches({
		candidateId: model.id,
		provider,
		modelId
	}));
}
function resolveConfiguredModelCatalogProviderApi(params) {
	const provider = normalizeProviderId(params.provider);
	const config = findConfiguredModelCatalogProviderConfig({
		provider,
		cfg: params.cfg
	});
	const modelId = params.modelId?.trim();
	return (provider && modelId && Array.isArray(config?.models) ? config.models.find((candidate) => staticModelIdMatches({
		candidateId: candidate.id,
		provider,
		modelId
	})) : void 0)?.api ?? config?.api;
}
function hasUnconditionalManifestModelCatalogSuppression(params) {
	const provider = normalizeProviderId(params.provider);
	const modelId = params.modelId?.trim();
	if (!provider || !modelId) return false;
	return planManifestModelCatalogSuppressions({
		registry: { plugins: [params.plugin] },
		providerFilter: provider,
		modelFilter: modelId
	}).suppressions.some((suppression) => !suppression.when && normalizeProviderId(suppression.provider) === provider);
}
function listEligibleManifestModelCatalogAliasPlugins(params) {
	const normalizedConfig = normalizePluginsConfig(params.cfg?.plugins);
	return params.plugins.filter((plugin) => {
		if (!isActivatedManifestOwner({
			plugin,
			normalizedConfig,
			rootConfig: params.cfg
		})) return false;
		return isBundledManifestOwner(plugin) || plugin.origin === "config" || hasExplicitManifestOwnerTrust({
			plugin,
			normalizedConfig
		});
	});
}
function resolveManifestAliasTargetApi(params) {
	const providerCatalog = Object.entries(params.plugin.modelCatalog?.providers ?? {}).find(([provider]) => normalizeProviderId(provider) === params.provider)?.[1];
	if (!providerCatalog) return;
	const modelId = params.modelId?.trim();
	return (modelId ? providerCatalog.models.find((candidate) => staticModelIdMatches({
		candidateId: candidate.id,
		provider: params.provider,
		modelId
	})) : void 0)?.api ?? providerCatalog.api;
}
function resolveManifestModelCatalogProviderAlias(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider) return { kind: "none" };
	const claims = [];
	const plugins = listEligibleManifestModelCatalogAliasPlugins({
		cfg: params.cfg,
		plugins: params.plugins
	});
	for (const plugin of plugins) for (const [rawAlias, alias] of Object.entries(plugin.modelCatalog?.aliases ?? {})) {
		const normalizedAlias = normalizeProviderId(rawAlias);
		const normalizedTarget = normalizeProviderId(alias.provider);
		if (normalizedAlias !== provider || !normalizedTarget || !plugin.providers.some((providerId) => normalizeProviderId(providerId) === normalizedTarget)) continue;
		const hasApplicableSuppression = Boolean(params.modelId?.trim()) && hasUnconditionalManifestModelCatalogSuppression({
			provider,
			modelId: params.modelId,
			plugin
		});
		const hasEndpointSurface = hasModelCatalogAliasEndpointSurface(alias) || hasConfiguredModelCatalogProviderEndpointSurface({
			provider,
			modelId: params.modelId,
			cfg: params.cfg
		});
		const transportApi = resolveConfiguredModelCatalogProviderApi({
			provider,
			modelId: params.modelId,
			cfg: params.cfg
		}) ?? alias.api ?? resolveManifestAliasTargetApi({
			plugin,
			provider: normalizedTarget,
			modelId: params.modelId
		});
		const hasTransportOverride = hasModelCatalogAliasTransportOverride(alias);
		const retainsTransportAlias = hasTransportOverride && hasEndpointSurface && Boolean(transportApi) && !hasApplicableSuppression;
		const baseUrl = alias.baseUrl?.trim();
		claims.push({
			incompleteTransport: hasTransportOverride && hasEndpointSurface && !transportApi && !hasApplicableSuppression,
			targetProvider: normalizedTarget,
			retainsTransportAlias,
			transport: {
				...transportApi ? { api: transportApi } : {},
				...baseUrl ? { baseUrl } : {}
			}
		});
	}
	if (claims.length === 0) return { kind: "none" };
	if (claims.length > 1) return { kind: "conflict" };
	const claim = claims[0];
	if (!claim) return { kind: "none" };
	if (claim.incompleteTransport) return { kind: "incomplete-transport" };
	if (claim.retainsTransportAlias) return {
		kind: "transport",
		transport: claim.transport
	};
	return {
		kind: "canonical",
		provider: claim.targetProvider
	};
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
	const resolved = resolveManifestModelCatalogProviderAlias({
		provider,
		modelId: params.modelId,
		cfg: params.cfg,
		plugins
	});
	switch (resolved.kind) {
		case "canonical": return { provider: resolved.provider };
		case "transport": return {
			provider: params.provider,
			transport: resolved.transport
		};
		case "conflict":
		case "incomplete-transport": return {
			provider: params.provider,
			ambiguous: true
		};
		case "none": return { provider: params.provider };
		default: return resolved;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/model.static-catalog.ts
/**
* Resolves bundled plugin static model-catalog rows into runtime model records.
*/
function rowMatchesModel(params) {
	return params.matchesStaticModelId({
		candidateId: params.row.id,
		provider: params.provider,
		modelId: params.modelId,
		rowProvider: params.row.provider
	});
}
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
	return (metadataSnapshot ? metadataSnapshot.plugins.filter((plugin) => plugin.origin === "bundled").map(({ id, providers, modelCatalog, providerEndpoints }) => ({
		id,
		providers,
		modelCatalog,
		providerEndpoints
	})) : listOpenClawPluginManifestMetadata(params.env).flatMap((record) => {
		if (record.origin !== "bundled") return [];
		const loaded = loadPluginManifest(record.pluginDir);
		return loaded.ok ? [{
			id: loaded.manifest.id,
			providers: loaded.manifest.providers,
			modelCatalog: loaded.manifest.modelCatalog,
			providerEndpoints: loaded.manifest.providerEndpoints
		}] : [];
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
		cfg: params?.cfg,
		env: params?.env ?? process.env,
		...params?.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		workspaceDir: params?.workspaceDir
	};
	const matchesStaticModelId = params?.metadataSnapshot ? createStaticModelIdMatcher({ manifestPlugins: params.metadataSnapshot }) : staticModelIdMatches;
	return (lookup) => {
		const provider = normalizeProviderId(lookup.provider);
		if (!provider || !lookup.modelId.trim()) return;
		const metadataSnapshot = resolveBundledStaticCatalogMetadataSnapshot(catalogParams);
		const state = resolveBundledStaticCatalogState(catalogParams, metadataSnapshot);
		if (state.plugins.length === 0) return;
		let plan = state.plans.get(provider);
		if (!plan) {
			plan = planEffectiveModelCatalogRows({
				registry: { plugins: state.plugins },
				config: params?.cfg ?? {},
				providerFilter: provider
			});
			state.plans.set(provider, plan);
		}
		for (const entry of plan.entries) {
			if (entry.discovery !== "static" && !(params?.includeRuntimeDiscovery && (entry.discovery === "runtime" || entry.discovery === "refreshable"))) continue;
			const row = entry.rows.find((candidate) => rowMatchesModel({
				row: candidate,
				provider,
				modelId: lookup.modelId,
				matchesStaticModelId
			}));
			if (row) return modelFromStaticCatalogRow(row);
		}
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
		const cachedDonor = state.donorRows.get(donorKey);
		if (cachedDonor !== void 0) return cachedDonor ? {
			...modelFromStaticCatalogRow(cachedDonor),
			provider
		} : void 0;
		const findDonor = () => {
			let donors = state.plans.get("");
			if (!donors) {
				donors = planEffectiveModelCatalogRows({
					registry: { plugins: state.plugins },
					config: params?.cfg ?? {}
				});
				state.plans.set("", donors);
			}
			let donor;
			for (const entry of donors.entries) {
				if (entry.discovery !== "static" && !(params?.includeRuntimeDiscovery && (entry.discovery === "runtime" || entry.discovery === "refreshable"))) continue;
				for (const row of entry.rows) {
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
					})?.suppress) return;
					donor = row;
				}
			}
			return donor;
		};
		const donor = findDonor();
		state.donorRows.set(donorKey, donor ?? null);
		return donor ? {
			...modelFromStaticCatalogRow(donor),
			provider
		} : void 0;
	};
}
/** Resolves one bundled static-catalog model row for provider/model lookup. */
function resolveBundledStaticCatalogModel(params) {
	return createBundledStaticCatalogModelResolver({
		cfg: params.cfg,
		...params.env ? { env: params.env } : {},
		...params.includeRuntimeDiscovery !== void 0 ? { includeRuntimeDiscovery: params.includeRuntimeDiscovery } : {},
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}
	})(params);
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
			manifestRegistry: params.metadataSnapshot.manifestRegistry
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
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {}
	});
	const providers = [...preparedProviders, ...discoveredProviders];
	const preparedEntries = params.preparedStaticProviderCatalog?.entries.filter(({ provider }) => provider.pluginId !== void 0 && pluginIds.has(provider.pluginId));
	const preparedResults = preparedEntries ? new Map(preparedEntries.map(({ provider, providerConfigs }) => [`${provider.pluginId ?? ""}\0${normalizeProviderId(provider.id)}`, providerConfigs])) : void 0;
	const modelsByProvider = /* @__PURE__ */ new Map();
	for (const catalogProvider of providers) {
		const plugin = params.pluginMetadataSnapshot?.manifestRegistry.plugins.find((candidate) => candidate.id === (catalogProvider.pluginId ?? catalogProvider.id));
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
			models.push(...buildInlineProviderModels({ [provider]: providerConfig }, { providerMetadataOwners: params.providerMetadataOwners }).map((model) => completeInlineProviderModel(model, providerConfig)));
			modelsByProvider.set(provider, models);
		}
	}
	return modelsByProvider;
}
/** Reads static rows from discovery entries and captured owners without activating runtimes. */
async function loadBundledProviderStaticCatalogContextModels(params = {}) {
	const env = params.env ?? process.env;
	const metadataSnapshot = resolveBundledStaticCatalogMetadataSnapshot({
		cfg: params.cfg,
		env,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		workspaceDir: params.workspaceDir
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
		provider,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		env,
		...metadataSnapshot ? { metadataSnapshot } : {}
	}));
	const candidatePluginIds = providerScopedPluginIds === void 0 ? resolveBundledProviderCompatPluginIds({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env,
		...metadataSnapshot ? { manifestRegistry: metadataSnapshot.manifestRegistry } : {}
	}) : providerScopedPluginIds;
	const pluginIds = [...new Set(candidatePluginIds)].filter((pluginId) => staticCatalogPluginIds.has(pluginId)).toSorted((left, right) => left.localeCompare(right));
	if (pluginIds.length === 0) return [];
	return (await Promise.allSettled(pluginIds.map(async (pluginId) => await loadBundledProviderStaticCatalogModels({
		pluginIds: [pluginId],
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		env,
		preparedStaticProviderCatalog,
		...metadataSnapshot ? { providerMetadataOwners: metadataSnapshot.owners } : {},
		...metadataSnapshot ? { pluginMetadataSnapshot: metadataSnapshot } : {}
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
		let pluginIds = scopedPluginIds;
		if (!pluginIds) pluginIds = providerPluginIds.get(provider);
		if (!pluginIds) {
			pluginIds = resolveBundledProviderStaticCatalogPluginIds({
				provider,
				cfg: params.cfg,
				workspaceDir: params.workspaceDir,
				env,
				...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
			});
			providerPluginIds.set(provider, pluginIds);
		}
		if (pluginIds.length === 0) return;
		const catalogKey = pluginIds.join("\0");
		let catalog = pluginCatalogs.get(catalogKey);
		if (!catalog) {
			catalog = loadBundledProviderStaticCatalogModels({
				pluginIds,
				cfg: params.cfg,
				workspaceDir: params.workspaceDir,
				env,
				...params.preparedStaticProviderCatalog ? { preparedStaticProviderCatalog: params.preparedStaticProviderCatalog } : {},
				...params.metadataSnapshot ? {
					providerMetadataOwners: params.metadataSnapshot.owners,
					pluginMetadataSnapshot: params.metadataSnapshot
				} : {}
			});
			pluginCatalogs.set(catalogKey, catalog);
		}
		return ((await catalog).get(provider) ?? []).find((candidate) => matchesStaticModelId({
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
		provider: candidateProvider,
		cfg: params.resolverParams.cfg,
		workspaceDir: params.resolverParams.workspaceDir,
		env: params.env,
		...params.resolverParams.metadataSnapshot ? { metadataSnapshot: params.resolverParams.metadataSnapshot } : {}
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
			...typeof model.contextTokens === "number" && model.contextTokens > 0 ? { contextTokens: model.contextTokens } : {}
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
export { resolveBundledStaticCatalogModel as a, createStaticModelIdMatcher as c, resolveBundledProviderStaticCatalogModel as i, resolveProviderTransport as l, createBundledStaticCatalogModelResolver as n, resolveManifestModelCatalogProviderAliasMetadata as o, loadBundledProviderStaticCatalogContextModels as r, createPreparedConfiguredRuntimeModelLookup as s, createBundledProviderStaticCatalogContextResolver as t };
