import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { n as dedupeByKey } from "./provider-thinking-catalog-B0d_iUnw.mjs";
import { b as normalizeCatalogRouteBaseUrl } from "./model-selection-shared-0uvJbX1M.mjs";
import { s as createModelCatalogIdentityKeyResolver } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { A as getPreparedRuntimeAuthMaterializations } from "./runtime-snapshots-CBozwlR0.mjs";
import { h as runtimeAuthMetadataState } from "./runtime-snapshot-owner-BaV0Qukl.mjs";
import { t as modelCatalogRowToEntry } from "./model-catalog-entry-CgZk9Ht4.mjs";
import { n as compareModelCatalogEntries } from "./model-catalog-order-BsIDMmfd.mjs";
import { d as setPreparedModelRuntimeAuthLoader, f as setPreparedModelRuntimeAuthMaterializations, l as setPreparedModelFullCatalogAuth, p as setPreparedModelRuntimeAuthStore, r as getPreparedModelFullCatalogAuth, s as hasSamePreparedModelCatalogAuth, t as copyPreparedModelFullCatalogAuth, u as setPreparedModelRuntimeAuthLabels } from "./prepared-model-runtime-auth-Bd3e65L_.mjs";
import { a as resolvePreparedProviderStaticConfigs } from "./provider-discovery-gl0uPs1A.mjs";
import { f as prepareModelCatalogThinkingPolicies } from "./thinking-B1p5pEC8.mjs";
import { L as resolveUsableAgentCredentialModes, M as discoverModels, _ as prepareConfiguredModelAliases, g as completeConfiguredRuntimeModels, n as buildPreparedPluginModelCatalog, t as acquirePreparedMediaCapabilityProviders } from "./prepared-model-runtime.plugin-generation-BFxNT_by.mjs";
import { i as AuthStorage } from "./model-registry-BYbYxzIC.mjs";
import { r as loadBundledProviderStaticCatalogContextModels, s as createPreparedConfiguredRuntimeModelLookup } from "./model.static-catalog-Cuxwwngw.mjs";
import { n as prepareModelCatalogAuthLabels } from "./model-catalog-auth-labels-CxJ1bej6.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/prepared-model-runtime.full-catalog.ts
const fullModelCatalogSnapshots = /* @__PURE__ */ new WeakSet();
function catalogPublicationContent(catalog) {
	const { pendingProviders: _pending, refreshFailed: _failed, ...inventory } = catalog;
	const byProvider = (rows = []) => rows.toSorted((left, right) => left.provider.localeCompare(right.provider));
	const auth = getPreparedModelFullCatalogAuth(catalog);
	return {
		...inventory,
		entries: byProvider(catalog.entries),
		routeVariants: byProvider(catalog.routeVariants),
		staticEntries: byProvider(catalog.staticEntries),
		providerOutcomes: byProvider(catalog.providerOutcomes),
		authoritative: catalog.authoritative !== false,
		full: isPreparedModelCatalogFull(catalog),
		auth: auth && {
			modes: auth.authModes,
			labels: auth.providerAuthLabels,
			metadata: runtimeAuthMetadataState(auth.authStore)
		}
	};
}
/** Keep inventory identity stable across renewals while adopting the latest private auth. */
function retainPreparedModelCatalogPublication(catalog, previous) {
	if (!catalog || !previous || !isDeepStrictEqual(catalogPublicationContent(catalog), catalogPublicationContent(previous))) return catalog;
	copyPreparedModelFullCatalogAuth(catalog, previous);
	return previous;
}
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
		entries: dedupeByKey([...native.entries.filter((entry) => entry.nativeRuntime), ...providers.entries.filter((entry) => !entry.nativeRuntime)], keyOf),
		routeVariants: dedupeByKey([...native.routeVariants.filter((entry) => entry.nativeRuntime), ...providers.routeVariants.filter((entry) => !entry.nativeRuntime)], (entry) => JSON.stringify([
			keyOf(entry),
			entry.nativeRuntime ?? "",
			entry.api ?? "",
			normalizeCatalogRouteBaseUrl(entry.baseUrl) ?? ""
		]))
	};
}
function filterPreparedProviderCatalog(catalog, includesProvider) {
	return {
		...catalog,
		entries: catalog.entries.filter((entry) => includesProvider(entry.provider)),
		routeVariants: catalog.routeVariants.filter((entry) => includesProvider(entry.provider)),
		staticEntries: catalog.staticEntries?.filter((entry) => includesProvider(entry.provider)),
		providerOutcomes: catalog.providerOutcomes?.filter((outcome) => includesProvider(outcome.provider))
	};
}
function mergePreparedProviderCatalog(previous, discovered, providers, normalize) {
	const retained = previous && filterPreparedProviderCatalog(previous, (provider) => !providers.has(normalize(provider)));
	const scoped = filterPreparedProviderCatalog(discovered, (provider) => providers.has(normalize(provider)));
	const outcomes = [...retained?.providerOutcomes ?? [], ...scoped.providerOutcomes ?? []];
	return {
		...scoped,
		entries: [...retained?.entries ?? [], ...scoped.entries],
		routeVariants: [...retained?.routeVariants ?? [], ...scoped.routeVariants],
		staticEntries: [...retained?.staticEntries ?? [], ...scoped.staticEntries ?? []],
		providerOutcomes: outcomes,
		authoritative: outcomes.every((outcome) => outcome.status === "ready")
	};
}
function listExpiredPreparedModelCatalogProviders(inventory, now) {
	return [...inventory.providers].filter(([, { expiresAt }]) => expiresAt !== void 0 && expiresAt <= now).map(([provider]) => provider);
}
/** A failed renewal keeps rows but must not retain a successful discovery deadline. */
function expirePreparedModelCatalogProviders(inventory, providerIds) {
	const providers = new Map(inventory.providers);
	for (const provider of providerIds ?? providers.keys()) {
		const facts = providers.get(provider);
		if (facts) {
			const { source, credentials } = facts;
			providers.set(provider, {
				source,
				credentials
			});
		}
	}
	return {
		...inventory,
		providers
	};
}
function prepareModelCatalogPublication(discovered, runtimeModels, inventory, auth, normalizeProvider) {
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
	if (failed.length === 0) return {
		catalog,
		discoveryOrigins,
		runtimeModels
	};
	const previous = inventory?.catalog;
	const previousAuth = previous && getPreparedModelFullCatalogAuth(previous);
	const starterProviders = new Set(failed.map(({ provider }) => normalizeProvider(provider)).filter((provider) => !discoveryOrigins.some((origin) => origin.provider === provider)));
	const starters = (catalog.staticEntries ?? []).filter((entry) => !entry.nativeRuntime && starterProviders.has(normalizeProvider(entry.provider)));
	const retainedProviders = new Set(failed.flatMap((outcome) => {
		const provider = normalizeProvider(outcome.provider);
		const previousOrigins = inventory?.discoveryOrigins.filter((candidate) => normalizeProvider(candidate.provider) === provider);
		if (discoveryOrigins.some((origin) => origin.provider === provider) || !previousOrigins?.length && ![...previous?.entries ?? [], ...previous?.routeVariants ?? []].some((entry) => !entry.nativeRuntime && normalizeProvider(entry.provider) === provider) || !previousOrigins?.length && previous?.providerOutcomes?.some((candidate) => normalizeProvider(candidate.provider) === provider) || !previousAuth || !previousAuth.credentials || !auth.credentials || outcome.profileId !== void 0 && !previousOrigins?.some((candidate) => candidate.profileId === outcome.profileId) || previousAuth.authModes[provider] !== auth.authModes[provider]) return [];
		return hasSamePreparedModelCatalogAuth(previousAuth, auth, (candidate) => normalizeProvider(candidate) === provider) ? [provider] : [];
	}));
	const retain = (current, retained, key = createModelCatalogIdentityKeyResolver()) => dedupeByKey([...[...current, ...starters].filter((entry) => !retainedProviders.has(normalizeProvider(entry.provider))), ...retained.filter((entry) => !entry.nativeRuntime && retainedProviders.has(normalizeProvider(entry.provider)))], key).toSorted(compareModelCatalogEntries);
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
	return {
		catalog: published,
		runtimeModels: new Map([...[...runtimeModels].filter(([provider]) => !retainedProviders.has(normalizeProvider(provider))), ...[...inventory?.runtimeModels ?? []].filter(([provider]) => retainedProviders.has(normalizeProvider(provider)))]),
		discoveryOrigins: [...discoveryOrigins, ...(inventory?.discoveryOrigins ?? []).filter((origin) => retainedProviders.has(normalizeProvider(origin.provider)))]
	};
}
/** Reprojects retained inventory without carrying capabilities from a retired runtime. */
function materializePreparedModelCatalog(snapshot, runtimeCapabilityModels, configuredStaticEntries = []) {
	const materialized = { ...snapshot };
	const sourceEntries = snapshot.entries;
	const identityKey = createModelCatalogIdentityKeyResolver();
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
			...runtime.reasoning !== void 0 ? { reasoning: runtime.reasoning } : {},
			...params ? { params } : {},
			...compat ? { compat } : {}
		};
	});
	materialized.entries = project(sourceEntries);
	materialized.routeVariants = project(snapshot.routeVariants);
	if (snapshot.staticEntries || configuredStaticEntries.length > 0) materialized.staticEntries = project(dedupeByKey([...configuredStaticEntries, ...snapshot.staticEntries ?? []], identityKey));
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
		providers: pluginRegistry?.providers
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
		authModes: resolveUsableAgentCredentialModes(credentials),
		metadataSnapshot: pluginMetadataSnapshot,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true,
		...pluginRegistry ? { pluginRegistry } : {},
		...messageToolCatalog ? { messageToolCatalog } : {},
		...mediaCapabilityProviders ? { mediaCapabilityProviders } : {},
		...mediaCapabilityProviderSource && mediaCapabilityProviders ? { acquireMediaCapabilityProviders: () => acquirePreparedMediaCapabilityProviders(mediaCapabilityProviderSource, mediaCapabilityProviders, pluginRegistry ?? mediaCapabilityProviderSource.registry) } : {},
		modelCatalog: catalogAccess.withRefreshStatus(modelCatalog),
		readFullModelCatalog: catalogAccess.readFullModelCatalog,
		readPublishedModelCatalog: catalogAccess.readPublishedModelCatalog,
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
	setPreparedModelRuntimeAuthLabels(snapshot, withPluginRuntimeGenerationScope({
		metadataSnapshot: pluginMetadataSnapshot,
		pluginRegistry
	}, () => prepareModelCatalogAuthLabels({
		config: input.config,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir,
		env: agentFacts.env,
		store: agentFacts.authStore,
		providers: [
			...agentFacts.providerIds,
			...modelCatalog.entries.map((entry) => entry.provider),
			...Object.values(agentFacts.authStore.profiles).map((profile) => profile.provider)
		]
	})));
	setPreparedModelRuntimeAuthStore(snapshot, agentFacts.authStore);
	setPreparedModelRuntimeAuthLoader(snapshot, catalogAccess.loadAuth);
	setPreparedModelRuntimeAuthMaterializations(snapshot, Object.freeze([...getPreparedRuntimeAuthMaterializations(input.agentDir)]));
	return snapshot;
}
//#endregion
export { listExpiredPreparedModelCatalogProviders as a, mergePreparedNativeCatalog as c, prepareModelCatalogPublication as d, retainPreparedModelCatalogPublication as f, isPreparedModelCatalogFull as i, mergePreparedProviderCatalog as l, expirePreparedModelCatalogProviders as n, markPreparedModelCatalogFull as o, filterPreparedProviderCatalog as r, materializePreparedModelCatalog as s, createPreparedModelRuntimeSnapshot as t, prepareFullCatalogFacts as u };
