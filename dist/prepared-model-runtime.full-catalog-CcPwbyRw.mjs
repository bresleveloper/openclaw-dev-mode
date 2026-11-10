import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { N as getPreparedRuntimeAuthMaterializations } from "./runtime-snapshots-HRosak4u.mjs";
import { n as modelTransportRoutesMatch } from "./model-compat-catalog-VI3Psdyr.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { x as overlayCatalogMetadata } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-BJEokkWC.mjs";
import { p as prepareModelCatalogThinkingPolicies } from "./thinking-BCNoGfZ5.mjs";
import { n as modelCatalogRouteVariantKey, r as modelCatalogRowToEntry, t as enrichHarnessRows } from "./model-catalog-entry-BWd5zbsm.mjs";
import { a as loadManifestModelProviderConfigs, t as buildPreparedModelCatalogSnapshot } from "./model-catalog-vYmFg90_.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-C4C-simP.mjs";
import { n as copyPreparedModelFullCatalogAuth, t as bindPreparedModelRuntimeAuth } from "./prepared-model-runtime-auth-xGBK6WuU.mjs";
import { a as resolvePreparedProviderStaticConfigs } from "./provider-discovery-VU-K7aKK.mjs";
import { _ as discoverModelsAsync, a as completeConfiguredRuntimeModels, o as prepareConfiguredModelAliases, t as acquirePreparedMediaCapabilityProviders } from "./prepared-model-runtime.plugin-generation-DCZXy8Yr.mjs";
import { t as AuthStorage } from "./auth-storage-DHC97REI.mjs";
import { n as completeInlineProviderModel, t as buildInlineProviderModels } from "./model.inline-provider-DwjZUIZW.mjs";
import { r as loadBundledProviderStaticCatalogContextModels, s as createPreparedConfiguredRuntimeModelLookup } from "./model.static-catalog-JSpbzt04.mjs";
import { n as augmentPreparedModelCatalogWithAgentHarness } from "./model-catalog-DOoxeZxV.mjs";
//#region src/agents/prepared-model-runtime.full-catalog.ts
const fullModelCatalogSnapshots = /* @__PURE__ */ new WeakSet();
/** Builds complete inventory before generation-specific runtime capability projection. */
async function prepareFullCatalogFacts(agentFacts, pluginGeneration, catalogMode, catalogSource, options = {}) {
	const prepare = async () => {
		const { env, input, templateAuthStorage } = agentFacts;
		const { pluginMetadataSnapshot, pluginRegistry, preparedStaticProviderCatalog } = pluginGeneration;
		const observedProviders = new Set(catalogSource.providerOutcomes?.map(({ provider }) => normalizeProviderId(provider)));
		const templateModelRegistry = await discoverModelsAsync(templateAuthStorage, input.agentDir, {
			config: input.config,
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
			pluginMetadataSnapshot,
			...catalogMode === "static" ? { normalizeModels: false } : {},
			includePluginCatalogs: true,
			modelsJsonContents: catalogSource.modelsJsonContents,
			pluginCatalogs: catalogSource.pluginCatalogs,
			staticProviderConfigs: Object.fromEntries(Object.entries(resolvePreparedProviderStaticConfigs(preparedStaticProviderCatalog)).filter(([provider]) => !observedProviders.has(normalizeProviderId(provider))))
		});
		const catalogModels = templateModelRegistry.getAll();
		const snapshot = await buildPreparedModelCatalogSnapshot({
			agentDir: input.agentDir,
			authCredentials: agentFacts.credentials,
			config: input.config,
			models: catalogModels,
			metadataSnapshot: pluginMetadataSnapshot,
			providerOutcomes: catalogSource.providerOutcomes,
			includeProviderPluginAugmentation: catalogMode === "live",
			providerIds: options.providerIds,
			...input.env ? { env: input.env } : {},
			...input.readOnly ? { readOnly: true } : {},
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
		});
		const modelCatalog = catalogMode === "live" && options.includeNative !== false ? await augmentPreparedModelCatalogWithAgentHarness({
			input,
			snapshot,
			pluginRegistry
		}) : snapshot;
		const providerStaticModels = input.config.models?.mode === "replace" ? [] : pluginGeneration.providerStaticModels ?? await loadBundledProviderStaticCatalogContextModels({
			cfg: input.config,
			env,
			metadataSnapshot: pluginMetadataSnapshot,
			registeredProviders: pluginGeneration.pluginRegistry?.providers,
			providerIds: options.providerIds,
			...preparedStaticProviderCatalog ? { preparedStaticProviderCatalog } : {},
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
		});
		const credentialProviders = Object.keys(agentFacts.credentials).map(normalizeProviderId);
		const scopedProviders = options.providerIds && new Set(options.providerIds.map(normalizeProviderId));
		const manifestStaticModels = Object.entries(loadManifestModelProviderConfigs({
			config: input.config,
			metadataSnapshot: pluginMetadataSnapshot,
			providerIds: credentialProviders.filter((provider) => scopedProviders?.has(provider) ?? true)
		})).flatMap(([provider, providerConfig]) => buildInlineProviderModels({ [provider]: providerConfig }, { providerMetadataOwners: pluginMetadataSnapshot.owners }).map((model) => completeInlineProviderModel(model, providerConfig)));
		const configuredRuntimeModels = completeConfiguredRuntimeModels(agentFacts, pluginGeneration, templateModelRegistry);
		const providerOutcomes = catalogSource.providerOutcomes ?? [];
		const normalizeProvider = createPreparedModelCatalogProviderNormalizer(pluginMetadataSnapshot, input.config, input.env);
		const completeModelCatalog = {
			...modelCatalog,
			staticEntries: input.config.models?.mode === "replace" ? [] : dedupeByKey([...providerStaticModels, ...manifestStaticModels].map((model) => {
				const entry = modelCatalogRowToEntry(model);
				entry.provider = normalizeProvider(entry.provider);
				return entry;
			}), createModelCatalogIdentityKeyResolver()),
			...providerOutcomes.length > 0 ? { providerOutcomes } : {}
		};
		if (catalogMode === "live") fullModelCatalogSnapshots.add(completeModelCatalog);
		return {
			templateModelRegistry,
			catalogModels,
			modelCatalog: completeModelCatalog,
			configuredRuntimeModels
		};
	};
	return withPluginRuntimeGenerationScope({
		metadataSnapshot: pluginGeneration.pluginMetadataSnapshot,
		pluginRegistry: pluginGeneration.pluginRegistry
	}, prepare);
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
		const { contextWindow: _syntheticWindow, contextWindowSource: _syntheticSource, contextCapacitySource: _unacceptedCapacity, contextTokens: _configuredPrompt, reasoning: fallbackReasoning, ...configuredMetadata } = entry;
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
	const { inlineProviderModels, mediaCapabilityProviders, mediaCapabilityProviderSource, messageToolCatalog, pluginMetadataSnapshot, pluginRegistry } = pluginGeneration;
	const { configuredRuntimeModels, templateModelRegistry } = catalogFacts;
	const modelCatalog = materializePreparedModelCatalog(catalogFacts.modelCatalog, agentFacts.runtimeCapabilityModels, input.config.models?.mode === "replace" ? [] : configuredRuntimeModels.map(({ model }) => modelCatalogRowToEntry(model)));
	prepareModelCatalogThinkingPolicies({
		catalog: modelCatalog,
		metadataSnapshot: pluginMetadataSnapshot,
		pluginRegistry
	});
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
		recheckNativeLogin: catalogAccess.recheckNativeLogin,
		refreshExpiredModelCatalog: catalogAccess.refreshExpiredModelCatalog,
		readPublishedModels: catalogAccess.readPublishedModels,
		loadFullModelCatalog: catalogAccess.loadFullModelCatalog,
		loadNativeModelCatalog: catalogAccess.loadNativeModelCatalog,
		configuredRuntimeModels,
		configuredModelAliases: prepareConfiguredModelAliases(agentFacts, pluginGeneration, templateModelRegistry, configuredRuntimeModels),
		findConfiguredRuntimeModel: createPreparedConfiguredRuntimeModelLookup(configuredRuntimeModels, pluginMetadataSnapshot),
		inlineProviderModels,
		createStores: () => {
			const authStorage = AuthStorage.inMemory(credentials);
			return {
				authStorage,
				modelRegistry: templateModelRegistry.fork(authStorage)
			};
		},
		routeModelResolutionMemo: /* @__PURE__ */ new Map()
	});
	bindPreparedModelRuntimeAuth(snapshot, {
		labels: catalogAccess.initialAuth.providerAuthLabels,
		store: catalogAccess.initialAuth.authStore,
		readUsage: catalogAccess.readUsage,
		load: catalogAccess.loadAuth,
		materializations: Object.freeze([...getPreparedRuntimeAuthMaterializations(input.agentDir)])
	});
	return snapshot;
}
//#endregion
export { prepareFullCatalogFacts as a, materializePreparedModelCatalog as i, isPreparedModelCatalogFull as n, markPreparedModelCatalogFull as r, createPreparedModelRuntimeSnapshot as t };
