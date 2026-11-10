import { C as retainPluginCache, p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { P as collectConfiguredModelRefs, j as hashRuntimeConfigValue } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { a as capturePluginLifecycleAuthority, d as getPluginRegistryGatewayOwner } from "./registry-lifecycle-CjTFYNkp.mjs";
import { D as getPreparedMessageToolCatalog, O as getPreparedMessageToolCatalogForRegistry } from "./runtime-DkPagH0y.mjs";
import { O as withAgentRosterFactsBatch } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as indexFirstByKey, t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { d as resolvePluginMetadataSnapshotAsync } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { o as getPreparedRuntimeAuthProfileStoreSnapshotCore } from "./runtime-snapshots-HRosak4u.mjs";
import { n as modelTransportRoutesMatch } from "./model-compat-catalog-VI3Psdyr.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-DAkjzBhe.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { d as parseConfiguredModelVisibilityEntries, r as buildConfiguredModelCatalog, x as overlayCatalogMetadata } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-BJEokkWC.mjs";
import { n as getPluginRegistryInspectionResources } from "./registry-inspection-resources-COvkPmap.mjs";
import { a as getReusablePluginRuntimeActivation, i as getPluginRuntimeLoadContext } from "./load-context-YqkPeFye.mjs";
import { i as listRuntimePluginIdsFromRegistry, t as createRuntimePluginManifestLookup } from "./active-runtime-registry-BrXk-dcA.mjs";
import { r as modelCatalogRowToEntry } from "./model-catalog-entry-BWd5zbsm.mjs";
import { a as loadManifestModelProviderConfigs, n as loadManifestModelCatalog } from "./model-catalog-vYmFg90_.mjs";
import { t as assignProviderModelOrder } from "./model-catalog-order-DpA_fmrU.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-C4C-simP.mjs";
import { s as nativePluginBindings } from "./loader-runtime-load-DzFljQbT.mjs";
import { t as loadPersistedPluginModelCatalogs } from "./plugin-model-catalog-execution-D64dZ7z1.mjs";
import { a as resolvePreparedProviderStaticConfigs } from "./provider-discovery-VU-K7aKK.mjs";
import { i as resolveRuntimeSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { c as PreparedModelRuntimeBuildResources, d as prepareAmbientAgentCredentialsForDiscovery, s as retainPreparedPluginRegistry, t as discardPreparedPluginGeneration } from "./prepared-model-runtime.plugin-lifetime-Ck5dh_-n.mjs";
import { a as completeConfiguredRuntimeModels, g as discoverAuthStorageFacts, n as createPreparedPluginGeneration, v as discoverModelsFromCapturedSources } from "./prepared-model-runtime.plugin-generation-DCZXy8Yr.mjs";
import "./auth-storage-DHC97REI.mjs";
import { t as buildInlineProviderModels } from "./model.inline-provider-DwjZUIZW.mjs";
import { u as resolvePluginModelCatalogOwnerPluginId } from "./plugin-model-catalog-BSKD3sUS.mjs";
import { c as createStaticModelIdMatcher, n as createBundledStaticCatalogModelResolver, r as loadBundledProviderStaticCatalogContextModels } from "./model.static-catalog-JSpbzt04.mjs";
import { a as prepareConfiguredRuntimeModels, n as collectPreparedModelRuntimeConfiguredRefs, o as prepareRuntimeCapabilityModels, r as collectPreparedModelRuntimeProviderIds, t as collectConfiguredProviderIdsNeedingStaticCatalog } from "./prepared-model-runtime.configured-B8Q2qHyF.mjs";
import { n as loadAgentRuntimePluginRegistryHandle } from "./runtime-plugins-ZiHXv-be.mjs";
import { a as scopeSyntheticAuthProviderRefs, o as fingerprintPreparedRuntimeFacts, r as prepareSyntheticAuth, t as listPreparedSyntheticAuthProviderRefs } from "./prepared-model-runtime.synthetic-auth-DP743ZrF.mjs";
import { t as prepareMediaCapabilityProviders } from "./capability-provider-runtime-CM-mwRei.mjs";
import { t as prepareImplicitProviderStaticCatalog } from "./models-config.providers.implicit-B8ZOw1Dx.mjs";
import { n as prepareOwnedPluginMetadataSnapshotParams, t as prepareOwnedPluginLoadContext } from "./prepared-model-runtime.plugin-context-B8bOw2w5.mjs";
import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { setImmediate } from "node:timers/promises";
//#region src/agents/prepared-model-runtime.configured-catalog.ts
function prepareConfiguredRuntimeFacts(params) {
	const templateModelRegistry = params.templateModelRegistry;
	const replace = params.agentFacts.input.config.models?.mode === "replace";
	const keyOf = createModelCatalogIdentityKeyResolver();
	const runtimeEntries = (replace ? [] : params.configuredRuntimeModels).map(({ model }) => modelCatalogRowToEntry(model));
	const runtimeByIdentity = /* @__PURE__ */ new Map();
	for (const entry of runtimeEntries) {
		const key = keyOf(entry);
		const donors = runtimeByIdentity.get(key) ?? [];
		donors.push(entry);
		runtimeByIdentity.set(key, donors);
	}
	const catalog = [...replace ? [] : params.templateModelRegistry.getAll().map(modelCatalogRowToEntry), ...runtimeEntries];
	const catalogByIdentity = indexFirstByKey(catalog, keyOf);
	const configuredEntries = dedupeByKey([
		...buildConfiguredModelCatalog({
			cfg: params.agentFacts.input.config,
			catalog,
			manifestPlugins: params.workspaceFacts.pluginMetadataSnapshot
		}).map((entry) => {
			const key = keyOf(entry);
			const accepted = catalogByIdentity.get(key);
			if (!accepted || !modelTransportRoutesMatch(accepted, entry)) return entry;
			const donor = accepted.contextWindows ? accepted : runtimeByIdentity.get(key)?.find((candidate) => modelTransportRoutesMatch(candidate, accepted));
			return donor?.contextWindows ? overlayCatalogMetadata(entry, {
				...entry,
				contextWindows: donor.contextWindows,
				contextWindowDefault: donor.contextWindowDefault
			}) : entry;
		}),
		...runtimeEntries,
		...replace ? [] : params.agentFacts.configuredModelRefs.flatMap(({ provider, modelId }) => {
			const model = params.templateModelRegistry.find(provider, modelId);
			return model ? [modelCatalogRowToEntry(model)] : [];
		})
	], keyOf);
	return {
		templateModelRegistry,
		modelCatalog: {
			entries: configuredEntries,
			routeVariants: configuredEntries,
			...runtimeEntries.length > 0 ? { staticEntries: runtimeEntries } : {}
		},
		configuredRuntimeModels: params.configuredRuntimeModels
	};
}
/** Startup can expose captured rows; full refresh overlays only configured membership. */
function prepareCapturedRuntimeFacts(params) {
	const facts = prepareConfiguredRuntimeFacts(params);
	if (params.agentFacts.input.config.models?.mode === "replace") return facts;
	const normalizeProvider = createPreparedModelCatalogProviderNormalizer(params.workspaceFacts.pluginMetadataSnapshot, params.agentFacts.input.config, params.agentFacts.input.env);
	const entries = dedupeByKey([...facts.modelCatalog.entries, ...params.templateModelRegistry.getAll().map((model) => {
		const entry = modelCatalogRowToEntry(model);
		entry.provider = normalizeProvider(entry.provider);
		return entry;
	})], createModelCatalogIdentityKeyResolver());
	const orderedEntries = assignProviderModelOrder(entries, loadManifestModelCatalog({
		config: params.agentFacts.input.config,
		metadataSnapshot: params.workspaceFacts.pluginMetadataSnapshot
	}), { appendUnknown: false });
	return {
		...facts,
		modelCatalog: {
			...facts.modelCatalog,
			entries: orderedEntries,
			routeVariants: orderedEntries
		}
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.agent-facts.ts
async function prepareAgentFacts(input, catalogMode, ambientCredentials, assertCurrent, additionalProviderIds = [], includeCredentialProviders = catalogMode === "live") {
	const env = input.env ?? process.env;
	const preparedStore = await nativePluginBindings.authStore.prepareAuthProfileStoreForModelRuntime(input.agentDir, {
		config: input.config,
		inheritedAuthDir: input.inheritedAuthDir,
		skipCredentials: input.skipCredentials
	}, assertCurrent, env);
	assertCurrent();
	const authFacts = await discoverAuthStorageFacts(input.agentDir, {
		config: input.config,
		readOnly: true,
		ambientCredentials,
		...preparedStore ? { preparedStore } : {},
		...input.skipCredentials ? { skipCredentials: true } : {},
		...input.inheritedAuthDir ? { inheritedAuthDir: input.inheritedAuthDir } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.env ? { env } : {}
	});
	return withAgentRosterFactsBatch(input.config, () => {
		const credentials = authFacts.credentials;
		const templateAuthStorage = authFacts.authStorage;
		const rawConfiguredModelRefs = collectPreparedModelRuntimeConfiguredRefs(input.config, input.agentId, input.readOnly ? input.runtimePluginSelections : void 0);
		return {
			input,
			env,
			authStore: authFacts.store,
			templateAuthStorage,
			credentials,
			configuredModelRefs: rawConfiguredModelRefs.flatMap(({ value }) => {
				const ref = parseModelCatalogRef(value);
				return ref ? [ref] : [];
			}),
			providerIds: [.../* @__PURE__ */ new Set([
				...collectPreparedModelRuntimeProviderIds(input.config, credentials, includeCredentialProviders, rawConfiguredModelRefs, input.agentId),
				...parseConfiguredModelVisibilityEntries({
					cfg: input.config,
					agentId: input.agentId
				}).providerWildcards,
				...additionalProviderIds.map(normalizeProviderId).filter(Boolean)
			])].toSorted((left, right) => left.localeCompare(right))
		};
	});
}
//#endregion
//#region src/agents/prepared-model-runtime.configured-facts.ts
function prepareConfiguredModelFacts(config, pluginMetadataSnapshot) {
	return {
		inlineProviderModels: buildInlineProviderModels(config.models?.providers ?? {}, { providerMetadataOwners: pluginMetadataSnapshot.owners }),
		configuredCatalogEntries: buildConfiguredModelCatalog({
			cfg: config,
			manifestPlugins: pluginMetadataSnapshot
		})
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.inbound-registry.ts
function inboundRegistryIdentity(input) {
	return JSON.stringify({
		config: hashRuntimeConfigValue(input.config),
		env: hashRuntimeConfigValue(input.env ?? process.env),
		workspaceDir: input.workspaceDir,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true
	});
}
/** Groups model-selected workspace facts while keeping generic inbound identity narrower. */
function preparedModelRuntimeWorkspaceFactsKey(input) {
	return JSON.stringify({
		config: hashRuntimeConfigValue(input.config),
		env: hashRuntimeConfigValue(input.env ?? process.env),
		readOnly: input.readOnly === true,
		loadRuntimePlugins: input.loadRuntimePlugins === true,
		runtimePluginPurpose: input.runtimePluginPurpose,
		workspaceDir: input.workspaceDir,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true,
		runtimePluginSelections: input.runtimePluginSelections?.map(({ provider, runtime }) => ({
			provider,
			runtime
		}))
	});
}
/** Gateway-hosted prepared loads borrow unchanged instances from the live Gateway registry. */
function resolveLendingGatewayRegistry(input, metadataSnapshot) {
	if (input.allowGatewaySubagentBinding !== true || input.env !== void 0) return;
	const requestRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const registry = requestRegistry && getPluginRegistryGatewayOwner(requestRegistry)?.current();
	return registry && getPluginRuntimeLoadContext(registry)?.workspaceDir === metadataSnapshot.workspaceDir ? registry : void 0;
}
/** Loads generic plugin facts without acquiring model, catalog, or credential state. */
function loadPreparedInboundPluginRegistry(input, metadataSnapshot = prepareOwnedPluginLoadContext(input, input.env ?? process.env, void 0), configuredHarnessRuntimes, onPrimaryRegistry) {
	const gatewayRegistry = resolveLendingGatewayRegistry(input, metadataSnapshot);
	const reusableGatewayRegistry = gatewayRegistry && getReusablePluginRuntimeActivation(gatewayRegistry, {
		config: input.config,
		env: process.env,
		workspaceDir: metadataSnapshot.workspaceDir,
		metadataSnapshot
	}) && listRuntimePluginIdsFromRegistry(gatewayRegistry).every(createRuntimePluginManifestLookup(gatewayRegistry, metadataSnapshot.manifestRegistry.plugins)) ? gatewayRegistry : void 0;
	const registry = reusableGatewayRegistry ?? loadAgentRuntimePluginRegistryHandle({
		config: input.config,
		env: input.env ?? process.env,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		metadataSnapshot,
		preferBuiltPluginArtifacts: true,
		configuredHarnessRuntimes,
		borrowRegistry: gatewayRegistry
	}, onPrimaryRegistry);
	if (reusableGatewayRegistry) onPrimaryRegistry?.(reusableGatewayRegistry);
	prepareOwnedPluginLoadContext(input, input.env ?? process.env, registry, metadataSnapshot, true);
	return registry;
}
/** Creates one lifecycle-batch loader that shares exact generic registry identities. */
function createPreparedInboundRegistryLoader() {
	const registries = /* @__PURE__ */ new Map();
	return (input, metadataSnapshot, configuredHarnessRuntimes, onPrimaryRegistry) => {
		const key = inboundRegistryIdentity(input);
		const existing = registries.get(key);
		if (existing?.metadataSnapshot === metadataSnapshot) {
			onPrimaryRegistry?.(existing.primaryRegistry);
			return existing.registry;
		}
		let primaryRegistry;
		const registry = loadPreparedInboundPluginRegistry(input, metadataSnapshot, configuredHarnessRuntimes, (source) => {
			primaryRegistry = source;
		});
		primaryRegistry ??= registry;
		registries.set(key, {
			metadataSnapshot,
			registry,
			primaryRegistry
		});
		onPrimaryRegistry?.(primaryRegistry);
		return registry;
	};
}
/** Prepares distinct generic-inbound and model-selected registries for one workspace generation. */
function prepareWorkspacePluginRegistries(input, metadataSnapshot, retainRegistry, loadInboundRegistry, preferBuiltPluginArtifacts = false, reusableGeneration, getConfiguredHarnessRuntimes, basePluginIds, loadRuntimeRegistry = loadAgentRuntimePluginRegistryHandle) {
	if (input.readOnly && !input.loadRuntimePlugins && !input.runtimePluginSelections) return {};
	let primaryRegistry;
	const inboundPluginRegistry = input.readOnly || input.runtimePluginPurpose === "isolated-completion" ? void 0 : reusableGeneration?.inboundPluginRegistry ?? loadInboundRegistry?.(input, metadataSnapshot, getConfiguredHarnessRuntimes?.(), (source) => {
		primaryRegistry = source;
	});
	const baseRegistry = reusableGeneration?.pluginRegistry ?? inboundPluginRegistry;
	for (const registry of /* @__PURE__ */ new Set([inboundPluginRegistry, baseRegistry])) if (registry) retainRegistry(registry);
	primaryRegistry ??= reusableGeneration?.mediaCapabilityProviderSource?.registry ?? baseRegistry;
	let loadedPrimaryRegistry;
	const runtimePluginRegistry = input.runtimePluginSelections || !baseRegistry ? loadRuntimeRegistry({
		...input.loadRuntimePlugins ? { basePluginIds: [] } : baseRegistry ? { basePluginIds: listRuntimePluginIdsFromRegistry(baseRegistry) } : basePluginIds !== void 0 ? { basePluginIds } : {},
		...baseRegistry ? { reusableRegistry: baseRegistry } : {},
		purpose: input.runtimePluginPurpose,
		config: input.config,
		env: input.env ?? process.env,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		metadataSnapshot,
		...preferBuiltPluginArtifacts ? { preferBuiltPluginArtifacts: true } : {},
		selections: input.runtimePluginSelections,
		configuredHarnessRuntimes: getConfiguredHarnessRuntimes?.(),
		borrowRegistry: resolveLendingGatewayRegistry(input, metadataSnapshot)
	}, (source) => {
		loadedPrimaryRegistry = reusableGeneration && source === reusableGeneration.pluginRegistry ? reusableGeneration.mediaCapabilityProviderSource?.registry ?? source : source;
	}) : baseRegistry;
	const prepared = (registry) => {
		retainRegistry(registry);
		return {
			runtimePluginRegistry: registry,
			primaryRegistry: registry === baseRegistry ? primaryRegistry ?? registry : loadedPrimaryRegistry ?? registry,
			...inboundPluginRegistry ? { inboundPluginRegistry } : {}
		};
	};
	return runtimePluginRegistry instanceof Promise ? runtimePluginRegistry.then(prepared) : prepared(runtimePluginRegistry);
}
//#endregion
//#region src/agents/prepared-model-runtime.oauth-providers.ts
function hasSameOAuthProviderGeneration(left, right) {
	return left.length === right.length && left.every((provider, index) => {
		const candidate = right[index];
		return candidate !== void 0 && provider.id === candidate.id && provider.name === candidate.name && provider.usesCallbackServer === candidate.usesCallbackServer && provider.login === candidate.login && provider.refreshToken === candidate.refreshToken && provider.getApiKey === candidate.getApiKey && provider.modifyModels === candidate.modifyModels;
	});
}
//#endregion
//#region src/agents/prepared-model-runtime.facts.ts
async function prepareWorkspaceBuildGroup(inputs, catalogMode, options = {}, loadInboundPluginRegistry, reusablePluginGeneration, preparedPluginMetadataSnapshot) {
	try {
		var _usingCtx$1 = _usingCtx();
		const input = inputs[0];
		if (!input) throw new Error("prepared model runtime workspace group is empty");
		const env = input.env ?? process.env;
		let workspacePluginIds = [];
		const reportStage = (stage) => options.onStage?.(`${stage}; agent ${input.agentId ?? "standalone"}` + (workspacePluginIds.length ? `; workspace plugins ${workspacePluginIds.join(", ")}` : ""));
		reportStage("workspace plugins");
		const pluginMetadataStartedAt = performance.now();
		let selectedMetadataSnapshot = preparedPluginMetadataSnapshot ?? reusablePluginGeneration?.pluginMetadataSnapshot;
		if (!selectedMetadataSnapshot) {
			for (const candidate of inputs) options.assertCurrent?.(candidate);
			selectedMetadataSnapshot = await resolvePluginMetadataSnapshotAsync(prepareOwnedPluginMetadataSnapshotParams(input, env));
			for (const candidate of inputs) options.assertCurrent?.(candidate);
		}
		const pluginMetadataSnapshot = selectedMetadataSnapshot;
		_usingCtx$1.u({ [Symbol.dispose]: retainPluginCache(getPluginMetadataSnapshotCache(pluginMetadataSnapshot)) });
		const pluginMetadataMs = reusablePluginGeneration ? 0 : performance.now() - pluginMetadataStartedAt;
		const runtimePluginStartedAt = performance.now();
		workspacePluginIds = pluginMetadataSnapshot.index.plugins.filter((plugin) => plugin.enabled && plugin.origin === "workspace").map((plugin) => plugin.pluginId);
		if (workspacePluginIds.length) reportStage("workspace plugins");
		const preferBuiltPluginArtifacts = reusablePluginGeneration?.preferBuiltPluginArtifacts ?? options.preferBuiltPluginArtifacts === true;
		const localResources = _usingCtx$1.a(new AsyncDisposableStack());
		const registryResources = options.registryResources ?? localResources.use(new PreparedModelRuntimeBuildResources(retainPreparedPluginRegistry));
		registryResources.retainGeneration(reusablePluginGeneration);
		const preparingRegistries = prepareWorkspacePluginRegistries(input, pluginMetadataSnapshot, (registry) => registryResources.retainRegistry(registry), loadInboundPluginRegistry, preferBuiltPluginArtifacts, reusablePluginGeneration, options.getConfiguredHarnessRuntimes, void 0, options.loadRuntimeRegistry);
		const { inboundPluginRegistry, runtimePluginRegistry, primaryRegistry } = preparingRegistries instanceof Promise ? await preparingRegistries : preparingRegistries;
		const reuseRuntimeFacts = reusablePluginGeneration && runtimePluginRegistry === reusablePluginGeneration.pluginRegistry;
		const resources = primaryRegistry && getPluginRegistryInspectionResources(primaryRegistry);
		const mediaCapabilityProviderSource = primaryRegistry && resources ? Object.freeze({
			registry: primaryRegistry,
			resources
		}) : void 0;
		const runtimePluginMs = performance.now() - runtimePluginStartedAt;
		prepareOwnedPluginLoadContext(input, env, runtimePluginRegistry, pluginMetadataSnapshot, preferBuiltPluginArtifacts, inboundPluginRegistry);
		let preparedGeneration;
		const prepare = async () => {
			options.assertCurrent?.(input);
			const matchesStaticModelId = createStaticModelIdMatcher({ manifestPlugins: pluginMetadataSnapshot });
			const mediaCapabilityProviders = reuseRuntimeFacts ? reusablePluginGeneration.mediaCapabilityProviders : input.readOnly || !runtimePluginRegistry ? void 0 : prepareMediaCapabilityProviders({
				cfg: input.config,
				pluginMetadataSnapshot,
				registry: runtimePluginRegistry
			});
			const messageToolCatalog = reuseRuntimeFacts ? reusablePluginGeneration.messageToolCatalog : runtimePluginRegistry ? getPreparedMessageToolCatalogForRegistry(runtimePluginRegistry) : catalogMode === "live" ? getPreparedMessageToolCatalog() : void 0;
			const resolveManifestStaticCatalogModel = createBundledStaticCatalogModelResolver({
				cfg: input.config,
				env,
				includeRuntimeDiscovery: true,
				metadataSnapshot: pluginMetadataSnapshot,
				...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
			});
			const configuredManifestModels = /* @__PURE__ */ new Map();
			const resolveConfiguredManifestModel = (lookup) => {
				const key = `${normalizeProviderId(lookup.provider)}\0${lookup.modelId.trim().toLowerCase()}`;
				if (configuredManifestModels.has(key)) return configuredManifestModels.get(key);
				const model = resolveManifestStaticCatalogModel(lookup);
				configuredManifestModels.set(key, model);
				return model;
			};
			const configuredProviders = new Set((options.providerDiscoveryProviderIds ?? []).map(normalizeProviderId).filter(Boolean));
			const configuredModelRefs = [];
			for (const candidate of inputs) {
				await setImmediate();
				options.assertCurrent?.(candidate);
				const { config, agentId } = candidate;
				for (const provider of withAgentRosterFactsBatch(config, () => {
					const refs = collectPreparedModelRuntimeConfiguredRefs(config, agentId, candidate.readOnly ? candidate.runtimePluginSelections : void 0);
					configuredModelRefs.push(...refs);
					return [...collectPreparedModelRuntimeProviderIds(config, {}, false, refs, agentId), ...parseConfiguredModelVisibilityEntries({
						cfg: config,
						agentId
					}).providerWildcards];
				})) configuredProviders.add(provider);
			}
			const configuredProviderIds = [...configuredProviders].toSorted((left, right) => left.localeCompare(right));
			const staticCatalogProviderIds = [.../* @__PURE__ */ new Set([...collectConfiguredProviderIdsNeedingStaticCatalog({
				config: input.config,
				configuredModelRefs,
				matchesStaticModelId,
				resolveStaticCatalogModel: resolveConfiguredManifestModel
			}), ...(options.providerDiscoveryProviderIds ?? []).map(normalizeProviderId).filter(Boolean)])].toSorted((left, right) => left.localeCompare(right));
			const staticProviderCatalogStartedAt = performance.now();
			reportStage("static provider catalog");
			let preparedStaticProviderCatalog = reuseRuntimeFacts ? reusablePluginGeneration.preparedStaticProviderCatalog : catalogMode === "static" ? await prepareImplicitProviderStaticCatalog({
				signal: options.signal,
				config: input.config,
				env,
				pluginMetadataSnapshot,
				providerDiscoveryProviderIds: configuredProviderIds,
				staticCatalogProviderIds,
				...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
			}) : void 0;
			if (catalogMode === "static" && reusablePluginGeneration && !reuseRuntimeFacts && runtimePluginRegistry?.providers.length) preparedStaticProviderCatalog = Object.freeze({
				entries: preparedStaticProviderCatalog?.entries ?? [],
				providers: Object.freeze([...new Map([...(preparedStaticProviderCatalog?.providers ?? []).map((provider) => [provider.id, provider]), ...runtimePluginRegistry.providers.map(({ provider }) => [provider.id, provider])]).values()])
			});
			const staticProviderCatalogMs = reuseRuntimeFacts ? 0 : performance.now() - staticProviderCatalogStartedAt;
			const preparedSyntheticAuthProviders = preparedStaticProviderCatalog?.providers ?? [];
			const ambientCredentialsStartedAt = performance.now();
			reportStage("ambient credentials");
			const ambientCredentials = await prepareAmbientAgentCredentialsForDiscovery({
				signal: options.signal,
				config: input.config,
				env,
				authoritativeSyntheticAuthProviderRefs: pluginMetadataSnapshot.owners.cliBackends.keys(),
				syntheticAuthProviderRefs: scopeSyntheticAuthProviderRefs(catalogMode === "static" ? listPreparedSyntheticAuthProviderRefs(preparedSyntheticAuthProviders) : resolveRuntimeSyntheticAuthProviderRefs({
					config: input.config,
					env,
					index: pluginMetadataSnapshot.index,
					registryDiagnostics: pluginMetadataSnapshot.registryDiagnostics,
					...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
				}), catalogMode === "static" ? options.providerDiscoveryProviderIds : configuredProviderIds),
				...catalogMode === "static" ? { resolveSyntheticAuth: (provider) => prepareSyntheticAuth({
					signal: options.signal,
					config: input.config,
					env,
					workspaceDir: input.workspaceDir,
					provider,
					providers: preparedSyntheticAuthProviders
				}) } : {},
				...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
			});
			const ambientCredentialsMs = performance.now() - ambientCredentialsStartedAt;
			const agentFactsStartedAt = performance.now();
			reportStage("agent facts");
			const agentBaseFacts = [];
			for (const candidate of inputs) {
				await setImmediate();
				options.assertCurrent?.(candidate);
				options.onBeforeAuthCapture?.(candidate);
				agentBaseFacts.push(await prepareAgentFacts(candidate, catalogMode, ambientCredentials, () => options.assertCurrent?.(candidate), options.providerDiscoveryProviderIds, options.includeCredentialProviders));
			}
			const agentFactsMs = performance.now() - agentFactsStartedAt;
			const configuredProjectionStartedAt = performance.now();
			reportStage("configured model projection");
			const providerStaticModels = reusablePluginGeneration?.providerStaticModels ?? (catalogMode === "static" ? [] : await loadBundledProviderStaticCatalogContextModels({
				cfg: input.config,
				env,
				metadataSnapshot: pluginMetadataSnapshot,
				registeredProviders: runtimePluginRegistry?.providers,
				...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
			}));
			const { inlineProviderModels, configuredCatalogEntries } = reusablePluginGeneration ?? (options.getConfiguredModelFacts ?? prepareConfiguredModelFacts)(input.config, pluginMetadataSnapshot);
			const agentFacts = [];
			for (const facts of agentBaseFacts) {
				await setImmediate();
				options.assertCurrent?.(facts.input);
				const configuredRuntimeModels = prepareConfiguredRuntimeModels({
					config: facts.input.config,
					inlineProviderModels,
					configuredModelRefs: facts.configuredModelRefs,
					metadataSnapshot: pluginMetadataSnapshot,
					...preparedStaticProviderCatalog ? { preparedStaticProviderCatalog } : {},
					providerStaticModels,
					matchesStaticModelId,
					resolveStaticCatalogModel: resolveConfiguredManifestModel
				});
				const runtimeCapabilityModels = prepareRuntimeCapabilityModels({
					config: facts.input.config,
					agentId: facts.input.agentId,
					candidates: [...configuredCatalogEntries, ...configuredRuntimeModels.map(({ model, modelId, provider }) => ({
						...modelCatalogRowToEntry(model),
						id: modelId,
						provider
					}))],
					resolveRuntimeModel: resolveConfiguredManifestModel
				});
				const configuredGeneratedCatalogPluginIds = [...new Set((facts.input.config.models?.mode === "replace" ? [] : [...facts.providerIds, ...Object.keys(facts.credentials).map(normalizeProviderId)]).flatMap((provider) => {
					const pluginId = resolvePluginModelCatalogOwnerPluginId({
						providerId: provider,
						pluginMetadataSnapshot
					});
					return pluginId ? [pluginId] : [];
				}))].toSorted((left, right) => left.localeCompare(right));
				agentFacts.push({
					...facts,
					configuredRuntimeModels,
					runtimeCapabilityModels,
					configuredGeneratedCatalogPluginIds
				});
			}
			const configuredProjectionMs = performance.now() - configuredProjectionStartedAt;
			const pluginGeneration = createPreparedPluginGeneration({
				catalogMode,
				configuredCatalogEntries,
				inboundPluginRegistry,
				inlineProviderModels,
				mediaCapabilityProviders,
				mediaCapabilityProviderSource,
				messageToolCatalog,
				pluginMetadataSnapshot,
				preparedStaticProviderCatalog,
				providerStaticModels,
				preferBuiltPluginArtifacts,
				reusablePluginGeneration,
				runtimePluginRegistry
			});
			preparedGeneration = pluginGeneration;
			return {
				agentFacts,
				buildStats: {
					runtimePluginMs,
					pluginMetadataMs,
					staticProviderCatalogMs,
					ambientCredentialsMs,
					agentFactsMs,
					configuredProjectionMs
				},
				pluginGeneration
			};
		};
		try {
			const run = () => withPluginRuntimeGenerationScope({
				metadataSnapshot: pluginMetadataSnapshot,
				pluginRegistry: runtimePluginRegistry
			}, prepare);
			if (!mediaCapabilityProviderSource) return await run();
			const isSourceCurrent = capturePluginLifecycleAuthority(mediaCapabilityProviderSource.registry, void 0, { scopedRuntime: true });
			if (!isSourceCurrent?.()) throw new Error("Prepared media capability provider source is retired");
			const claim = mediaCapabilityProviderSource.resources.retain();
			let prepared;
			try {
				prepared = await run();
			} catch (error) {
				let failure = error;
				try {
					await claim.release();
				} catch (cleanupError) {
					failure = new AggregateError([error, cleanupError], "Prepared construction and registration cleanup failed", { cause: error });
				}
				throw failure;
			}
			await claim.release();
			if (!isSourceCurrent()) throw new Error("Prepared media capability provider source is retired");
			return prepared;
		} catch (error) {
			const cleanup = preparedGeneration ? [discardPreparedPluginGeneration(preparedGeneration)] : [];
			const failures = (await Promise.allSettled(cleanup)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length) throw new AggregateError([error, ...failures], "Prepared plugin facts and cleanup failed", { cause: error });
			throw error;
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
function captureModelsJsonContents(agentDir) {
	try {
		return fs.readFileSync(path.join(agentDir, "models.json"), "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
/** Record discovery scope before config projection or auth-owner publication can replace it. */
function preparedModelInventoryKey(input) {
	const { models, auth, env } = input.config;
	const plugins = normalizePluginsConfig(input.config.plugins);
	for (const entry of Object.values(plugins.entries)) entry.config ??= {};
	return fingerprintPreparedRuntimeFacts({
		...input,
		config: {
			models,
			auth,
			env,
			plugins
		},
		configuredModelRefs: collectConfiguredModelRefs(input.config),
		env: input.env ?? process.env,
		runtimePluginSelections: void 0,
		order: getPreparedRuntimeAuthProfileStoreSnapshotCore(input.agentDir, input.inheritedAuthDir)?.order ?? {}
	});
}
async function prepareConfiguredRuntimeFactsBatch(params) {
	const catalogs = /* @__PURE__ */ new Map();
	let registryCount = 0;
	const preparedStaticProviderConfigs = resolvePreparedProviderStaticConfigs(params.pluginGeneration.preparedStaticProviderCatalog);
	const { pluginMetadataSnapshot } = params.pluginGeneration;
	const registries = params.registries ?? /* @__PURE__ */ new Map();
	let registriesBySource = registries.get(pluginMetadataSnapshot);
	if (!registriesBySource) {
		registriesBySource = /* @__PURE__ */ new Map();
		registries.set(pluginMetadataSnapshot, registriesBySource);
	}
	for (const facts of params.agentFacts) {
		await setImmediate();
		params.assertCurrent?.(facts.input);
		const modelsJsonContents = captureModelsJsonContents(facts.input.agentDir);
		const staticProviderConfigs = {
			...loadManifestModelProviderConfigs({
				config: facts.input.config,
				metadataSnapshot: pluginMetadataSnapshot,
				providerIds: Object.keys(facts.credentials).map(normalizeProviderId)
			}),
			...preparedStaticProviderConfigs
		};
		const oauthProviders = facts.templateAuthStorage.getOAuthProviders();
		const pluginCatalogs = await loadPersistedPluginModelCatalogs(facts.input.agentDir, facts.configuredGeneratedCatalogPluginIds, facts.env);
		params.assertCurrent?.(facts.input);
		const key = fingerprintPreparedRuntimeFacts({
			config: hashRuntimeConfigValue(facts.input.config),
			sourceModels: projectConfigOntoRuntimeSourceSnapshot(facts.input.config).models,
			credentials: facts.credentials,
			modelsJsonContents,
			pluginCatalogs,
			staticProviderConfigs
		});
		const candidates = registriesBySource.get(key) ?? [];
		let prepared = candidates.find((candidate) => hasSameOAuthProviderGeneration(candidate.oauthProviders, oauthProviders));
		if (!prepared) {
			prepared = {
				oauthProviders,
				modelRegistry: discoverModelsFromCapturedSources(facts.templateAuthStorage, {
					config: facts.input.config,
					includePluginCatalogs: true,
					modelsJsonContents,
					pluginCatalogs,
					staticProviderConfigs,
					pluginMetadataSnapshot,
					...facts.input.workspaceDir ? { workspaceDir: facts.input.workspaceDir } : {}
				})
			};
			candidates.push(prepared);
			registriesBySource.set(key, candidates);
			registryCount += 1;
		}
		const templateModelRegistry = prepared.modelRegistry;
		const configuredRuntimeModels = completeConfiguredRuntimeModels(facts, params.pluginGeneration, templateModelRegistry);
		catalogs.set(facts.input, prepareCapturedRuntimeFacts({
			agentFacts: facts,
			workspaceFacts: params.pluginGeneration,
			templateModelRegistry,
			configuredRuntimeModels
		}));
	}
	return {
		catalogs,
		registryCount
	};
}
//#endregion
export { createPreparedInboundRegistryLoader as a, prepareConfiguredModelFacts as c, preparedModelInventoryKey as i, prepareConfiguredRuntimeFacts as l, prepareConfiguredRuntimeFactsBatch as n, loadPreparedInboundPluginRegistry as o, prepareWorkspaceBuildGroup as r, preparedModelRuntimeWorkspaceFactsKey as s, captureModelsJsonContents as t };
