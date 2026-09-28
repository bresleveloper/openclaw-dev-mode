import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { E as listAgentEntries } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DtesR9-z.mjs";
import { _ as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-ngXQhRsV.mjs";
import { a as resolveConfiguredTalkRealtimeProviderId } from "./talk-CaH8Mknv.mjs";
import { a as resolveConfiguredChannelAutoEnableCandidates, i as collectAutoEnableChannelIds, n as materializePluginAutoEnableCandidatesInternal, t as hasMaterialPluginEntryConfig } from "./plugin-auto-enable.materialize-D_ZwWzfs.mjs";
import { i as isNativeSessionCatalogOptOutOnly } from "./native-session-catalog-config-CYC8tjEu.mjs";
import { t as resolvePluginSetupAutoEnableReasons } from "./setup-registry-D5VN3YGP.mjs";
import { t as getConfiguredDecisionProviderIds } from "./decision-model-setting-BX2feN2y.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-DBwiH9TR.mjs";
import { t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-CXRk02Zm.mjs";
import { t as collectConfiguredWorkerProviderIds } from "./worker-provider-config-OOjrHh-W.mjs";
import { t as listBundledWorkerProviderOwners } from "./worker-provider-manifest-nXb1-dX2.mjs";
import { l as resolveOwningPluginIdsForModelRef } from "./providers-Bx7WoFEI.mjs";
//#region src/config/plugin-auto-enable.shared.ts
const EMPTY_PLUGIN_MANIFEST_REGISTRY = {
	plugins: [],
	diagnostics: []
};
function resolveAutoEnableProviderPluginIds(registry) {
	const entries = /* @__PURE__ */ new Map();
	for (const plugin of registry.plugins) for (const providerId of plugin.autoEnableWhenConfiguredProviders ?? []) if (!entries.has(providerId)) entries.set(providerId, plugin.id);
	return Object.fromEntries(entries);
}
function canReuseUnscopedCurrentPluginMetadataSnapshot(config) {
	return normalizePluginsConfig(config.plugins).loadPaths.length === 0;
}
function extractProviderFromModelRef(value) {
	const trimmed = value.trim();
	const slash = trimmed.indexOf("/");
	if (slash <= 0) return null;
	return normalizeProviderId(trimmed.slice(0, slash));
}
function hasConfiguredEmbeddedHarnessRuntime(cfg, _env) {
	return collectConfiguredAgentHarnessRuntimes(cfg).length > 0;
}
function resolveAgentHarnessOwnerPluginIds(registry, runtime) {
	const normalizedRuntime = normalizeOptionalLowercaseString(runtime);
	if (!normalizedRuntime) return [];
	return registry.plugins.filter((plugin) => [...plugin.activation?.onAgentHarnesses ?? [], ...plugin.cliBackends ?? []].some((entry) => normalizeOptionalLowercaseString(entry) === normalizedRuntime)).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
function isProviderConfigured(cfg, providerId) {
	const normalized = normalizeProviderId(providerId);
	const profiles = cfg.auth?.profiles;
	if (profiles && typeof profiles === "object") for (const profile of Object.values(profiles)) {
		if (!isRecord(profile)) continue;
		if (normalizeProviderId(profile.provider ?? "") === normalized) return true;
	}
	const providerConfig = cfg.models?.providers;
	if (providerConfig && typeof providerConfig === "object") {
		for (const key of Object.keys(providerConfig)) if (normalizeProviderId(key) === normalized) return true;
	}
	for (const { value: ref } of collectConfiguredModelRefs(cfg, { includeChannelModelOverrides: false })) {
		const provider = extractProviderFromModelRef(ref);
		if (provider && provider === normalized) return true;
	}
	return false;
}
function hasPluginOwnedWebSearchConfig(cfg, pluginId) {
	const pluginConfig = cfg.plugins?.entries?.[pluginId]?.config;
	return isRecord(pluginConfig) && isRecord(pluginConfig.webSearch);
}
function hasPluginOwnedWebFetchConfig(cfg, pluginId) {
	const pluginConfig = cfg.plugins?.entries?.[pluginId]?.config;
	return isRecord(pluginConfig) && isRecord(pluginConfig.webFetch);
}
function resolvePluginOwnedToolConfigKeys(plugin) {
	if ((plugin.contracts?.tools?.length ?? 0) === 0) return [];
	const properties = isRecord(plugin.configSchema) ? plugin.configSchema.properties : void 0;
	if (!isRecord(properties)) return [];
	return Object.keys(properties).filter((key) => key !== "webSearch" && key !== "webFetch");
}
function hasPluginOwnedToolConfig(cfg, plugin) {
	const entry = cfg.plugins?.entries?.[plugin.id];
	const pluginConfig = entry?.config;
	if (isNativeSessionCatalogOptOutOnly(plugin.id, entry) || !isRecord(pluginConfig)) return false;
	return resolvePluginOwnedToolConfigKeys(plugin).some((key) => pluginConfig[key] !== void 0);
}
function resolveProviderPluginsWithOwnedWebSearch(registry) {
	return registry.plugins.filter((plugin) => (plugin.providers?.length ?? 0) > 0).filter((plugin) => (plugin.contracts?.webSearchProviders?.length ?? 0) > 0);
}
function resolveProviderPluginsWithOwnedWebFetch(registry) {
	return registry.plugins.filter((plugin) => (plugin.contracts?.webFetchProviders?.length ?? 0) > 0);
}
function resolvePluginIdsForConfiguredSpeechProvider(providerId, registry) {
	const normalizedProviderId = normalizeOptionalLowercaseString(providerId);
	if (!normalizedProviderId) return [];
	return registry.plugins.filter((plugin) => (plugin.contracts?.speechProviders ?? []).some((candidate) => normalizeOptionalLowercaseString(candidate) === normalizedProviderId)).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
function resolvePluginsWithOwnedToolConfig(registry) {
	return registry.plugins.filter((plugin) => (plugin.contracts?.tools?.length ?? 0) > 0);
}
function resolvePluginIdForConfiguredWebFetchProvider(providerId, registry) {
	const normalizedProviderId = normalizeOptionalLowercaseString(providerId);
	if (!normalizedProviderId) return;
	return registry.plugins.find((plugin) => plugin.origin === "bundled" && (plugin.contracts?.webFetchProviders ?? []).some((candidate) => normalizeOptionalLowercaseString(candidate) === normalizedProviderId))?.id;
}
function resolvePluginIdForConfiguredWebSearchProvider(providerId, registry) {
	const normalizedProviderId = normalizeOptionalLowercaseString(providerId);
	if (!normalizedProviderId) return;
	return registry.plugins.find((plugin) => (plugin.contracts?.webSearchProviders ?? []).some((candidate) => normalizeOptionalLowercaseString(candidate) === normalizedProviderId))?.id;
}
function hasConfiguredWebSearchProviderSelection(cfg) {
	const provider = cfg.tools?.web?.search?.provider;
	return cfg.tools?.web?.search?.enabled !== false && typeof provider === "string" && Boolean(provider.trim());
}
function hasConfiguredVoiceProviderSelection(cfg) {
	return Boolean(collectConfiguredSpeechProviderIds(cfg).size || resolveConfiguredTalkRealtimeProviderId(cfg));
}
function hasConfiguredPluginConfigEntry(cfg, configKey) {
	const entries = asOptionalObjectRecord(cfg.plugins?.entries);
	return entries !== void 0 && Object.values(entries).some((entry) => isRecord(entry) && isRecord(entry.config) && (configKey === void 0 || isRecord(entry.config[configKey])));
}
function listContainsNormalized(value, expected) {
	return Array.isArray(value) && value.some((entry) => normalizeOptionalLowercaseString(entry) === expected);
}
function toolPolicyReferencesBrowser(value) {
	return isRecord(value) && (listContainsNormalized(value.allow, "browser") || listContainsNormalized(value.alsoAllow, "browser"));
}
function hasBrowserToolReference(cfg) {
	if (toolPolicyReferencesBrowser(cfg.tools)) return true;
	return listAgentEntries(cfg).some((entry) => toolPolicyReferencesBrowser(entry.tools));
}
function collectConfiguredPluginEntryIds(cfg) {
	const entries = asOptionalObjectRecord(cfg.plugins?.entries);
	if (!entries) return [];
	return Object.keys(entries).map((pluginId) => pluginId.trim()).filter((pluginId) => pluginId && !isPluginEntryExplicitlyDisabled(cfg, pluginId));
}
function hasOwnPluginEntry(cfg, pluginId) {
	const entries = asOptionalObjectRecord(cfg.plugins?.entries);
	return entries !== void 0 && Object.hasOwn(entries, pluginId);
}
function isPluginEntryExplicitlyDisabled(cfg, pluginId) {
	return cfg.plugins?.entries?.[pluginId]?.enabled === false;
}
function hasNonDisabledPluginEntry(cfg, pluginId) {
	if (!hasOwnPluginEntry(cfg, pluginId)) return false;
	return !isPluginEntryExplicitlyDisabled(cfg, pluginId);
}
function hasBrowserSetupAutoEnableRelevantConfig(cfg) {
	if (cfg.browser?.enabled === false || isPluginEntryExplicitlyDisabled(cfg, "browser")) return false;
	if (isRecord(cfg.browser)) return true;
	if (hasNonDisabledPluginEntry(cfg, "browser")) return true;
	return hasBrowserToolReference(cfg);
}
function hasAcpxSetupAutoEnableRelevantConfig(cfg) {
	if (isPluginEntryExplicitlyDisabled(cfg, "acpx")) return false;
	if (!isRecord(cfg.acp)) return false;
	const backend = normalizeOptionalLowercaseString(cfg.acp.backend);
	return (cfg.acp.enabled === true || isRecord(cfg.acp.dispatch) && cfg.acp.dispatch.enabled === true || backend === "acpx") && (!backend || backend === "acpx");
}
function hasXaiSetupAutoEnableRelevantConfig(cfg) {
	if (isPluginEntryExplicitlyDisabled(cfg, "xai")) return false;
	const pluginConfig = cfg.plugins?.entries?.xai?.config;
	return isRecord(pluginConfig) && (isRecord(pluginConfig.xSearch) || isRecord(pluginConfig.codeExecution));
}
function resolveRelevantSetupAutoEnablePluginIds(cfg) {
	const pluginIds = new Set(collectConfiguredPluginEntryIds(cfg));
	if (hasBrowserSetupAutoEnableRelevantConfig(cfg)) pluginIds.add("browser");
	if (hasAcpxSetupAutoEnableRelevantConfig(cfg)) pluginIds.add("acpx");
	if (hasXaiSetupAutoEnableRelevantConfig(cfg)) pluginIds.add("xai");
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
function hasSetupAutoEnableRelevantConfig(cfg) {
	return hasBrowserSetupAutoEnableRelevantConfig(cfg) || hasAcpxSetupAutoEnableRelevantConfig(cfg) || hasXaiSetupAutoEnableRelevantConfig(cfg) || hasConfiguredPluginConfigEntry(cfg);
}
function hasPluginEntries(cfg) {
	const entries = asOptionalObjectRecord(cfg.plugins?.entries);
	return entries !== void 0 && Object.keys(entries).length > 0;
}
function hasPluginAllowlistWithMaterialEntries(cfg) {
	if (!Array.isArray(cfg.plugins?.allow) || cfg.plugins.allow.length === 0 || !hasPluginEntries(cfg)) return false;
	const entries = asOptionalObjectRecord(cfg.plugins?.entries);
	if (!entries) return false;
	return Object.values(entries).some(hasMaterialPluginEntryConfig);
}
function hasConfiguredProviderModelOrHarness(cfg, env) {
	if (getConfiguredDecisionProviderIds(cfg).length > 0) return true;
	if (cfg.auth?.profiles && Object.keys(cfg.auth.profiles).length > 0) return true;
	if (cfg.models?.providers && Object.keys(cfg.models.providers).length > 0) return true;
	if (collectConfiguredModelRefs(cfg, { includeChannelModelOverrides: false }).length > 0) return true;
	return hasConfiguredEmbeddedHarnessRuntime(cfg, env);
}
function arePluginsGloballyDisabled(cfg) {
	return cfg.plugins?.enabled === false;
}
function configMayNeedPluginManifestRegistry(cfg, env) {
	if (arePluginsGloballyDisabled(cfg)) return false;
	if (hasPluginAllowlistWithMaterialEntries(cfg)) return true;
	if (hasConfiguredPluginConfigEntry(cfg)) return true;
	if (hasConfiguredProviderModelOrHarness(cfg, env)) return true;
	if (hasConfiguredVoiceProviderSelection(cfg)) return true;
	if (collectConfiguredWorkerProviderIds(cfg).length > 0) return true;
	if (hasConfiguredWebSearchProviderSelection(cfg)) return true;
	const configuredChannels = cfg.channels;
	if (!configuredChannels || typeof configuredChannels !== "object") return false;
	for (const key of Object.keys(configuredChannels)) {
		if (key === "defaults" || key === "modelByChannel") continue;
		return true;
	}
	return false;
}
function configMayNeedPluginAutoEnable(cfg, env) {
	return resolvePluginAutoEnableReadiness(cfg, env).mayNeedAutoEnable;
}
function resolvePluginAutoEnableReadiness(cfg, env, discovery, ambientEnvTriggers = "allow") {
	if (arePluginsGloballyDisabled(cfg)) return {
		mayNeedAutoEnable: false,
		configuredChannelIds: []
	};
	const configuredChannelIds = collectAutoEnableChannelIds(cfg, env, discovery, ambientEnvTriggers);
	if (hasPluginAllowlistWithMaterialEntries(cfg)) return {
		mayNeedAutoEnable: true,
		configuredChannelIds
	};
	if (hasConfiguredPluginConfigEntry(cfg)) return {
		mayNeedAutoEnable: true,
		configuredChannelIds
	};
	if (configuredChannelIds.length > 0) return {
		mayNeedAutoEnable: true,
		configuredChannelIds
	};
	if (hasConfiguredProviderModelOrHarness(cfg, env)) return {
		mayNeedAutoEnable: true,
		configuredChannelIds
	};
	if (hasConfiguredVoiceProviderSelection(cfg)) return {
		mayNeedAutoEnable: true,
		configuredChannelIds
	};
	if (collectConfiguredWorkerProviderIds(cfg).length > 0) return {
		mayNeedAutoEnable: true,
		configuredChannelIds
	};
	if (hasConfiguredWebSearchProviderSelection(cfg) || hasConfiguredPluginConfigEntry(cfg, "webSearch") || hasConfiguredPluginConfigEntry(cfg, "webFetch")) return {
		mayNeedAutoEnable: true,
		configuredChannelIds
	};
	if (!hasSetupAutoEnableRelevantConfig(cfg)) return {
		mayNeedAutoEnable: false,
		configuredChannelIds
	};
	return {
		mayNeedAutoEnable: resolvePluginSetupAutoEnableReasons({
			config: cfg,
			env,
			pluginIds: resolveRelevantSetupAutoEnablePluginIds(cfg)
		}).length > 0,
		configuredChannelIds
	};
}
function resolveConfiguredPluginAutoEnableCandidates(params) {
	const changes = resolveConfiguredChannelAutoEnableCandidates(params);
	for (const [providerId, pluginId] of Object.entries(resolveAutoEnableProviderPluginIds(params.registry))) if (isProviderConfigured(params.config, providerId)) changes.push({
		pluginId,
		kind: "provider-auth-configured",
		providerId
	});
	const configuredModelPluginIds = /* @__PURE__ */ new Set();
	for (const modelRef of new Set(collectConfiguredModelRefs(params.config, { includeChannelModelOverrides: false }).map(({ value }) => value))) {
		const owningPluginIds = resolveOwningPluginIdsForModelRef({
			model: modelRef,
			config: params.config,
			env: params.env,
			manifestRegistry: params.registry
		});
		const pluginId = owningPluginIds?.length === 1 ? owningPluginIds[0] : void 0;
		if (!pluginId || configuredModelPluginIds.has(pluginId)) continue;
		configuredModelPluginIds.add(pluginId);
		changes.push({
			pluginId,
			kind: "provider-model-configured",
			modelRef
		});
	}
	for (const providerId of collectConfiguredSpeechProviderIds(params.config)) for (const pluginId of resolvePluginIdsForConfiguredSpeechProvider(providerId, params.registry)) changes.push({
		pluginId,
		kind: "speech-provider-selected",
		providerId
	});
	const realtimeProviderId = resolveConfiguredTalkRealtimeProviderId(params.config);
	if (realtimeProviderId) for (const plugin of params.registry.plugins) {
		if (!plugin.contracts?.realtimeVoiceProviders?.includes(realtimeProviderId.toLowerCase())) continue;
		changes.push({
			pluginId: plugin.id,
			kind: "setup-auto-enable",
			reason: `${realtimeProviderId} realtime voice provider selected`
		});
	}
	for (const { pluginId, providerId } of listBundledWorkerProviderOwners(params.registry, collectConfiguredWorkerProviderIds(params.config))) changes.push({
		pluginId,
		kind: "worker-provider-selected",
		providerId
	});
	const decisionProviderIds = new Set(getConfiguredDecisionProviderIds(params.config));
	for (const plugin of params.registry.plugins) for (const providerId of plugin.contracts?.decisionProviders ?? []) if (decisionProviderIds.has(providerId)) changes.push({
		pluginId: plugin.id,
		kind: "decision-provider-selected",
		providerId
	});
	for (const runtime of collectConfiguredAgentHarnessRuntimes(params.config)) {
		const pluginIds = resolveAgentHarnessOwnerPluginIds(params.registry, runtime);
		for (const pluginId of pluginIds) changes.push({
			pluginId,
			kind: "agent-harness-runtime-configured",
			runtime
		});
	}
	const webSearchConfig = params.config.tools?.web?.search;
	const webSearchProvider = webSearchConfig?.enabled !== false && typeof webSearchConfig?.provider === "string" ? webSearchConfig.provider : void 0;
	const webSearchPluginId = resolvePluginIdForConfiguredWebSearchProvider(webSearchProvider, params.registry);
	if (webSearchPluginId) changes.push({
		pluginId: webSearchPluginId,
		kind: "web-search-provider-selected",
		providerId: normalizeOptionalLowercaseString(webSearchProvider) ?? ""
	});
	const webFetchProvider = typeof params.config.tools?.web?.fetch?.provider === "string" ? params.config.tools.web.fetch.provider : void 0;
	const webFetchPluginId = resolvePluginIdForConfiguredWebFetchProvider(webFetchProvider, params.registry);
	if (webFetchPluginId) changes.push({
		pluginId: webFetchPluginId,
		kind: "web-fetch-provider-selected",
		providerId: normalizeOptionalLowercaseString(webFetchProvider) ?? ""
	});
	for (const plugin of resolveProviderPluginsWithOwnedWebSearch(params.registry)) {
		const pluginId = plugin.id;
		if (hasPluginOwnedWebSearchConfig(params.config, pluginId)) changes.push({
			pluginId,
			kind: "plugin-web-search-configured"
		});
	}
	for (const plugin of resolvePluginsWithOwnedToolConfig(params.registry)) {
		const pluginId = plugin.id;
		if (hasPluginOwnedToolConfig(params.config, plugin)) changes.push({
			pluginId,
			kind: "plugin-tool-configured"
		});
	}
	for (const plugin of resolveProviderPluginsWithOwnedWebFetch(params.registry)) {
		const pluginId = plugin.id;
		if (hasPluginOwnedWebFetchConfig(params.config, pluginId)) changes.push({
			pluginId,
			kind: "plugin-web-fetch-configured"
		});
	}
	if (hasSetupAutoEnableRelevantConfig(params.config)) {
		const manifestMatchedPluginIds = new Set(changes.map((entry) => entry.pluginId));
		const setupPluginIds = resolveRelevantSetupAutoEnablePluginIds(params.config).filter((pluginId) => !manifestMatchedPluginIds.has(pluginId));
		for (const entry of resolvePluginSetupAutoEnableReasons({
			config: params.config,
			env: params.env,
			pluginIds: setupPluginIds,
			manifestRegistry: params.registry
		})) changes.push({
			pluginId: entry.pluginId,
			kind: "setup-auto-enable",
			reason: entry.reason
		});
	}
	return changes;
}
function resolvePluginAutoEnableManifestRegistry(params) {
	if (params.manifestRegistry) return params.manifestRegistry;
	if (!configMayNeedPluginManifestRegistry(params.config, params.env)) return EMPTY_PLUGIN_MANIFEST_REGISTRY;
	return (getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		allowWorkspaceScopedSnapshot: true
	}) ?? (() => {
		if (!canReuseUnscopedCurrentPluginMetadataSnapshot(params.config)) return;
		const snapshot = getCurrentPluginMetadataSnapshot({
			env: params.env,
			allowWorkspaceScopedSnapshot: true,
			requireDefaultDiscoveryContext: true
		});
		return snapshot?.policyHash === resolveInstalledPluginIndexPolicyHash(params.config) ? snapshot : void 0;
	})())?.manifestRegistry ?? loadPluginMetadataSnapshot({
		config: params.config,
		env: params.env
	}).manifestRegistry;
}
//#endregion
//#region src/config/plugin-auto-enable.detect.ts
/** Detects installed plugins that should become enabled from existing config usage. */
function detectPluginAutoEnableCandidates(params) {
	const env = params.env ?? process.env;
	const config = params.config ?? {};
	const readiness = resolvePluginAutoEnableReadiness(config, env, params.discovery, params.ambientEnvTriggers);
	if (!readiness.mayNeedAutoEnable) return [];
	return resolveConfiguredPluginAutoEnableCandidates({
		config,
		env,
		registry: resolvePluginAutoEnableManifestRegistry({
			config,
			env,
			manifestRegistry: params.manifestRegistry
		}),
		configuredChannelIds: readiness.configuredChannelIds
	});
}
//#endregion
//#region src/config/plugin-auto-enable.apply.ts
let sameTurnApplyCache;
let sameTurnApplyCacheClearScheduled = false;
let stableFingerprintMemo = /* @__PURE__ */ new WeakMap();
registerPluginMetadataProcessMemoLifecycleClear(() => {
	stableFingerprintMemo = /* @__PURE__ */ new WeakMap();
	sameTurnApplyCache = void 0;
});
function scheduleSameTurnApplyCacheClear() {
	if (sameTurnApplyCacheClearScheduled) return;
	sameTurnApplyCacheClearScheduled = true;
	setImmediate(() => {
		sameTurnApplyCache = void 0;
		sameTurnApplyCacheClearScheduled = false;
	}).unref?.();
}
function getOrCreateWeakMap(parent, key, create) {
	const existing = parent.get(key);
	if (existing) return existing;
	const next = create();
	parent.set(key, next);
	return next;
}
function stableFingerprintValue(value) {
	if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
	const cached = stableFingerprintMemo.get(value);
	if (cached !== void 0) return cached;
	const fingerprint = Array.isArray(value) ? `[${value.map((entry) => stableFingerprintValue(entry)).join(",")}]` : (() => {
		const record = value;
		return `{${Object.keys(record).toSorted((left, right) => left.localeCompare(right)).map((key) => `${JSON.stringify(key)}:${stableFingerprintValue(record[key])}`).join(",")}}`;
	})();
	stableFingerprintMemo.set(value, fingerprint);
	return fingerprint;
}
function createPluginAutoEnableCacheEntry(params) {
	return {
		discoveryFingerprint: stableFingerprintValue(params.discovery.candidates),
		registryFingerprint: stableFingerprintValue(params.manifestRegistry.plugins),
		ambientEnvTriggers: params.ambientEnvTriggers,
		result: params.result
	};
}
function isPluginAutoEnableCacheEntryFresh(params) {
	return params.entry.discoveryFingerprint === stableFingerprintValue(params.discovery.candidates) && params.entry.registryFingerprint === stableFingerprintValue(params.manifestRegistry.plugins) && params.entry.ambientEnvTriggers === params.ambientEnvTriggers;
}
/** Applies already detected plugin auto-enable candidates to config. */
function materializePluginAutoEnableCandidates(params) {
	const env = params.env ?? process.env;
	const config = params.config ?? {};
	const entries = config.plugins?.entries;
	const hasRestrictiveAllowlistWithEntries = Array.isArray(config.plugins?.allow) && config.plugins.allow.length > 0 && entries !== void 0 && typeof entries === "object";
	if (params.candidates.length === 0 && !hasRestrictiveAllowlistWithEntries) return {
		config,
		changes: [],
		autoEnabledReasons: {}
	};
	const manifestRegistry = resolvePluginAutoEnableManifestRegistry({
		config,
		env,
		manifestRegistry: params.manifestRegistry
	});
	return materializePluginAutoEnableCandidatesInternal({
		config,
		candidates: params.candidates,
		env,
		manifestRegistry
	});
}
function applyPluginAutoEnable(params) {
	const config = params.config;
	if (config && typeof config === "object" && params.manifestRegistry && params.discovery) {
		const env = params.env ?? process.env;
		const ambientEnvTriggers = params.ambientEnvTriggers ?? "allow";
		const discoveryCache = getOrCreateWeakMap(getOrCreateWeakMap(getOrCreateWeakMap(sameTurnApplyCache ??= /* @__PURE__ */ new WeakMap(), config, () => /* @__PURE__ */ new WeakMap()), env, () => /* @__PURE__ */ new WeakMap()), params.manifestRegistry, () => /* @__PURE__ */ new WeakMap());
		const cached = discoveryCache.get(params.discovery);
		if (cached && isPluginAutoEnableCacheEntryFresh({
			entry: cached,
			discovery: params.discovery,
			manifestRegistry: params.manifestRegistry,
			ambientEnvTriggers
		})) return cached.result;
		const result = materializePluginAutoEnableCandidates({
			config,
			candidates: detectPluginAutoEnableCandidates(params),
			env: params.env,
			manifestRegistry: params.manifestRegistry
		});
		discoveryCache.set(params.discovery, createPluginAutoEnableCacheEntry({
			discovery: params.discovery,
			manifestRegistry: params.manifestRegistry,
			result,
			ambientEnvTriggers
		}));
		scheduleSameTurnApplyCacheClear();
		return result;
	}
	const candidates = detectPluginAutoEnableCandidates(params);
	return materializePluginAutoEnableCandidates({
		config: params.config,
		candidates,
		env: params.env,
		manifestRegistry: params.manifestRegistry
	});
}
//#endregion
export { configMayNeedPluginAutoEnable as i, materializePluginAutoEnableCandidates as n, detectPluginAutoEnableCandidates as r, applyPluginAutoEnable as t };
