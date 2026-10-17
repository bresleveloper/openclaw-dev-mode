import { u as asPositiveFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as modelTransportRoutesMatch } from "./model-compat-catalog-Dfj3P1T4.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { b as overlayCatalogMetadata } from "./model-selection-shared-DKlQ1p0S.mjs";
import { t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-CVmOODN3.mjs";
import { A as getPreparedRuntimeAuthMaterializations } from "./runtime-snapshots-CSLjByUx.mjs";
import { c as hasSamePreparedModelCatalogAuth, i as getPreparedModelFullCatalogAuth, n as copyPreparedModelFullCatalogAuth, t as bindPreparedModelRuntimeAuth, u as setPreparedModelFullCatalogAuth } from "./prepared-model-runtime-auth-Dn7HF9Vu.mjs";
import { a as resolvePreparedProviderStaticConfigs } from "./provider-discovery-BkPgLJBP.mjs";
import { p as prepareModelCatalogThinkingPolicies } from "./thinking-NbdrO8vA.mjs";
import { N as discoverModels, _ as completeConfiguredRuntimeModels, n as buildPreparedPluginModelCatalog, t as acquirePreparedMediaCapabilityProviders, v as prepareConfiguredModelAliases } from "./prepared-model-runtime.plugin-generation-i7pfklM1.mjs";
import { i as AuthStorage } from "./model-registry-DKSOyLSb.mjs";
import { r as loadBundledProviderStaticCatalogContextModels, s as createPreparedConfiguredRuntimeModelLookup } from "./model.static-catalog-TiEprsUC.mjs";
import { n as modelCatalogRouteVariantKey, r as modelCatalogRowToEntry, t as enrichHarnessRows } from "./model-catalog-entry-BfooR5F2.mjs";
import { n as compareModelCatalogEntries } from "./model-catalog-order-Cq-GKb0A.mjs";
//#region src/agents/prepared-model-runtime.full-catalog.ts
const fullModelCatalogSnapshots = /* @__PURE__ */ new WeakSet();
/** Builds complete inventory before generation-specific runtime capability projection. */
async function prepareFullCatalogFacts(agentFacts, pluginGeneration, catalogMode, catalogSource, options = {}) {
	const prepare = async () => {
		const { env, input, templateAuthStorage } = agentFacts;
		const { pluginMetadataSnapshot, preparedStaticProviderCatalog } = pluginGeneration;
		const observedProviders = new Set(catalogSource.providerOutcomes?.map(({ provider }) => normalizeProviderId(provider)));
		const templateModelRegistry = discoverModels(templateAuthStorage, input.agentDir, {
			config: input.config,
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
			pluginMetadataSnapshot,
			...catalogMode === "static" ? { normalizeModels: false } : {},
			includePluginCatalogs: true,
			modelsJsonContents: catalogSource.modelsJsonContents,
			pluginCatalogs: catalogSource.pluginCatalogs,
			staticProviderConfigs: Object.fromEntries(Object.entries(resolvePreparedProviderStaticConfigs(preparedStaticProviderCatalog)).filter(([provider]) => !observedProviders.has(normalizeProviderId(provider))))
		});
		const modelCatalog = await buildPreparedPluginModelCatalog({
			...options,
			agentFacts,
			catalogMode,
			modelRegistry: templateModelRegistry,
			providerOutcomes: catalogSource.providerOutcomes,
			pluginGeneration
		});
		const providerStaticModels = input.config.models?.mode === "replace" ? [] : pluginGeneration.providerStaticModels ?? await loadBundledProviderStaticCatalogContextModels({
			cfg: input.config,
			env,
			metadataSnapshot: pluginMetadataSnapshot,
			registeredProviders: pluginGeneration.pluginRegistry?.providers,
			providerIds: options.providerIds,
			...preparedStaticProviderCatalog ? { preparedStaticProviderCatalog } : {},
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
		});
		const configuredRuntimeModels = completeConfiguredRuntimeModels(agentFacts, pluginGeneration, templateModelRegistry);
		const providerOutcomes = catalogSource.providerOutcomes ?? [];
		const completeModelCatalog = {
			...modelCatalog,
			staticEntries: input.config.models?.mode === "replace" ? [] : dedupeByKey(providerStaticModels, createModelCatalogIdentityKeyResolver()).map(modelCatalogRowToEntry),
			...providerOutcomes.length > 0 ? { providerOutcomes } : {}
		};
		if (catalogMode === "live") fullModelCatalogSnapshots.add(completeModelCatalog);
		return {
			templateModelRegistry,
			modelCatalog: completeModelCatalog,
			configuredRuntimeModels,
			inlineProviderModels: pluginGeneration.inlineProviderModels
		};
	};
	return pluginGeneration.pluginRegistry ? withPluginRuntimeGenerationScope({
		metadataSnapshot: pluginGeneration.pluginMetadataSnapshot,
		pluginRegistry: pluginGeneration.pluginRegistry
	}, prepare) : prepare();
}
function mergePreparedNativeCatalog(native, providers) {
	const keyOf = createModelCatalogIdentityKeyResolver();
	return {
		...providers,
		nativeProviderOutcomes: native.nativeProviderOutcomes,
		nativeHostRows: native.nativeHostRows,
		entries: dedupeByKey([...native.entries.filter((entry) => entry.nativeRuntime), ...[...providers.entries, ...providers.routeVariants].filter((entry) => !entry.nativeRuntime)], keyOf),
		routeVariants: dedupeByKey([...native.routeVariants.filter((entry) => entry.nativeRuntime), ...providers.routeVariants.filter((entry) => !entry.nativeRuntime)], (entry) => modelCatalogRouteVariantKey(entry, keyOf(entry)))
	};
}
function filterNativeModelCatalogScopes(scopes, includesProvider) {
	return scopes && Object.fromEntries(Object.entries(scopes).map(([runtime, rows]) => [runtime, rows.filter(({ provider }) => includesProvider(provider))]));
}
function filterPreparedProviderCatalog(catalog, includesProvider) {
	return {
		...catalog,
		entries: catalog.entries.filter((entry) => includesProvider(entry.provider)),
		routeVariants: catalog.routeVariants.filter((entry) => includesProvider(entry.provider)),
		staticEntries: catalog.staticEntries?.filter((entry) => includesProvider(entry.provider)),
		providerOutcomes: catalog.providerOutcomes?.filter((outcome) => includesProvider(outcome.provider)),
		nativeProviderOutcomes: filterNativeModelCatalogScopes(catalog.nativeProviderOutcomes, includesProvider),
		nativeHostRows: filterNativeModelCatalogScopes(catalog.nativeHostRows, includesProvider)
	};
}
function selectPreparedModelCatalogInventory(inventory, includesProvider) {
	return {
		...inventory,
		catalog: filterPreparedProviderCatalog(inventory.catalog, includesProvider),
		runtimeModels: new Map([...inventory.runtimeModels].filter(([provider]) => includesProvider(provider))),
		providers: new Map([...inventory.providers].filter(([provider]) => includesProvider(provider))),
		discoveryOrigins: inventory.discoveryOrigins.filter(({ provider }) => includesProvider(provider))
	};
}
function mergePreparedModelCatalogInventory(previous, discovered, providers, normalize) {
	const retained = previous && selectPreparedModelCatalogInventory(previous, (provider) => !providers.has(normalize(provider)));
	const catalog = discovered.catalog;
	const before = retained?.catalog;
	const outcomes = [...before?.providerOutcomes ?? [], ...catalog.providerOutcomes ?? []];
	return {
		...discovered,
		catalog: {
			...catalog,
			entries: [...before?.entries ?? [], ...catalog.entries],
			routeVariants: [...before?.routeVariants ?? [], ...catalog.routeVariants],
			staticEntries: [...before?.staticEntries ?? [], ...catalog.staticEntries ?? []],
			providerOutcomes: outcomes,
			authoritative: outcomes.every((outcome) => outcome.status === "ready")
		},
		runtimeModels: new Map([...retained?.runtimeModels ?? [], ...discovered.runtimeModels]),
		providers: new Map([...retained?.providers ?? [], ...discovered.providers]),
		discoveryOrigins: [...retained?.discoveryOrigins ?? [], ...discovered.discoveryOrigins]
	};
}
function prepareModelCatalogPublication(discovered, runtimeModels, inventory, auth, normalizeProvider, hookRows) {
	const catalog = {
		...discovered,
		entries: dedupeByKey([...discovered.entries, ...discovered.routeVariants].filter((entry) => !entry.nativeRuntime), createModelCatalogIdentityKeyResolver()),
		routeVariants: discovered.routeVariants.filter((entry) => !entry.nativeRuntime)
	};
	setPreparedModelFullCatalogAuth(catalog, auth);
	const failed = catalog.providerOutcomes?.filter((outcome) => outcome.status !== "ready") ?? [];
	const discoveryOrigins = (catalog.providerOutcomes ?? []).filter((outcome) => outcome.status === "ready").map(({ provider, profileId }) => ({
		provider: normalizeProvider(provider),
		profileId
	}));
	const identityKey = createModelCatalogIdentityKeyResolver();
	const rowKey = (entry) => modelCatalogRouteVariantKey(entry, identityKey({
		provider: normalizeProvider(entry.provider),
		id: entry.id
	}));
	const acceptedRows = /* @__PURE__ */ new Map();
	for (const [owner, keys] of hookRows) {
		const provider = normalizeProvider(owner);
		const accepted = acceptedRows.get(provider) ?? /* @__PURE__ */ new Set();
		for (const key of keys) accepted.add(key);
		acceptedRows.set(provider, accepted);
	}
	const outcomeProviders = new Set(catalog.providerOutcomes?.map((outcome) => normalizeProvider(outcome.provider)));
	const legacyRows = /* @__PURE__ */ new Map();
	for (const entry of [...catalog.entries, ...catalog.routeVariants]) {
		const provider = normalizeProvider(entry.provider);
		const key = rowKey(entry);
		if (outcomeProviders.has(provider) || !acceptedRows.get(provider)?.has(key)) continue;
		const keys = legacyRows.get(provider) ?? /* @__PURE__ */ new Set();
		keys.add(key);
		legacyRows.set(provider, keys);
	}
	if (failed.length === 0) return {
		catalog,
		discoveryOrigins,
		runtimeModels,
		legacyRows
	};
	const previous = inventory?.catalog;
	const previousAuth = previous && getPreparedModelFullCatalogAuth(previous);
	const previousLegacyRows = /* @__PURE__ */ new Map();
	for (const entry of [...previous?.entries ?? [], ...previous?.routeVariants ?? []]) {
		const provider = normalizeProvider(entry.provider);
		const key = rowKey(entry);
		if (!entry.nativeRuntime && inventory?.providers.get(provider)?.legacyRows?.has(key)) {
			const keys = previousLegacyRows.get(provider) ?? /* @__PURE__ */ new Set();
			keys.add(key);
			previousLegacyRows.set(provider, keys);
		}
	}
	const starterProviders = new Set(failed.map(({ provider }) => normalizeProvider(provider)).filter((provider) => !discoveryOrigins.some((origin) => origin.provider === provider)));
	const starters = (catalog.staticEntries ?? []).filter((entry) => !entry.nativeRuntime && starterProviders.has(normalizeProvider(entry.provider)));
	const retainedProviders = new Set(failed.flatMap((outcome) => {
		const provider = normalizeProvider(outcome.provider);
		const previousOrigins = inventory?.discoveryOrigins.filter((candidate) => normalizeProvider(candidate.provider) === provider);
		const hasLegacyInventory = Boolean(previousLegacyRows.get(provider)?.size);
		if (discoveryOrigins.some((origin) => origin.provider === provider) || !previousOrigins?.length && !hasLegacyInventory || !previousAuth || !previousAuth.credentials || !auth.credentials || outcome.profileId !== void 0 && !previousOrigins?.some((candidate) => candidate.profileId === outcome.profileId) || previousAuth.authModes[provider] !== auth.authModes[provider]) return [];
		return hasSamePreparedModelCatalogAuth(previousAuth, auth, (candidate) => normalizeProvider(candidate) === provider) ? [provider] : [];
	}));
	const discoveredRetainedProviders = new Set([...retainedProviders].filter((provider) => inventory?.discoveryOrigins.some((origin) => normalizeProvider(origin.provider) === provider)));
	for (const [provider, keys] of previousLegacyRows) if (retainedProviders.has(provider) && !discoveredRetainedProviders.has(provider)) legacyRows.set(provider, keys);
	const retain = (current, retained, key = createModelCatalogIdentityKeyResolver()) => dedupeByKey([
		...current.filter((entry) => !discoveredRetainedProviders.has(normalizeProvider(entry.provider)) && !(retainedProviders.has(normalizeProvider(entry.provider)) && legacyRows.get(normalizeProvider(entry.provider))?.has(rowKey(entry)))),
		...starters.filter((entry) => !retainedProviders.has(normalizeProvider(entry.provider))),
		...retained.filter((entry) => !entry.nativeRuntime && retainedProviders.has(normalizeProvider(entry.provider)) && (discoveredRetainedProviders.has(normalizeProvider(entry.provider)) || legacyRows.get(normalizeProvider(entry.provider))?.has(rowKey(entry))))
	], key).toSorted(compareModelCatalogEntries);
	const routeKeyOf = createModelCatalogIdentityKeyResolver();
	const published = {
		...catalog,
		entries: retain(catalog.entries, previous?.entries ?? []),
		routeVariants: retain(catalog.routeVariants, previous?.routeVariants ?? [], (entry) => JSON.stringify([
			routeKeyOf(entry),
			entry.api,
			entry.baseUrl,
			entry.nativeRuntime
		])),
		authoritative: false
	};
	setPreparedModelFullCatalogAuth(published, auth);
	const publishedRuntimeModels = new Map([...runtimeModels].filter(([provider]) => !discoveredRetainedProviders.has(normalizeProvider(provider))));
	for (const [provider, models] of inventory?.runtimeModels ?? []) {
		const normalized = normalizeProvider(provider);
		if (discoveredRetainedProviders.has(normalized)) publishedRuntimeModels.set(provider, models);
		else if (retainedProviders.has(normalized)) publishedRuntimeModels.set(provider, dedupeByKey([...(publishedRuntimeModels.get(provider) ?? []).filter((model) => !legacyRows.get(normalized)?.has(rowKey(modelCatalogRowToEntry(model)))), ...models.filter((model) => legacyRows.get(normalized)?.has(rowKey(modelCatalogRowToEntry(model))))], (model) => rowKey(modelCatalogRowToEntry(model))));
	}
	return {
		catalog: published,
		runtimeModels: publishedRuntimeModels,
		legacyRows,
		discoveryOrigins: [...discoveryOrigins, ...(inventory?.discoveryOrigins ?? []).filter((origin) => retainedProviders.has(normalizeProvider(origin.provider)))]
	};
}
/** Reprojects retained inventory without carrying capabilities from a retired runtime. */
function materializePreparedModelCatalog(snapshot, runtimeCapabilityModels, configuredStaticEntries = [], acceptedDiscoveryProviders = /* @__PURE__ */ new Set()) {
	const materialized = { ...snapshot };
	const sourceEntries = snapshot.entries;
	const sourceRoutes = [...sourceEntries, ...snapshot.routeVariants];
	const supersedingEntry = (entry) => acceptedDiscoveryProviders.has(normalizeProviderId(entry.provider)) && entry.contextWindowSource === "synthetic" ? sourceRoutes.find((accepted) => !accepted.nativeRuntime && accepted.provider === entry.provider && accepted.id === entry.id && Boolean(accepted.api) && accepted.api === entry.api && modelTransportRoutesMatch(accepted, entry) && (accepted.contextTokens ?? (accepted.contextWindowSource === "synthetic" ? void 0 : accepted.contextWindow) ?? 0) > 0) : void 0;
	const identityKey = createModelCatalogIdentityKeyResolver();
	const hostRows = enrichHarnessRows(Object.values(snapshot.nativeHostRows ?? {}).flat(), snapshot);
	const runtimeByKey = new Map(runtimeCapabilityModels.map(({ provider, modelId, model }) => [identityKey({
		provider,
		id: modelId
	}), modelCatalogRowToEntry(model)]));
	const project = (entries) => entries.map((entry) => {
		const runtime = runtimeByKey.get(identityKey(entry));
		if (!runtime) return entry;
		const thinkingPolicyProvider = runtime.provider;
		if (entry.configuredReasoning !== void 0) return {
			...entry,
			thinkingPolicyProvider
		};
		const params = runtime.params || entry.params ? {
			...runtime.params,
			...entry.params
		} : void 0;
		const compat = runtime.compat || entry.compat ? {
			...runtime.compat,
			...entry.compat
		} : void 0;
		return {
			...entry,
			thinkingPolicyProvider,
			...runtime.reasoning !== void 0 && (entry.reasoning === void 0 || !supersedingEntry(runtime)) ? { reasoning: runtime.reasoning } : {},
			...params ? { params } : {},
			...compat ? { compat } : {}
		};
	});
	materialized.entries = project(hostRows.length ? dedupeByKey([
		...sourceEntries.filter((entry) => entry.nativeRuntime),
		...hostRows,
		...sourceEntries
	], identityKey) : sourceEntries);
	materialized.routeVariants = project(hostRows.length ? dedupeByKey([...hostRows, ...snapshot.routeVariants], (entry) => modelCatalogRouteVariantKey(entry, identityKey(entry))) : snapshot.routeVariants);
	if (snapshot.staticEntries || configuredStaticEntries.length > 0) materialized.staticEntries = project(dedupeByKey([...configuredStaticEntries, ...snapshot.staticEntries ?? []].flatMap((entry) => {
		const accepted = supersedingEntry(entry);
		if (!accepted) return [entry];
		const promptCap = asPositiveFiniteNumber(entry.contextTokens);
		const { contextWindow: _syntheticWindow, contextWindowSource: _syntheticSource, contextTokens: _configuredPrompt, reasoning: fallbackReasoning, ...configuredMetadata } = entry;
		const reportedPrompt = asPositiveFiniteNumber(accepted.contextTokens);
		return [overlayCatalogMetadata(accepted, {
			...configuredMetadata,
			...entry.configuredReasoning !== void 0 ? { reasoning: fallbackReasoning } : {},
			...promptCap !== void 0 ? { contextTokens: Math.min(promptCap, reportedPrompt ?? promptCap) } : {}
		})];
	}), identityKey));
	if (isPreparedModelCatalogFull(snapshot)) markPreparedModelCatalogFull(materialized);
	copyPreparedModelFullCatalogAuth(snapshot, materialized);
	return materialized;
}
/** Reports whether a catalog came from the complete prepared-catalog build path. */
const isPreparedModelCatalogFull = (snapshot) => fullModelCatalogSnapshots.has(snapshot);
/** Restores process-local provenance after a complete catalog crosses a worker boundary. */
function markPreparedModelCatalogFull(snapshot) {
	fullModelCatalogSnapshots.add(snapshot);
	return snapshot;
}
function createPreparedModelRuntimeSnapshot(catalogOwner, agentFacts, pluginGeneration, catalogFacts, catalogAccess, publishedConfig = agentFacts.input.config) {
	const { credentials, input } = agentFacts;
	const { mediaCapabilityProviders, mediaCapabilityProviderSource, messageToolCatalog, pluginMetadataSnapshot, pluginRegistry } = pluginGeneration;
	const { configuredRuntimeModels, inlineProviderModels, templateModelRegistry } = catalogFacts;
	const modelCatalog = materializePreparedModelCatalog(catalogFacts.modelCatalog, agentFacts.runtimeCapabilityModels, input.config.models?.mode === "replace" ? [] : configuredRuntimeModels.map(({ model }) => modelCatalogRowToEntry(model)));
	prepareModelCatalogThinkingPolicies({
		catalog: modelCatalog,
		metadataSnapshot: pluginMetadataSnapshot,
		pluginRegistry
	});
	const createStores = () => {
		const authStorage = AuthStorage.inMemory(credentials);
		return {
			authStorage,
			modelRegistry: templateModelRegistry.fork(authStorage)
		};
	};
	const snapshot = Object.freeze({
		catalogOwner,
		...input.agentId ? { agentId: input.agentId } : {},
		agentDir: input.agentDir,
		activeProjectKeys: [],
		...input.inheritedAuthDir ? { inheritedAuthDir: input.inheritedAuthDir } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		config: publishedConfig,
		observationConfig: input.config,
		isCurrent: catalogAccess.isCurrent,
		accountCatalog: catalogAccess.accountCatalog,
		authModes: catalogAccess.initialAuth.authModes,
		metadataSnapshot: pluginMetadataSnapshot,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true,
		...pluginRegistry ? { pluginRegistry } : {},
		...messageToolCatalog ? { messageToolCatalog } : {},
		...mediaCapabilityProviders ? { mediaCapabilityProviders } : {},
		...mediaCapabilityProviderSource && mediaCapabilityProviders ? { acquireMediaCapabilityProviders: () => acquirePreparedMediaCapabilityProviders(mediaCapabilityProviderSource, mediaCapabilityProviders, pluginRegistry ?? mediaCapabilityProviderSource.registry) } : {},
		modelCatalog: catalogAccess.withRefreshStatus(modelCatalog),
		readFullModelCatalog: catalogAccess.readFullModelCatalog,
		refreshExpiredModelCatalog: catalogAccess.refreshExpiredModelCatalog,
		readPublishedModels: catalogAccess.readPublishedModels,
		loadFullModelCatalog: catalogAccess.loadFullModelCatalog,
		loadNativeModelCatalog: catalogAccess.loadNativeModelCatalog,
		configuredRuntimeModels,
		configuredModelAliases: prepareConfiguredModelAliases(agentFacts, pluginGeneration, templateModelRegistry, configuredRuntimeModels),
		findConfiguredRuntimeModel: createPreparedConfiguredRuntimeModelLookup(configuredRuntimeModels, pluginMetadataSnapshot),
		inlineProviderModels,
		createStores,
		routeModelResolutionMemo: /* @__PURE__ */ new Map()
	});
	bindPreparedModelRuntimeAuth(snapshot, {
		labels: catalogAccess.initialAuth.providerAuthLabels,
		store: catalogAccess.initialAuth.authStore,
		load: catalogAccess.loadAuth,
		materializations: Object.freeze([...getPreparedRuntimeAuthMaterializations(input.agentDir)])
	});
	return snapshot;
}
//#endregion
export { markPreparedModelCatalogFull as a, mergePreparedNativeCatalog as c, selectPreparedModelCatalogInventory as d, isPreparedModelCatalogFull as i, prepareFullCatalogFacts as l, filterNativeModelCatalogScopes as n, materializePreparedModelCatalog as o, filterPreparedProviderCatalog as r, mergePreparedModelCatalogInventory as s, createPreparedModelRuntimeSnapshot as t, prepareModelCatalogPublication as u };
