import { d as getPluginMetadataSnapshotCache, x as retainPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { w as withAgentRosterFactsBatch } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as sha256Base64Url } from "./crypto-digest-D9Nqq3c7.mjs";
import { d as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { t as modelTransportRoutesMatch } from "./model-compat-catalog-DU9GPmr_.mjs";
import { f as hashRuntimeConfigValue } from "./runtime-snapshot-DbgWcCyV.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-D2uZ1zpS.mjs";
import { n as dedupeByKey, r as indexFirstByKey } from "./provider-thinking-catalog-B0d_iUnw.mjs";
import { d as parseConfiguredModelVisibilityEntries, r as buildConfiguredModelCatalog, x as overlayCatalogMetadata } from "./model-selection-shared-0uvJbX1M.mjs";
import { s as createModelCatalogIdentityKeyResolver } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { i as capturePluginLifecycleAuthority } from "./registry-lifecycle-BhTDZAHB.mjs";
import { O as getPreparedMessageToolCatalog, f as getActivePluginRegistryWorkspaceDir, k as getPreparedMessageToolCatalogForRegistry, l as getActivePluginRegistry, p as getActivePluginRuntimeSubagentMode } from "./runtime-BvdPUus5.mjs";
import { c as mergeAuthProfileStores } from "./persisted-B486xwB_.mjs";
import { o as getPreparedRuntimeAuthProfileStoreSnapshot } from "./store-CTvq6MSF.mjs";
import { s as getPreparedRuntimeAuthProfileStoreSnapshotCore } from "./runtime-snapshots-CBozwlR0.mjs";
import { a as listRuntimePluginIdsFromRegistry, t as createRuntimePluginManifestLookup } from "./active-runtime-registry-BttqxLSq.mjs";
import { f as getPluginRegistryInspectionResources } from "./registry-Bqh30cGD.mjs";
import { a as setPluginRuntimeLoadContext, i as getReusablePluginRuntimeActivation, n as createPluginRuntimeLoaderLogger, r as getPluginRuntimeLoadContext } from "./load-context-D-CZ4KSw.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-BcoYkagW.mjs";
import { t as modelCatalogRowToEntry } from "./model-catalog-entry-CgZk9Ht4.mjs";
import { a as resolvePreparedProviderStaticConfigs } from "./provider-discovery-gl0uPs1A.mjs";
import { N as discoverModelsFromCapturedSources, P as prepareAmbientAgentCredentialsForDiscovery, f as retainPreparedPluginRegistry, g as completeConfiguredRuntimeModels, j as discoverAuthStorageFacts, o as discardPreparedPluginGeneration, p as PreparedModelRuntimeBuildResources, r as createPreparedPluginGeneration } from "./prepared-model-runtime.plugin-generation-CUjNdQbs.mjs";
import { H as prepareSyntheticAuthWithProvider } from "./provider-runtime-BofzCM_V.mjs";
import { i as resolveRuntimeSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import "./model-registry-DrVlc5_5.mjs";
import { t as buildInlineProviderModels } from "./model.inline-provider-BrhnLKm5.mjs";
import { a as loadPersistedPluginModelCatalogsReadOnly, l as resolvePluginModelCatalogOwnerPluginId } from "./plugin-model-catalog-DoLlP-mj.mjs";
import { c as createStaticModelIdMatcher, n as createBundledStaticCatalogModelResolver, r as loadBundledProviderStaticCatalogContextModels } from "./model.static-catalog-BlMsrqKa.mjs";
import { a as prepareConfiguredRuntimeModels, n as collectPreparedModelRuntimeConfiguredRefs, o as prepareRuntimeCapabilityModels, r as collectPreparedModelRuntimeProviderIds, t as collectConfiguredProviderIdsNeedingStaticCatalog } from "./prepared-model-runtime.configured-BMNUMuvG.mjs";
import { t as createAgentRuntimeMetadataPluginIdScope } from "./runtime-plugin-load-plan-DrtegO6g.mjs";
import { n as loadAgentRuntimePluginRegistryHandle } from "./runtime-plugins-C7qW3xTp.mjs";
import { t as prepareMediaCapabilityProviders } from "./capability-provider-runtime-CBbnZpy2.mjs";
import { t as prepareImplicitProviderStaticCatalog } from "./models-config.providers.implicit-73Aeo3j3.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-DBcPAExA.mjs";
import fs from "node:fs";
import path from "node:path";
import { setImmediate } from "node:timers/promises";
import { performance } from "node:perf_hooks";
//#region src/agents/prepared-model-runtime.auth-store.ts
const defaultDeps = {
	loadDurable: (input) => ensureAuthProfileStoreWithoutExternalProfiles(input.agentDir, {
		allowKeychainPrompt: false,
		...input.inheritedAuthDir ? { inheritedAuthDir: input.inheritedAuthDir } : {},
		readOnly: true
	}),
	loadPublished: (input) => getPreparedRuntimeAuthProfileStoreSnapshot(input.agentDir, input.inheritedAuthDir)
};
/** Merges runtime-only external auth over durable profiles for one replacement generation. */
function loadPreparedModelRuntimeAuthStore(input, deps = defaultDeps) {
	const published = deps.loadPublished(input);
	if (!published || published.runtimeExternalProfileIds === void 0 && published.runtimeExternalProfileIdsAuthoritative !== true) return;
	return mergeAuthProfileStores(deps.loadDurable(input), published);
}
//#endregion
//#region src/agents/prepared-model-runtime.agent-facts.ts
function prepareAgentFacts(input, catalogMode, ambientCredentials, additionalProviderIds = [], includeCredentialProviders = catalogMode === "live") {
	const env = input.env ?? process.env;
	const preparedStore = loadPreparedModelRuntimeAuthStore(input);
	const authFacts = discoverAuthStorageFacts(input.agentDir, {
		config: input.config,
		readOnly: true,
		ambientCredentials,
		...preparedStore ? { preparedStore } : {},
		...input.skipCredentials ? { skipCredentials: true } : {},
		...input.inheritedAuthDir ? { inheritedAuthDir: input.inheritedAuthDir } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.env ? { env } : {}
	});
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
}
//#endregion
//#region src/agents/prepared-model-runtime.configured-catalog.ts
function createConfiguredModelCatalogSnapshot(params) {
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
		entries: configuredEntries,
		routeVariants: configuredEntries,
		...runtimeEntries.length > 0 ? { staticEntries: runtimeEntries } : {}
	};
}
function prepareConfiguredRuntimeFacts(params) {
	return {
		templateModelRegistry: params.templateModelRegistry,
		modelCatalog: createConfiguredModelCatalogSnapshot(params),
		configuredRuntimeModels: params.configuredRuntimeModels,
		inlineProviderModels: params.workspaceFacts.inlineProviderModels
	};
}
/** Startup can expose captured rows; full refresh overlays only configured membership. */
function prepareCapturedRuntimeFacts(params) {
	const facts = prepareConfiguredRuntimeFacts(params);
	if (params.agentFacts.input.config.models?.mode === "replace") return facts;
	const entries = dedupeByKey([...facts.modelCatalog.entries, ...params.templateModelRegistry.getAll().map(modelCatalogRowToEntry)], createModelCatalogIdentityKeyResolver());
	return {
		...facts,
		modelCatalog: {
			...facts.modelCatalog,
			entries,
			routeVariants: entries
		}
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.plugin-context.ts
const emptyPluginDiscovery = {
	candidates: [],
	diagnostics: []
};
/** Resolves and attaches the plugin facts owned by one prepared workspace generation. */
function prepareOwnedPluginLoadContext(input, env, registry, preparedMetadataSnapshot, preferBuiltPluginArtifacts = false, preparedRegistry) {
	const metadataSnapshot = preparedMetadataSnapshot ?? resolvePluginMetadataSnapshot({
		config: input.config,
		env,
		...input.workspaceDir ? {
			workspaceDir: input.workspaceDir,
			allowWorkspaceScopedCurrent: true
		} : {},
		...input.loadRuntimePlugins && input.runtimePluginSelections && input.workspaceDir ? { pluginIdScope: createAgentRuntimeMetadataPluginIdScope({
			config: input.config,
			workspaceDir: input.workspaceDir,
			selections: input.runtimePluginSelections
		}) } : {}
	});
	if (!registry) return metadataSnapshot;
	const { config } = input;
	const workspaceDir = metadataSnapshot.workspaceDir ?? input.workspaceDir;
	const preparedActivation = getReusablePluginRuntimeActivation(preparedRegistry ?? registry, {
		config,
		env,
		workspaceDir,
		metadataSnapshot
	});
	if (preparedActivation) {
		const targetContext = getPluginRuntimeLoadContext(registry);
		setPluginRuntimeLoadContext(registry, {
			...preparedActivation,
			rawConfig: config,
			env,
			workspaceDir,
			metadataSnapshot,
			manifestRegistry: metadataSnapshot.manifestRegistry,
			installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index),
			logger: targetContext?.logger ?? createPluginRuntimeLoaderLogger(),
			expectedSourceDigests: targetContext?.expectedSourceDigests,
			preferBuiltPluginArtifacts
		});
		return metadataSnapshot;
	}
	const discoverySnapshot = metadataSnapshot.discovery ? metadataSnapshot : {
		...metadataSnapshot,
		discovery: emptyPluginDiscovery
	};
	const context = {
		...resolvePluginRuntimeLoadContext({
			config,
			env,
			workspaceDir,
			metadataSnapshot: discoverySnapshot,
			manifestRegistry: metadataSnapshot.manifestRegistry,
			preferBuiltPluginArtifacts
		}),
		metadataSnapshot
	};
	setPluginRuntimeLoadContext(registry, context);
	return metadataSnapshot;
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
		workspaceDir: input.workspaceDir,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true,
		runtimePluginSelections: input.runtimePluginSelections?.map(({ provider, runtime }) => ({
			provider,
			runtime
		}))
	});
}
/** Loads generic plugin facts without acquiring model, catalog, or credential state. */
function loadPreparedInboundPluginRegistry(input, metadataSnapshot = prepareOwnedPluginLoadContext(input, input.env ?? process.env, void 0), configuredHarnessRuntimes, onPrimaryRegistry) {
	const activeRegistry = getActivePluginRegistry();
	const reusableGatewayRegistry = input.allowGatewaySubagentBinding === true && input.env === void 0 && getActivePluginRuntimeSubagentMode() === "gateway-bindable" && activeRegistry && getActivePluginRegistryWorkspaceDir() === metadataSnapshot.workspaceDir && getReusablePluginRuntimeActivation(activeRegistry, {
		config: input.config,
		env: process.env,
		workspaceDir: metadataSnapshot.workspaceDir,
		metadataSnapshot
	}) && listRuntimePluginIdsFromRegistry(activeRegistry).every(createRuntimePluginManifestLookup(activeRegistry, metadataSnapshot.manifestRegistry.plugins)) ? activeRegistry : void 0;
	const registry = reusableGatewayRegistry ?? loadAgentRuntimePluginRegistryHandle({
		config: input.config,
		env: input.env ?? process.env,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		metadataSnapshot,
		preferBuiltPluginArtifacts: true,
		configuredHarnessRuntimes
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
function prepareWorkspacePluginRegistries(input, metadataSnapshot, retainRegistry, loadInboundRegistry, preferBuiltPluginArtifacts = false, reusableGeneration, getConfiguredHarnessRuntimes, basePluginIds, loadRuntimeRegistry = loadAgentRuntimePluginRegistryHandle, purpose) {
	if (purpose !== "model-catalog" && input.readOnly && !input.loadRuntimePlugins && !input.runtimePluginSelections) return {};
	let primaryRegistry;
	const inboundPluginRegistry = input.readOnly || purpose === "model-catalog" ? void 0 : reusableGeneration?.inboundPluginRegistry ?? loadInboundRegistry?.(input, metadataSnapshot, getConfiguredHarnessRuntimes?.(), (source) => {
		primaryRegistry = source;
	});
	const baseRegistry = reusableGeneration?.pluginRegistry ?? inboundPluginRegistry;
	for (const registry of /* @__PURE__ */ new Set([inboundPluginRegistry, baseRegistry])) if (registry) retainRegistry(registry);
	primaryRegistry ??= reusableGeneration?.mediaCapabilityProviderSource?.registry ?? baseRegistry;
	let loadedPrimaryRegistry;
	const runtimePluginRegistry = purpose === "model-catalog" || input.runtimePluginSelections || !baseRegistry ? loadRuntimeRegistry({
		...purpose === "model-catalog" ? { basePluginIds: basePluginIds ?? [] } : input.loadRuntimePlugins ? { basePluginIds: [] } : baseRegistry ? { basePluginIds: listRuntimePluginIdsFromRegistry(baseRegistry) } : basePluginIds !== void 0 ? { basePluginIds } : {},
		...reusableGeneration?.pluginRegistry ? { reusableRegistry: reusableGeneration.pluginRegistry } : {},
		config: input.config,
		env: input.env ?? process.env,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		metadataSnapshot,
		...preferBuiltPluginArtifacts ? { preferBuiltPluginArtifacts: true } : {},
		selections: input.runtimePluginSelections,
		configuredHarnessRuntimes: getConfiguredHarnessRuntimes?.(),
		...purpose ? { purpose } : {}
	}, (source) => {
		loadedPrimaryRegistry = reusableGeneration && source === reusableGeneration.pluginRegistry ? reusableGeneration.mediaCapabilityProviderSource?.registry ?? source : source;
	}) : baseRegistry;
	const prepared = (registry) => {
		if (registry) retainRegistry(registry);
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
//#region src/agents/prepared-model-runtime.synthetic-auth.ts
/** Synthetic-auth provider ref selection and prepared-catalog resolution for model-runtime builds. */
function scopeSyntheticAuthProviderRefs(refs, providerDiscoveryProviderIds) {
	if (!providerDiscoveryProviderIds) return [...refs];
	const scoped = new Set(providerDiscoveryProviderIds.map((id) => normalizeProviderId(id)));
	if (scoped.has("openai")) scoped.add("codex");
	return refs.filter((ref) => scoped.has(normalizeProviderId(ref)));
}
function listPreparedSyntheticAuthProviderRefs(providers) {
	return [...new Set(providers.flatMap((provider) => provider.resolveSyntheticAuth || provider.prepareSyntheticAuth ? [
		provider.id,
		...provider.aliases ?? [],
		...provider.hookAliases ?? []
	] : []))].toSorted((left, right) => left.localeCompare(right));
}
async function prepareSyntheticAuth(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	const providerPlugin = params.providers.find((candidate) => [
		candidate.id,
		...candidate.aliases ?? [],
		...candidate.hookAliases ?? []
	].some((ref) => normalizeProviderId(ref) === normalizedProvider));
	const context = {
		config: params.config,
		provider: params.provider,
		providerConfig: Object.entries(params.config.models?.providers ?? {}).find(([providerId]) => normalizeProviderId(providerId) === normalizedProvider)?.[1]
	};
	return providerPlugin ? await prepareSyntheticAuthWithProvider(providerPlugin, context, params) : void 0;
}
//#endregion
//#region src/agents/prepared-model-runtime.facts.ts
function prepareConfiguredModelFacts(config, pluginMetadataSnapshot) {
	return {
		inlineProviderModels: buildInlineProviderModels(config.models?.providers ?? {}, { providerMetadataOwners: pluginMetadataSnapshot.owners }),
		configuredCatalogEntries: buildConfiguredModelCatalog({
			cfg: config,
			manifestPlugins: pluginMetadataSnapshot
		})
	};
}
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
		const pluginMetadataSnapshot = preparedPluginMetadataSnapshot ?? reusablePluginGeneration?.pluginMetadataSnapshot ?? prepareOwnedPluginLoadContext(input, env, void 0);
		_usingCtx$1.u({ [Symbol.dispose]: retainPluginCache(getPluginMetadataSnapshotCache(pluginMetadataSnapshot)) });
		const pluginMetadataMs = reusablePluginGeneration ? 0 : performance.now() - pluginMetadataStartedAt;
		const runtimePluginStartedAt = performance.now();
		workspacePluginIds = pluginMetadataSnapshot.index.plugins.filter((plugin) => plugin.enabled && plugin.origin === "workspace").map((plugin) => plugin.pluginId);
		if (workspacePluginIds.length) reportStage("workspace plugins");
		const preferBuiltPluginArtifacts = reusablePluginGeneration?.preferBuiltPluginArtifacts ?? options.preferBuiltPluginArtifacts === true;
		const localResources = _usingCtx$1.a(new AsyncDisposableStack());
		const registryResources = options.registryResources ?? localResources.use(new PreparedModelRuntimeBuildResources(retainPreparedPluginRegistry));
		registryResources.retainGeneration(reusablePluginGeneration);
		const preparingRegistries = prepareWorkspacePluginRegistries(input, pluginMetadataSnapshot, (registry) => registryResources.retainRegistry(registry), loadInboundPluginRegistry, preferBuiltPluginArtifacts, reusablePluginGeneration, options.getConfiguredHarnessRuntimes, options.basePluginIds, options.loadRuntimeRegistry, options.purpose);
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
				syntheticAuthProviderRefs: catalogMode === "static" ? scopeSyntheticAuthProviderRefs(listPreparedSyntheticAuthProviderRefs(preparedSyntheticAuthProviders), options.providerDiscoveryProviderIds) : scopeSyntheticAuthProviderRefs(resolveRuntimeSyntheticAuthProviderRefs({
					config: input.config,
					env,
					index: pluginMetadataSnapshot.index,
					registryDiagnostics: pluginMetadataSnapshot.registryDiagnostics,
					...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
				}), configuredProviderIds),
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
				agentBaseFacts.push(withAgentRosterFactsBatch(candidate.config, () => prepareAgentFacts(candidate, catalogMode, ambientCredentials, options.providerDiscoveryProviderIds, options.includeCredentialProviders)));
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
				const configuredGeneratedCatalogPluginIds = [...new Set((facts.input.config.models?.mode === "replace" ? [] : facts.providerIds).flatMap((provider) => {
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
			let outcome;
			try {
				outcome = {
					ok: true,
					value: await run()
				};
			} catch (error) {
				outcome = {
					ok: false,
					error
				};
			}
			try {
				await claim.release();
			} catch (cleanupError) {
				outcome = {
					ok: false,
					error: outcome.ok ? cleanupError : new AggregateError([outcome.error, cleanupError], "Prepared construction and registration cleanup failed", { cause: outcome.error })
				};
			}
			if (!outcome.ok) throw outcome.error;
			if (!isSourceCurrent()) throw new Error("Prepared media capability provider source is retired");
			return outcome.value;
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
const fingerprintPreparedRuntimeFacts = (value) => sha256Base64Url(stableStringify(value));
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
		env: input.env ?? process.env,
		runtimePluginSelections: void 0,
		order: getPreparedRuntimeAuthProfileStoreSnapshotCore(input.agentDir, input.inheritedAuthDir)?.order ?? {}
	});
}
async function prepareConfiguredRuntimeFactsBatch(params) {
	const catalogs = /* @__PURE__ */ new Map();
	let registryCount = 0;
	const staticProviderConfigs = resolvePreparedProviderStaticConfigs(params.pluginGeneration.preparedStaticProviderCatalog);
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
		const oauthProviders = facts.templateAuthStorage.getOAuthProviders();
		const pluginCatalogs = loadPersistedPluginModelCatalogsReadOnly(facts.input.agentDir, facts.configuredGeneratedCatalogPluginIds);
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
export { prepareWorkspaceBuildGroup as a, createPreparedInboundRegistryLoader as c, prepareOwnedPluginLoadContext as d, prepareConfiguredRuntimeFacts as f, prepareConfiguredRuntimeFactsBatch as i, loadPreparedInboundPluginRegistry as l, fingerprintPreparedRuntimeFacts as n, preparedModelInventoryKey as o, prepareConfiguredModelFacts as r, scopeSyntheticAuthProviderRefs as s, captureModelsJsonContents as t, preparedModelRuntimeWorkspaceFactsKey as u };
