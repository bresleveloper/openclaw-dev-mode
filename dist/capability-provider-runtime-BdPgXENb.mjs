import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { v as sortUniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import { g as withBundledPluginEnablementCompat, m as isBundledProviderCompatContract, t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-Zl-RSskC.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { n as discoverOpenClawPlugins } from "./discovery-Dma3bVNk.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-U3x0s0Ho.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { n as isManifestPluginAvailableForControlPlane, o as loadManifestContractSnapshot, r as isManifestPluginOwnerAllowedByControlPlanePolicy, t as hasManifestContractValue } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { o as resolveConfiguredTalkRealtimeProviderId, s as resolveConfiguredTalkSpeechProviderId } from "./talk-tTHQncKV.mjs";
import { i as getPluginRuntimeLoadContext, n as buildPluginRuntimeLoadOptions } from "./load-context-Bf_u2yr8.mjs";
import { a as registryContainsRuntimePluginIds, n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-B1mWK6o9.mjs";
import { a as loadOpenClawPluginsWithInternalOverrides, l as resolvePluginCapabilityCatalogContext, n as acquirePluginRegistryWithInternalOverrides, u as resolveRuntimePluginRegistry } from "./loader-runtime-load-C3He8u8Z.mjs";
import { n as findCapabilityProviderEntry } from "./provider-registry-shared-Cov0065J.mjs";
import "./loader-vjZ2aI5b.mjs";
//#region src/tts/voice-models.ts
function normalizeTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function parseVoiceModelRef(value) {
	const parsed = typeof value === "string" ? parseModelCatalogRef(value) : null;
	return parsed ? {
		provider: parsed.provider,
		model: parsed.modelId
	} : void 0;
}
function sameProvider(left, right) {
	const normalizedLeft = normalizeOptionalLowercaseString(left);
	return Boolean(normalizedLeft && normalizedLeft === normalizeOptionalLowercaseString(right));
}
/** Match provider ids case-insensitively across canonical id and aliases. */
function providerMatchesId(provider, providerId) {
	return sameProvider(provider.id, providerId) || (provider.aliases ?? []).some((alias) => sameProvider(alias, providerId));
}
/** Find the provider metadata for a configured provider id or alias. */
function findVoiceModelProvider(params) {
	return params.providers.find((provider) => providerMatchesId(provider, params.providerId));
}
/** Return true when a provider advertises the requested model. */
function voiceProviderSupportsModel(provider, model) {
	if (!provider) return false;
	const normalizedModel = normalizeOptionalString(model);
	return [provider.defaultModel, ...provider.models ?? []].some((candidate) => normalizeOptionalString(candidate) === normalizedModel);
}
/** Parse primary/fallback voice model refs from config. */
function resolveVoiceModelRefs(config) {
	if (typeof config === "string") {
		const parsed = parseVoiceModelRef(config);
		return parsed ? [parsed] : [];
	}
	const voiceModel = asOptionalRecord(config);
	if (!voiceModel) return [];
	const timeoutMs = normalizeTimeoutMs(voiceModel.timeoutMs);
	const refs = [];
	const addRef = (value) => {
		const parsed = parseVoiceModelRef(value);
		if (parsed) refs.push({
			...parsed,
			...timeoutMs === void 0 ? {} : { timeoutMs }
		});
	};
	addRef(voiceModel.primary);
	if (Array.isArray(voiceModel.fallbacks)) for (const fallback of voiceModel.fallbacks) addRef(fallback);
	return refs;
}
/** Resolve configured voice model refs that are supported by known providers. */
function resolveSupportedVoiceModelRefs(params) {
	return resolveVoiceModelRefs(params.config).flatMap((ref) => {
		const provider = findVoiceModelProvider({
			providers: params.providers,
			providerId: ref.provider
		});
		if (!provider || params.providerId && !providerMatchesId(provider, params.providerId)) return [];
		return voiceProviderSupportsModel(provider, ref.model) ? [{
			...ref,
			provider: provider.id
		}] : [];
	});
}
/** Build ordered provider candidates from primary provider plus voice-model fallbacks. */
function resolveVoiceProviderCandidates(params) {
	const primary = findVoiceModelProvider({
		providers: params.providers,
		providerId: params.primaryProvider
	})?.id ?? params.primaryProvider;
	const candidates = [];
	const seenProviders = /* @__PURE__ */ new Set();
	const addCandidate = (candidate) => {
		candidates.push(candidate);
		seenProviders.add(candidate.provider);
	};
	const refs = resolveSupportedVoiceModelRefs({
		config: params.voiceModelConfig,
		providers: params.providers
	});
	const primaryRefs = refs.filter((ref) => ref.provider === primary);
	for (const voiceModel of primaryRefs) addCandidate({
		provider: primary,
		voiceModel
	});
	if (primaryRefs.length === 0) addCandidate({ provider: primary });
	for (const voiceModel of refs) if (voiceModel.provider !== primary) addCandidate({
		provider: voiceModel.provider,
		voiceModel
	});
	for (const provider of params.providers) if (!seenProviders.has(provider.id)) addCandidate({ provider: provider.id });
	return candidates;
}
/** Resolve only the primary provider candidate for direct synthesis paths. */
function resolvePrimaryVoiceProviderCandidate(params) {
	const provider = findVoiceModelProvider({
		providers: params.providers,
		providerId: params.primaryProvider
	})?.id ?? params.primaryProvider;
	const voiceModel = resolveSupportedVoiceModelRefs({
		config: params.voiceModelConfig,
		providers: params.providers,
		providerId: provider
	})[0];
	return voiceModel ? {
		provider,
		voiceModel
	} : { provider };
}
/** Read provider config by configured id, canonical id, or alias. */
function getVoiceProviderConfig(params) {
	const candidates = [
		normalizeOptionalString(params.configuredProviderId),
		params.provider.id,
		...params.provider.aliases ?? []
	].filter((key) => Boolean(key));
	const configuredKeys = Object.keys(params.providerConfigs);
	for (const candidate of candidates) {
		if (Object.hasOwn(params.providerConfigs, candidate)) return params.providerConfigs[candidate] ?? {};
		const normalizedCandidate = normalizeOptionalLowercaseString(candidate);
		const matchingKey = configuredKeys.find((key) => normalizeOptionalLowercaseString(key) === normalizedCandidate);
		if (matchingKey) return params.providerConfigs[matchingKey] ?? {};
	}
	return {};
}
//#endregion
//#region src/plugins/bundled-capability-runtime.ts
/** Loads capability providers through the canonical scoped plugin loader. */
const log = createSubsystemLogger("plugins");
function createCapabilityRegistrationRuntime(config) {
	return { config: {
		current: () => config,
		mutateConfigFile: async () => {
			throw new Error("Capability discovery cannot mutate plugin configuration.");
		},
		replaceConfigFile: async () => {
			throw new Error("Capability discovery cannot replace plugin configuration.");
		}
	} };
}
function loadBundledCapabilityRuntimeRegistry(params) {
	const { options, overrides } = prepareBundledCapabilityRuntime(params);
	return loadOpenClawPluginsWithInternalOverrides(options, overrides);
}
function acquireBundledCapabilityRuntimeRegistry(params) {
	const { options, overrides } = prepareBundledCapabilityRuntime(params);
	return acquirePluginRegistryWithInternalOverrides(options, overrides);
}
function prepareBundledCapabilityRuntime(params) {
	const { pluginIds: requestedPluginIds, ...loadOptions } = params;
	const env = params.env ?? process.env;
	const config = params.config?.plugins?.enabled === false ? params.config : withBundledPluginEnablementCompat({
		config: params.config,
		pluginIds: params.pluginIds,
		env
	}) ?? {};
	const snapshot = !params.discovery && !params.installRecords ? getGatewayPluginMetadataSnapshot() : void 0;
	const preparedRegistry = params.manifestRegistry ?? (snapshot ? snapshot.bundledManifestRegistry ?? {
		plugins: [],
		diagnostics: []
	} : void 0);
	const discovery = preparedRegistry ? void 0 : params.discovery ?? discoverOpenClawPlugins({
		env,
		workspaceDir: params.workspaceDir,
		installRecords: params.installRecords
	});
	const pluginIds = new Set(params.pluginIds);
	const manifestRegistry = preparedRegistry ?? loadPluginManifestRegistryCore({
		config,
		env,
		workspaceDir: params.workspaceDir,
		installRecords: params.installRecords,
		candidates: discovery?.candidates,
		diagnostics: discovery?.diagnostics
	});
	const scopedManifestRegistry = {
		plugins: manifestRegistry.plugins.filter((plugin) => plugin.origin === "bundled" && pluginIds.has(plugin.id)),
		diagnostics: manifestRegistry.diagnostics
	};
	return {
		options: {
			...loadOptions,
			config,
			env,
			onlyPluginIds: [...requestedPluginIds],
			cache: false,
			activate: false,
			channelPluginLoadIntent: "full",
			manifestRegistry: scopedManifestRegistry,
			logger: {
				info: (message) => log.info(message),
				warn: (message) => log.warn(message),
				error: (message) => log.error(message),
				debug: (message) => log.debug(message)
			}
		},
		overrides: {
			runtime: createCapabilityRegistrationRuntime(config),
			moduleLoader: {
				installNativeSdkResolver: false,
				loaderFilename: import.meta.url
			}
		}
	};
}
//#endregion
//#region src/plugins/capability-provider-runtime.ts
function projectCapabilityProviderEntries(entries, project) {
	if (!project) return entries;
	return entries.map((entry) => ({
		...entry,
		provider: project(entry.provider, entry.pluginId)
	}));
}
function shouldMergeManifestProvidersWhenActive(key) {
	return key === "mediaUnderstandingProviders" || key === "imageGenerationProviders" || key === "videoGenerationProviders" || key === "musicGenerationProviders";
}
function shouldSkipCapabilityResolution(params) {
	return params.cfg?.plugins?.enabled === false && params.key !== "speechProviders";
}
/** Loads the manifest snapshot used to resolve capability-provider ownership. */
function loadCapabilityManifestSnapshot(params) {
	if (params.pluginMetadataSnapshot) return params.pluginMetadataSnapshot;
	return loadManifestContractSnapshot({
		config: params.cfg,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
}
function resolveCapabilityPluginIds(params) {
	const snapshot = loadCapabilityManifestSnapshot(params);
	const isEnabled = createInstalledPluginEnabledPredicate(snapshot.index.plugins, params.cfg);
	let normalizedConfig;
	const providerIds = params.providerIds;
	const matchedProviderIds = providerIds ? /* @__PURE__ */ new Set() : void 0;
	const availableContractPlugins = snapshot.plugins.filter((plugin) => {
		if (!hasManifestContractValue({
			plugin,
			contract: params.key,
			value: params.providerId
		}) || providerIds && !plugin.contracts?.[params.key]?.some((value) => providerIds.has(value)) || !isManifestPluginAvailableForControlPlane({
			snapshot,
			plugin,
			config: params.cfg,
			isInstalledPluginEnabled: isEnabled,
			normalizedConfig: params.cfg?.plugins && (normalizedConfig ??= normalizePluginsConfig(params.cfg.plugins)),
			allowRestrictiveAllowlistBypass: params.key === "speechProviders" && params.cfg?.plugins?.enabled === false,
			allowBundledProviderCompat: isBundledProviderCompatContract(params.key)
		})) return false;
		if (providerIds && matchedProviderIds) {
			for (const value of plugin.contracts?.[params.key] ?? []) if (providerIds.has(value)) matchedProviderIds.add(value);
		}
		return true;
	});
	if (providerIds && matchedProviderIds?.size && matchedProviderIds.size < providerIds.size) return resolveCapabilityPluginIds({
		...params,
		providerIds: void 0
	});
	return {
		runtimePluginIds: sortUniqueStrings(availableContractPlugins.map((plugin) => plugin.id)),
		bundledCompatPluginIds: sortUniqueStrings(availableContractPlugins.filter((plugin) => plugin.origin === "bundled").map((plugin) => plugin.id))
	};
}
function createCapabilityProviderLoadOptions(params) {
	const pluginIds = params.resolution.bundledCompatPluginIds;
	const config = withBundledPluginEnablementCompat({
		config: params.cfg,
		pluginIds,
		...params.loadContext?.env ? { env: params.loadContext.env } : {}
	});
	const overrides = {
		...config === void 0 ? {} : { config },
		onlyPluginIds: params.resolution.runtimePluginIds,
		activate: false
	};
	return params.loadContext ? buildPluginRuntimeLoadOptions(params.loadContext, overrides) : overrides;
}
function resolveCapabilityLoadContext(registry, cfg) {
	const context = getPluginRuntimeLoadContext(registry);
	if (!context?.metadataSnapshot || context.env !== process.env) return;
	return getCurrentPluginMetadataSnapshot({
		config: cfg,
		workspaceDir: context.workspaceDir,
		...cfg === void 0 ? { requireDefaultDiscoveryContext: true } : {}
	}) === context.metadataSnapshot ? context : void 0;
}
function mergeCapabilityProviderEntries(left, right) {
	const merged = /* @__PURE__ */ new Map();
	const unnamed = [];
	for (const entries of [left, right]) for (const entry of entries) {
		const provider = entry.provider;
		if (!provider.id) {
			unnamed.push(entry);
			continue;
		}
		if (!merged.has(provider.id)) merged.set(provider.id, entry);
	}
	return [...merged.values(), ...unnamed];
}
function addObjectKeys(target, value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return;
	for (const key of Object.keys(value)) addStringValue(target, key);
}
function addStringValue(target, value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized) target.add(normalized);
}
function addModelConfigProviderIds(target, value) {
	for (const ref of resolveVoiceModelRefs(value)) addStringValue(target, ref.provider);
}
function collectRequestedSpeechProviderIds(cfg, options) {
	const requested = /* @__PURE__ */ new Set();
	addStringValue(requested, cfg?.tts?.provider);
	addObjectKeys(requested, cfg?.tts?.providers);
	addStringValue(requested, cfg && resolveConfiguredTalkSpeechProviderId(cfg));
	if (options.includeVoiceModel) addModelConfigProviderIds(requested, cfg?.agents?.defaults?.voiceModel);
	addObjectKeys(requested, cfg?.models?.providers);
	return requested;
}
function collectRequestedVoiceModelProviderIds(cfg) {
	const requested = /* @__PURE__ */ new Set();
	addModelConfigProviderIds(requested, cfg?.agents?.defaults?.voiceModel);
	return requested;
}
function collectRequestedCapabilityProviderIds(params) {
	switch (params.key) {
		case "speechProviders": return collectRequestedSpeechProviderIds(params.cfg, { includeVoiceModel: params.includeVoiceModel ?? false });
		case "realtimeTranscriptionProviders": return params.includeVoiceModel ? collectRequestedVoiceModelProviderIds(params.cfg) : void 0;
		case "realtimeVoiceProviders": {
			const requested = params.includeVoiceModel ? collectRequestedVoiceModelProviderIds(params.cfg) : /* @__PURE__ */ new Set();
			addStringValue(requested, resolveConfiguredTalkRealtimeProviderId(params.cfg ?? {}));
			return requested.size > 0 ? requested : void 0;
		}
		default: return;
	}
}
function shouldScopeCapabilityLoadToRequestedProviders(key) {
	return key === "speechProviders" || key === "realtimeTranscriptionProviders" || key === "realtimeVoiceProviders";
}
function* capabilityProviderIds(provider) {
	if (typeof provider.id === "string") yield provider.id.toLowerCase();
	if (Array.isArray(provider.aliases)) {
		for (const alias of provider.aliases) if (typeof alias === "string") yield alias.toLowerCase();
	}
}
function removeActiveProviderIds(requested, entries) {
	for (const { provider } of entries) for (const id of capabilityProviderIds(provider)) requested.delete(id);
}
function filterPolicyAllowedCapabilityProviders(params) {
	if (!params.cfg?.plugins) return params.entries;
	let normalizedConfig;
	const origins = new Map((params.registry?.plugins ?? []).map((plugin) => [plugin.id, plugin.origin]));
	return params.entries.filter((entry) => {
		const origin = origins.get(entry.pluginId) ?? (params.bundledPluginIds?.has(entry.pluginId) ? "bundled" : "global");
		return isManifestPluginOwnerAllowedByControlPlanePolicy({
			plugin: {
				id: entry.pluginId,
				origin
			},
			config: params.cfg,
			normalizedConfig: normalizedConfig ??= normalizePluginsConfig(params.cfg?.plugins),
			allowRestrictiveAllowlistBypass: params.key === "speechProviders" && params.cfg?.plugins?.enabled === false,
			allowBundledProviderCompat: isBundledProviderCompatContract(params.key)
		});
	});
}
function prepareCapabilityProviderLoad(params, onSelectedRegistry) {
	const allowedPluginIds = new Set(params.loadOptions.onlyPluginIds);
	const scopedRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const loadedRegistry = scopedRegistry ? registryContainsRuntimePluginIds(scopedRegistry, params.loadOptions.onlyPluginIds) ? scopedRegistry : void 0 : getLoadedRuntimePluginRegistry({
		env: params.loadOptions.env,
		loadOptions: params.loadOptions,
		workspaceDir: params.loadOptions.workspaceDir,
		requiredPluginIds: params.loadOptions.onlyPluginIds
	});
	const loadedProject = onSelectedRegistry?.(loadedRegistry);
	const filterAllowedEntries = (registry) => {
		const project = registry === loadedRegistry ? loadedProject : onSelectedRegistry?.(registry);
		return projectCapabilityProviderEntries((registry?.[params.key] ?? []).filter((entry) => allowedPluginIds.has(entry.pluginId)), project);
	};
	const catalogFamily = shouldScopeCapabilityLoadToRequestedProviders(params.key) ? params.key : void 0;
	return {
		loadOptions: params.loadOptions,
		loadedRegistry,
		resolveLoadOptions: () => ({
			...params.loadOptions,
			...catalogFamily ? { capabilityCatalog: {
				family: catalogFamily,
				context: resolvePluginCapabilityCatalogContext()
			} } : {}
		}),
		merge(entries, registry) {
			return mergeCapabilityProviderEntries(entries, filterAllowedEntries(registry));
		},
		filterAllowedEntries,
		fallback(registry) {
			const entries = filterAllowedEntries(registry);
			const missingRequested = params.requested && params.requested.size > 0 ? new Set(params.requested) : void 0;
			if (missingRequested) removeActiveProviderIds(missingRequested, entries);
			if (entries.length > 0 && (!missingRequested || missingRequested.size === 0)) return {
				entries,
				pluginIds: []
			};
			return {
				entries,
				pluginIds: params.bundledCompatPluginIds.filter((pluginId) => !registry?.plugins.some((plugin) => plugin.id === pluginId && catalogFamily && plugin.capabilityCatalog?.includes(catalogFamily)))
			};
		}
	};
}
function loadCapabilityProviderEntries(load) {
	const registry = load.loadedRegistry ?? resolveRuntimePluginRegistry(load.resolveLoadOptions());
	const { entries, pluginIds } = load.fallback(registry);
	if (pluginIds.length === 0) return entries;
	const captured = load.filterAllowedEntries(loadBundledCapabilityRuntimeRegistry({
		...load.loadOptions,
		pluginIds
	}));
	return entries.length > 0 ? mergeCapabilityProviderEntries(entries, captured) : captured;
}
function resolvePluginCapabilityProvider(params, onSelectedRegistry) {
	const resolution = preparePluginCapabilityProviderLookup(params, onSelectedRegistry);
	return resolution.resolve(resolution.load ? loadCapabilityProviderEntries(resolution.prepareLoad()) : []);
}
function preparePluginCapabilityProviderLookup(params, onSelectedRegistry) {
	if (shouldSkipCapabilityResolution(params)) return {
		load: void 0,
		resolve: (_entries) => void 0
	};
	const projections = /* @__PURE__ */ new WeakMap();
	const selectRegistry = onSelectedRegistry && ((registry) => {
		const project = onSelectedRegistry(registry);
		return project ? (provider, pluginId) => {
			projections.set(provider, () => project(provider, pluginId));
			return provider;
		} : void 0;
	});
	const selectProvider = (entries) => {
		const provider = findCapabilityProviderEntry(entries, params.providerId)?.provider;
		return provider ? projections.get(provider)?.() ?? provider : void 0;
	};
	const activeRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getLoadedRuntimePluginRegistry();
	const project = selectRegistry?.(activeRegistry);
	const activeProvider = selectProvider(projectCapabilityProviderEntries(filterPolicyAllowedCapabilityProviders({
		entries: activeRegistry?.[params.key] ?? [],
		registry: activeRegistry,
		cfg: params.cfg,
		key: params.key
	}), project));
	if (activeProvider) return {
		load: void 0,
		resolve: (_entries) => activeProvider
	};
	const loadContext = resolveCapabilityLoadContext(activeRegistry, params.cfg);
	const pluginMetadataSnapshot = loadCapabilityManifestSnapshot({
		cfg: params.cfg,
		pluginMetadataSnapshot: loadContext?.metadataSnapshot
	});
	let pluginIds = resolveCapabilityPluginIds({
		key: params.key,
		cfg: params.cfg,
		providerId: params.providerId,
		pluginMetadataSnapshot
	});
	if (pluginIds.runtimePluginIds.length === 0) {
		pluginIds = resolveCapabilityPluginIds({
			key: params.key,
			cfg: params.cfg,
			pluginMetadataSnapshot
		});
		if (pluginIds.runtimePluginIds.length === 0) return {
			load: void 0,
			resolve: (_entries) => void 0
		};
	}
	const loadOptions = createCapabilityProviderLoadOptions({
		cfg: params.cfg,
		resolution: pluginIds,
		loadContext
	});
	const load = {
		key: params.key,
		bundledCompatPluginIds: pluginIds.bundledCompatPluginIds,
		loadOptions,
		requested: /* @__PURE__ */ new Set([params.providerId.toLowerCase()])
	};
	return {
		load,
		prepareLoad: () => prepareCapabilityProviderLoad(load, selectRegistry),
		resolve: selectProvider
	};
}
function preparePluginCapabilityProviderResolution(params, onSelectedRegistry) {
	if (shouldSkipCapabilityResolution(params)) return {
		load: void 0,
		resolve: (_entries) => []
	};
	const activeRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getLoadedRuntimePluginRegistry();
	const project = onSelectedRegistry?.(activeRegistry);
	const activeProviders = projectCapabilityProviderEntries(filterPolicyAllowedCapabilityProviders({
		entries: activeRegistry?.[params.key] ?? [],
		registry: activeRegistry,
		cfg: params.cfg,
		key: params.key
	}), project);
	const requested = collectRequestedCapabilityProviderIds({
		key: params.key,
		cfg: params.cfg,
		includeVoiceModel: activeProviders.length > 0
	}) ?? /* @__PURE__ */ new Set();
	const mergeManifestProviders = shouldMergeManifestProvidersWhenActive(params.key);
	if (requested.size > 0 || activeProviders.length > 0 && !mergeManifestProviders) for (const providerId of params.additionalProviderIds ?? []) addStringValue(requested, providerId);
	removeActiveProviderIds(requested, activeProviders);
	const requestedProviders = requested.size > 0 ? requested : void 0;
	if (activeProviders.length > 0 && !requestedProviders && !mergeManifestProviders) return {
		load: void 0,
		resolve: (_entries) => activeProviders.map((entry) => entry.provider)
	};
	const requestedProviderLoadScope = requestedProviders && shouldScopeCapabilityLoadToRequestedProviders(params.key) ? requestedProviders : void 0;
	const loadContext = resolveCapabilityLoadContext(activeRegistry, params.cfg);
	const pluginMetadataSnapshot = loadCapabilityManifestSnapshot({
		cfg: params.cfg,
		pluginMetadataSnapshot: loadContext?.metadataSnapshot
	});
	const requestedPluginIds = requestedProviderLoadScope ? resolveCapabilityPluginIds({
		key: params.key,
		cfg: params.cfg,
		providerIds: requestedProviderLoadScope,
		pluginMetadataSnapshot
	}) : void 0;
	const requestedProviderFilter = requestedProviders && (!shouldScopeCapabilityLoadToRequestedProviders(params.key) || requestedPluginIds?.runtimePluginIds.length) ? requestedProviders : void 0;
	const pluginIds = requestedPluginIds?.runtimePluginIds.length ? requestedPluginIds : resolveCapabilityPluginIds({
		key: params.key,
		cfg: params.cfg,
		pluginMetadataSnapshot
	});
	const loadOptions = createCapabilityProviderLoadOptions({
		cfg: params.cfg,
		resolution: pluginIds,
		loadContext
	});
	const load = {
		key: params.key,
		bundledCompatPluginIds: pluginIds.bundledCompatPluginIds,
		loadOptions,
		requested: requestedProviderFilter
	};
	return {
		load,
		prepareLoad: () => prepareCapabilityProviderLoad(load, onSelectedRegistry),
		resolve: (loadedProviders) => {
			const loadedProviderFilter = activeProviders.length > 0 ? requestedProviders : requestedProviderFilter;
			const requestedLoadedProviders = loadedProviderFilter ? loadedProviders.filter(({ provider }) => {
				for (const id of capabilityProviderIds(provider)) if (loadedProviderFilter.has(id)) return true;
				return false;
			}) : loadedProviders;
			return mergeCapabilityProviderEntries(activeProviders, requestedLoadedProviders).map((entry) => entry.provider);
		}
	};
}
function resolvePluginCapabilityProviders(params, onSelectedRegistry) {
	const resolution = preparePluginCapabilityProviderResolution(params, onSelectedRegistry);
	return resolution.resolve(resolution.load ? loadCapabilityProviderEntries(resolution.prepareLoad()) : []);
}
function prepareMediaCapabilityProviders(params) {
	const providers = (key) => {
		if (shouldSkipCapabilityResolution({
			key,
			cfg: params.cfg
		})) return [];
		const resolution = resolveCapabilityPluginIds({
			key,
			cfg: params.cfg,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot
		});
		const requiredPluginIds = resolution.runtimePluginIds;
		if (requiredPluginIds.length === 0 && params.pluginMetadataSnapshot.plugins.some((plugin) => hasManifestContractValue({
			plugin,
			contract: key
		}))) return Object.freeze([]);
		if (!params.registry || !registryContainsRuntimePluginIds(params.registry, requiredPluginIds)) return;
		const eligiblePluginIds = new Set(requiredPluginIds);
		const availableEntries = filterPolicyAllowedCapabilityProviders({
			entries: params.registry[key],
			registry: params.registry,
			cfg: params.cfg,
			key,
			bundledPluginIds: new Set(resolution.bundledCompatPluginIds)
		});
		if (availableEntries.some((entry) => !eligiblePluginIds.has(entry.pluginId))) return;
		return Object.freeze(availableEntries.map((entry) => entry.provider));
	};
	return Object.freeze({
		mediaUnderstandingProviders: providers("mediaUnderstandingProviders"),
		imageGenerationProviders: providers("imageGenerationProviders"),
		videoGenerationProviders: providers("videoGenerationProviders"),
		musicGenerationProviders: providers("musicGenerationProviders")
	});
}
//#endregion
export { resolvePluginCapabilityProviders as a, providerMatchesId as c, resolveVoiceModelRefs as d, resolveVoiceProviderCandidates as f, resolvePluginCapabilityProvider as i, resolvePrimaryVoiceProviderCandidate as l, preparePluginCapabilityProviderLookup as n, acquireBundledCapabilityRuntimeRegistry as o, voiceProviderSupportsModel as p, preparePluginCapabilityProviderResolution as r, getVoiceProviderConfig as s, prepareMediaCapabilityProviders as t, resolveSupportedVoiceModelRefs as u };
