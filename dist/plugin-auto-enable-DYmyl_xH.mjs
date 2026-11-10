import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { P as collectConfiguredModelRefs } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-C2eV0eNq.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { y as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { o as resolveConfiguredTalkRealtimeProviderId } from "./talk-Brycd9Kq.mjs";
import { i as resolveConfiguredChannelAutoEnableCandidates, n as materializePluginAutoEnableCandidatesInternal, r as collectAutoEnableChannelIds, t as hasMaterialPluginEntryConfig } from "./plugin-auto-enable.materialize-CksyHPxI.mjs";
import { i as isNativeSessionCatalogOptOutOnly } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { t as resolvePluginSetupAutoEnableReasons } from "./setup-registry-CGxNMBUk.mjs";
import { t as getConfiguredDecisionProviderIds } from "./decision-model-setting-CqwqM5vF.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-C-QBCzx4.mjs";
import { t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-GphgdX8d.mjs";
import { n as listBundledStorageProviderOwners, t as collectConfiguredStorageProviderIds } from "./storage-provider-manifest-D3Hhc9Ut.mjs";
import { t as collectConfiguredWorkerProviderIds } from "./worker-provider-config-BI49IDBE.mjs";
import { t as listBundledWorkerProviderOwners } from "./worker-provider-manifest-muUGU3iQ.mjs";
import { l as resolveOwningPluginIdsForModelRef } from "./providers-3h1HIigh.mjs";
import { t as isKernelOwnedChannelConfigKey } from "./channel-config-keys-BnrRghOb.mjs";
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
function isProviderConfigured(cfg, providerId) {
	const normalized = normalizeProviderId(providerId);
	const profiles = cfg.auth?.profiles;
	if (profiles && typeof profiles === "object" && Object.values(profiles).some((profile) => isRecord(profile) && normalizeProviderId(profile.provider ?? "") === normalized)) return true;
	const providerConfig = cfg.models?.providers;
	if (providerConfig && typeof providerConfig === "object" && Object.keys(providerConfig).some((key) => normalizeProviderId(key) === normalized)) return true;
	return collectConfiguredModelRefs(cfg, { includeChannelModelOverrides: false }).some(({ value: ref }) => {
		const trimmed = ref.trim();
		const slash = trimmed.indexOf("/");
		const provider = slash > 0 ? normalizeProviderId(trimmed.slice(0, slash)) : null;
		return Boolean(provider) && provider === normalized;
	});
}
function hasPluginOwnedToolConfig(cfg, plugin) {
	const entry = cfg.plugins?.entries?.[plugin.id];
	const pluginConfig = entry?.config;
	if (isNativeSessionCatalogOptOutOnly(plugin.id, entry) || !isRecord(pluginConfig)) return false;
	const properties = isRecord(plugin.configSchema) ? plugin.configSchema.properties : void 0;
	return isRecord(properties) && Object.keys(properties).some((key) => key !== "webSearch" && key !== "webFetch" && pluginConfig[key] !== void 0);
}
function resolvePluginIdForConfiguredWebProvider(providerId, registry, contract) {
	const normalizedProviderId = normalizeOptionalLowercaseString(providerId);
	if (!normalizedProviderId) return;
	return registry.plugins.find((plugin) => (contract !== "webFetchProviders" || plugin.origin === "bundled") && (plugin.contracts?.[contract] ?? []).some((candidate) => normalizeOptionalLowercaseString(candidate) === normalizedProviderId))?.id;
}
function hasConfiguredPluginConfigEntry(cfg) {
	return Object.values(asOptionalObjectRecord(cfg.plugins?.entries) ?? {}).some((entry) => isRecord(entry) && isRecord(entry.config));
}
function listContainsNormalized(value, expected) {
	return Array.isArray(value) && value.some((entry) => normalizeOptionalLowercaseString(entry) === expected);
}
function toolPolicyReferencesBrowser(value) {
	return isRecord(value) && (listContainsNormalized(value.allow, "browser") || listContainsNormalized(value.alsoAllow, "browser"));
}
function hasBrowserSetupAutoEnableRelevantConfig(cfg) {
	if (cfg.browser?.enabled === false || cfg.plugins?.entries?.browser?.enabled === false) return false;
	const entries = asOptionalObjectRecord(cfg.plugins?.entries);
	return isRecord(cfg.browser) || entries !== void 0 && Object.hasOwn(entries, "browser") || toolPolicyReferencesBrowser(cfg.tools) || listAgentEntries(cfg).some((entry) => toolPolicyReferencesBrowser(entry.tools));
}
function hasAcpxSetupAutoEnableRelevantConfig(cfg) {
	if (cfg.plugins?.entries?.acpx?.enabled === false || !isRecord(cfg.acp)) return false;
	const backend = normalizeOptionalLowercaseString(cfg.acp.backend);
	return (cfg.acp.enabled === true || isRecord(cfg.acp.dispatch) && cfg.acp.dispatch.enabled === true || backend === "acpx") && (!backend || backend === "acpx");
}
function hasXaiSetupAutoEnableRelevantConfig(cfg) {
	if (cfg.plugins?.entries?.xai?.enabled === false) return false;
	const pluginConfig = cfg.plugins?.entries?.xai?.config;
	return isRecord(pluginConfig) && (isRecord(pluginConfig.xSearch) || isRecord(pluginConfig.codeExecution));
}
function resolveRelevantSetupAutoEnablePluginIds(cfg) {
	const pluginIds = new Set(Object.keys(asOptionalObjectRecord(cfg.plugins?.entries) ?? {}).map((pluginId) => pluginId.trim()).filter((pluginId) => pluginId && cfg.plugins?.entries?.[pluginId]?.enabled !== false));
	if (hasBrowserSetupAutoEnableRelevantConfig(cfg)) pluginIds.add("browser");
	if (hasAcpxSetupAutoEnableRelevantConfig(cfg)) pluginIds.add("acpx");
	if (hasXaiSetupAutoEnableRelevantConfig(cfg)) pluginIds.add("xai");
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
function hasSetupAutoEnableRelevantConfig(cfg) {
	return hasBrowserSetupAutoEnableRelevantConfig(cfg) || hasAcpxSetupAutoEnableRelevantConfig(cfg) || hasXaiSetupAutoEnableRelevantConfig(cfg) || hasConfiguredPluginConfigEntry(cfg);
}
function hasPluginAllowlistWithMaterialEntries(cfg) {
	if (!Array.isArray(cfg.plugins?.allow) || cfg.plugins.allow.length === 0) return false;
	const entries = asOptionalObjectRecord(cfg.plugins?.entries);
	return entries !== void 0 && Object.values(entries).some(hasMaterialPluginEntryConfig);
}
function hasConfiguredPluginProviders(cfg) {
	const webSearch = cfg.tools?.web?.search;
	return getConfiguredDecisionProviderIds(cfg).length > 0 || Object.keys(cfg.auth?.profiles ?? {}).length > 0 || Object.keys(cfg.models?.providers ?? {}).length > 0 || collectConfiguredModelRefs(cfg, { includeChannelModelOverrides: false }).length > 0 || collectConfiguredAgentHarnessRuntimes(cfg).length > 0 || collectConfiguredSpeechProviderIds(cfg).size > 0 || Boolean(resolveConfiguredTalkRealtimeProviderId(cfg)) || collectConfiguredWorkerProviderIds(cfg).length > 0 || collectConfiguredStorageProviderIds(cfg).length > 0 || webSearch?.enabled !== false && typeof webSearch?.provider === "string" && Boolean(webSearch.provider.trim());
}
function configMayNeedPluginManifestRegistry(cfg) {
	if (cfg.plugins?.enabled === false) return false;
	if (hasPluginAllowlistWithMaterialEntries(cfg) || hasConfiguredPluginConfigEntry(cfg) || hasConfiguredPluginProviders(cfg)) return true;
	const configuredChannels = cfg.channels;
	if (!configuredChannels || typeof configuredChannels !== "object") return false;
	return Object.keys(configuredChannels).some((key) => !isKernelOwnedChannelConfigKey(key));
}
function configMayNeedPluginAutoEnable(cfg, env) {
	return resolvePluginAutoEnableReadiness(cfg, env).mayNeedAutoEnable;
}
function resolvePluginAutoEnableReadiness(cfg, env, discovery, ambientEnvTriggers) {
	if (cfg.plugins?.enabled === false) return {
		mayNeedAutoEnable: false,
		configuredChannelIds: []
	};
	const configuredChannelIds = collectAutoEnableChannelIds(cfg, env, discovery, ambientEnvTriggers);
	return {
		mayNeedAutoEnable: hasPluginAllowlistWithMaterialEntries(cfg) || hasConfiguredPluginConfigEntry(cfg) || configuredChannelIds.length > 0 || hasConfiguredPluginProviders(cfg) || hasSetupAutoEnableRelevantConfig(cfg) && resolvePluginSetupAutoEnableReasons({
			config: cfg,
			env,
			pluginIds: resolveRelevantSetupAutoEnablePluginIds(cfg)
		}).length > 0,
		configuredChannelIds
	};
}
function resolveConfiguredPluginAutoEnableCandidates(params) {
	const changes = resolveConfiguredChannelAutoEnableCandidates(params);
	const findMatchingPluginIds = (value, selectValues) => {
		const normalized = normalizeOptionalLowercaseString(value);
		return normalized ? params.registry.plugins.filter((plugin) => selectValues(plugin).some((candidate) => normalizeOptionalLowercaseString(candidate) === normalized)).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right)) : [];
	};
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
	for (const providerId of collectConfiguredSpeechProviderIds(params.config)) for (const pluginId of findMatchingPluginIds(providerId, (plugin) => plugin.contracts?.speechProviders ?? [])) changes.push({
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
	for (const { pluginId, providerId } of listBundledStorageProviderOwners(params.registry, collectConfiguredStorageProviderIds(params.config))) changes.push({
		pluginId,
		kind: "storage-provider-selected",
		providerId
	});
	const decisionProviderIds = new Set(getConfiguredDecisionProviderIds(params.config));
	for (const plugin of params.registry.plugins) for (const providerId of plugin.contracts?.decisionProviders ?? []) if (decisionProviderIds.has(providerId)) changes.push({
		pluginId: plugin.id,
		kind: "decision-provider-selected",
		providerId
	});
	for (const runtime of collectConfiguredAgentHarnessRuntimes(params.config)) for (const pluginId of findMatchingPluginIds(runtime, (plugin) => [...plugin.activation?.onAgentHarnesses ?? [], ...plugin.cliBackends ?? []])) changes.push({
		pluginId,
		kind: "agent-harness-runtime-configured",
		runtime
	});
	const webSearchConfig = params.config.tools?.web?.search;
	for (const [contract, kind, provider] of [[
		"webSearchProviders",
		"web-search-provider-selected",
		webSearchConfig?.enabled !== false ? webSearchConfig?.provider : void 0
	], [
		"webFetchProviders",
		"web-fetch-provider-selected",
		params.config.tools?.web?.fetch?.provider
	]]) {
		const providerId = typeof provider === "string" ? provider : void 0;
		const pluginId = resolvePluginIdForConfiguredWebProvider(providerId, params.registry, contract);
		if (pluginId) changes.push({
			pluginId,
			kind,
			providerId: normalizeOptionalLowercaseString(providerId) ?? ""
		});
	}
	for (const [contract, configKey, kind] of [
		[
			"webSearchProviders",
			"webSearch",
			"plugin-web-search-configured"
		],
		[
			"tools",
			null,
			"plugin-tool-configured"
		],
		[
			"webFetchProviders",
			"webFetch",
			"plugin-web-fetch-configured"
		]
	]) for (const plugin of params.registry.plugins) {
		if ((plugin.contracts?.[contract]?.length ?? 0) === 0 || contract === "webSearchProviders" && (plugin.providers?.length ?? 0) === 0) continue;
		const config = params.config.plugins?.entries?.[plugin.id]?.config;
		if (configKey ? isRecord(config) && isRecord(config[configKey]) : hasPluginOwnedToolConfig(params.config, plugin)) changes.push({
			pluginId: plugin.id,
			kind
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
	if (!configMayNeedPluginManifestRegistry(params.config)) return EMPTY_PLUGIN_MANIFEST_REGISTRY;
	let snapshot = getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		allowWorkspaceScopedSnapshot: true
	});
	if (!snapshot && normalizePluginsConfig(params.config.plugins).loadPaths.length === 0) {
		const candidate = getCurrentPluginMetadataSnapshot({
			env: params.env,
			allowWorkspaceScopedSnapshot: true,
			requireDefaultDiscoveryContext: true
		});
		if (candidate?.policyHash === resolveInstalledPluginIndexPolicyHash(params.config)) snapshot = candidate;
	}
	return snapshot?.manifestRegistry ?? loadPluginMetadataSnapshot({
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
registerPluginMetadataProcessMemoLifecycleClear(() => {
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
function getOrCreateWeakMap(parent, key) {
	let child = parent.get(key);
	if (!child) {
		child = /* @__PURE__ */ new WeakMap();
		parent.set(key, child);
	}
	return child;
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
	const ambientEnvTriggers = params.ambientEnvTriggers ?? "allow";
	let discoveryCache;
	if (config && typeof config === "object" && params.manifestRegistry && params.discovery) {
		const env = params.env ?? process.env;
		discoveryCache = getOrCreateWeakMap(getOrCreateWeakMap(getOrCreateWeakMap(sameTurnApplyCache ??= /* @__PURE__ */ new WeakMap(), config), env), params.manifestRegistry);
		const cached = discoveryCache.get(params.discovery);
		if (cached && cached.candidates === params.discovery.candidates && cached.plugins === params.manifestRegistry.plugins && cached.ambientEnvTriggers === ambientEnvTriggers) return cached.result;
	}
	const result = materializePluginAutoEnableCandidates({
		config,
		candidates: detectPluginAutoEnableCandidates(params),
		env: params.env,
		manifestRegistry: params.manifestRegistry
	});
	if (discoveryCache && params.discovery && params.manifestRegistry) {
		discoveryCache.set(params.discovery, {
			candidates: params.discovery.candidates,
			plugins: params.manifestRegistry.plugins,
			ambientEnvTriggers,
			result
		});
		scheduleSameTurnApplyCacheClear();
	}
	return result;
}
//#endregion
export { configMayNeedPluginAutoEnable as i, materializePluginAutoEnableCandidates as n, detectPluginAutoEnableCandidates as r, applyPluginAutoEnable as t };
