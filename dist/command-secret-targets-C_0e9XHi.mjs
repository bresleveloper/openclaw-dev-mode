import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as normalizeSortedUniqueTrimmedStringList, v as sortUniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { i as parseConcreteConfigPathTokens } from "./dot-path-CVD5Jolm.mjs";
import { g as resolveSecretInputRef } from "./types.secrets-Dgbd2kyP.mjs";
import { c as getConfigResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import "./session-key-CSDERtm3.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DDDhACod.mjs";
import { r as matchPathTokens, t as compileTargetRegistryEntry } from "./target-registry-pattern-0uo8DuOR.mjs";
import { f as loadChannelSecretContractApi, r as discoverConfigSecretTargetsByIds, s as listSecretTargetRegistryEntries } from "./target-registry-query-DOYceNvb.mjs";
import "./target-registry-CSb4wosA.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-CYrCYT-h.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-BTHRPuD9.mjs";
import { n as sortPluginEntriesForAutoDetect } from "./plugin-entry-order-DxrT0ucv.mjs";
import { t as resolvePluginWebFetchProviders } from "./web-fetch-providers.runtime.js";
import { t as resolvePluginWebSearchProviders } from "./web-search-providers.runtime.js";
import { isDeepStrictEqual } from "node:util";
//#region src/cli/command-secret-targets.ts
const STATIC_QR_REMOTE_TARGET_IDS = ["gateway.remote.token", "gateway.remote.password"];
const STATIC_MODEL_TARGET_IDS = [
	"models.providers.*.apiKey",
	"models.providers.*.headers.*",
	"models.providers.*.request.headers.*",
	"models.providers.*.request.auth.token",
	"models.providers.*.request.auth.value",
	"models.providers.*.request.proxy.tls.ca",
	"models.providers.*.request.proxy.tls.cert",
	"models.providers.*.request.proxy.tls.key",
	"models.providers.*.request.proxy.tls.passphrase",
	"models.providers.*.request.tls.ca",
	"models.providers.*.request.tls.cert",
	"models.providers.*.request.tls.key",
	"models.providers.*.request.tls.passphrase"
];
const STATIC_TTS_TARGET_IDS = [
	...STATIC_MODEL_TARGET_IDS,
	"agents.entries.*.tts.providers.*.apiKey",
	"agents.entries.*.tts.personas.*.providers.*.apiKey",
	"tts.providers.*.apiKey",
	"tts.personas.*.providers.*.apiKey"
];
const STATIC_MEMORY_TARGET_IDS = [
	"memory.search.remote.apiKey",
	"memory.search.remote.headers.*",
	"agents.entries.*.memory.search.remote.apiKey",
	"agents.entries.*.memory.search.remote.headers.*"
];
const STATIC_AGENT_RUNTIME_BASE_TARGET_IDS = [
	...STATIC_TTS_TARGET_IDS,
	...STATIC_MEMORY_TARGET_IDS,
	"skills.entries.*.apiKey"
];
const STATIC_MEMORY_EMBEDDING_TARGET_IDS = [...STATIC_MODEL_TARGET_IDS, ...STATIC_MEMORY_TARGET_IDS];
const STATIC_GATEWAY_AUTH_TARGET_IDS = [
	"gateway.auth.token",
	"gateway.auth.password",
	"gateway.remote.token",
	"gateway.remote.password"
];
const STATIC_STATUS_TARGET_IDS = [...STATIC_GATEWAY_AUTH_TARGET_IDS, ...STATIC_MEMORY_TARGET_IDS];
let cachedAgentRuntimeBaseTargetIds;
const cachedCapabilityWebTargetIds = {};
let cachedChannelSecretTargetIds;
function getChannelSecretTargetIds() {
	return cachedChannelSecretTargetIds ??= listSecretTargetRegistryEntries().map((entry) => entry.id).filter((id) => id.startsWith("channels.")).toSorted();
}
function pluginWebCredentialConfigPath(entry) {
	const segments = entry.pathPatternSegments;
	if (segments?.[0] === "plugins" && segments[1] === "entries" && segments[3] === "config") return segments.slice(4).join(".");
	for (const configPath of ["webSearch.apiKey", "webFetch.apiKey"]) if (entry.id.startsWith("plugins.entries.") && entry.id.endsWith(`.config.${configPath}`)) return configPath;
}
function getCapabilityWebTargetIds(kind) {
	return cachedCapabilityWebTargetIds[kind] ??= sortUniqueStrings(listSecretTargetRegistryEntries().filter((entry) => pluginWebCredentialConfigPath(entry) === (kind === "search" ? "webSearch.apiKey" : "webFetch.apiKey")).map((entry) => entry.id));
}
function isConfiguredSecretCandidate(value) {
	if (typeof value === "string") return value.trim().length > 0;
	return value !== void 0 && value !== null;
}
function resolveWebProviders(config, kind) {
	return kind === "search" ? resolvePluginWebSearchProviders({ config }) : resolvePluginWebFetchProviders({ config });
}
function targetIdsForConfigPath(path) {
	const pathSegments = parseConcreteConfigPathTokens(path);
	return listSecretTargetRegistryEntries({ configPath: pathSegments }).filter((entry) => matchPathTokens(pathSegments, compileTargetRegistryEntry(entry).pathTokens)).map((entry) => entry.id).toSorted();
}
function addConfigPathTargets(params) {
	const targetIds = targetIdsForConfigPath(params.path);
	if (targetIds.length === 0) return false;
	for (const targetId of targetIds) {
		params.targetIds.add(targetId);
		if (targetId !== params.path) params.allowedPaths.add(params.path);
	}
	params.targetPaths.add(params.path);
	return true;
}
function modelProviderCredentialFallbackPathForWebSearchProvider(providerId) {
	switch (providerId) {
		case "gemini": return "models.providers.google.apiKey";
		case "ollama": return "models.providers.ollama.apiKey";
		default: return;
	}
}
function discoverConfiguredTargetPaths(config, targetIds, allowedPaths) {
	const forcedActivePaths = /* @__PURE__ */ new Set();
	for (const target of discoverConfigSecretTargetsByIds(config, targetIds)) {
		if (allowedPaths && !allowedPaths.has(target.path)) continue;
		forcedActivePaths.add(target.path);
	}
	return forcedActivePaths.size > 0 ? forcedActivePaths : void 0;
}
function addFallbackPathTargets(params) {
	const before = new Set(params.targetIds);
	const added = addConfigPathTargets(params);
	for (const targetId of params.targetIds) if (!before.has(targetId)) params.fallbackTargetIds.add(targetId);
	if (added) params.fallbackPaths.add(params.path);
}
function getCapabilityWebSelectedProviderTargetIds(config, kind, selectedProviderId) {
	const state = {
		targetIds: /* @__PURE__ */ new Set(),
		targetPaths: /* @__PURE__ */ new Set(),
		allowedPaths: /* @__PURE__ */ new Set(),
		fallbackTargetIds: /* @__PURE__ */ new Set(),
		fallbackPaths: /* @__PURE__ */ new Set()
	};
	const providerDiscoveryConfig = structuredClone(config);
	const web = (providerDiscoveryConfig.tools ??= {}).web ??= {};
	web[kind] = {
		...asOptionalRecord(web[kind]),
		provider: selectedProviderId
	};
	const providers = resolveWebProviders(providerDiscoveryConfig, kind).filter((provider) => provider.id === selectedProviderId);
	for (const provider of providers) {
		if (provider.credentialPath.trim()) addConfigPathTargets({
			...state,
			path: provider.credentialPath
		});
		if (isConfiguredSecretCandidate(provider.getConfiguredCredentialValue?.(config))) continue;
		const fallbackPath = provider.getConfiguredCredentialFallback?.(config)?.path?.trim();
		if (fallbackPath) addFallbackPathTargets({
			...state,
			path: fallbackPath
		});
		const modelFallbackPath = kind === "search" ? modelProviderCredentialFallbackPathForWebSearchProvider(selectedProviderId) : void 0;
		if (modelFallbackPath && !state.fallbackPaths.has(modelFallbackPath) && discoverConfiguredTargetPaths(config, new Set(targetIdsForConfigPath(modelFallbackPath)))?.has(modelFallbackPath)) addFallbackPathTargets({
			...state,
			path: modelFallbackPath
		});
	}
	return {
		...state,
		matchedProvider: providers.length > 0
	};
}
function getCapabilityWebAutoDetectTargets(config, kind) {
	const baseTargetIds = new Set(getCapabilityWebTargetIds(kind));
	const targetIds = new Set(baseTargetIds);
	const fallbackTargetIds = /* @__PURE__ */ new Set();
	const fallbackPaths = /* @__PURE__ */ new Set();
	for (const provider of sortPluginEntriesForAutoDetect(resolveWebProviders(config, kind))) {
		if (isConfiguredSecretCandidate(provider.getConfiguredCredentialValue?.(config))) break;
		const fallback = provider.getConfiguredCredentialFallback?.(config);
		const fallbackPath = fallback?.path?.trim();
		if (!fallbackPath || !isConfiguredSecretCandidate(fallback?.value)) continue;
		for (const targetId of targetIdsForConfigPath(fallbackPath)) {
			targetIds.add(targetId);
			fallbackTargetIds.add(targetId);
		}
		fallbackPaths.add(fallbackPath);
		break;
	}
	if (fallbackTargetIds.size === 0) return { targetIds };
	const configuredPaths = discoverConfiguredTargetPaths(config, baseTargetIds);
	const allowedPaths = /* @__PURE__ */ new Set([...configuredPaths ?? [], ...fallbackPaths]);
	const optionalActivePaths = discoverConfiguredTargetPaths(config, fallbackTargetIds, allowedPaths);
	return {
		targetIds,
		allowedPaths,
		...optionalActivePaths ? { optionalActivePaths } : {}
	};
}
function getAgentRuntimeBaseTargetIds() {
	cachedAgentRuntimeBaseTargetIds ??= [...STATIC_AGENT_RUNTIME_BASE_TARGET_IDS, ...listSecretTargetRegistryEntries().filter((entry) => {
		const configPath = pluginWebCredentialConfigPath(entry);
		return configPath === "webSearch.apiKey" || configPath === "webFetch.apiKey";
	}).map((entry) => entry.id).toSorted()];
	return cachedAgentRuntimeBaseTargetIds;
}
function isScopedChannelSecretTargetEntry(params) {
	const channelId = normalizeOptionalString(params.pluginChannelId);
	if (!channelId) return false;
	const allowedPrefix = `channels.${channelId}.`;
	return params.entry.id.startsWith(allowedPrefix) && params.entry.configFile === "openclaw.json" && typeof params.entry.pathPattern === "string" && params.entry.pathPattern.startsWith(allowedPrefix) && (params.entry.refPathPattern === void 0 || params.entry.refPathPattern.startsWith(allowedPrefix));
}
/** Channel secret targets contributed by channels currently present in config/read-only plugins. */
function getConfiguredChannelsCommandSecretTargetIds(config, env = process.env) {
	const targetIds = /* @__PURE__ */ new Set();
	const channels = config.channels;
	if (channels && typeof channels === "object" && !Array.isArray(channels)) for (const channelId of Object.keys(channels)) {
		if (channelId === "defaults") continue;
		const contract = loadChannelSecretContractApi({
			channelId,
			config,
			env
		});
		for (const entry of contract?.secretTargetRegistryEntries ?? []) if (isScopedChannelSecretTargetEntry({
			entry,
			pluginChannelId: channelId
		})) targetIds.add(entry.id);
	}
	for (const plugin of listReadOnlyChannelPluginsForConfig(config, {
		env,
		includePersistedAuthState: false
	})) for (const entry of plugin.secrets?.secretTargetRegistryEntries ?? []) if (isScopedChannelSecretTargetEntry({
		entry,
		pluginChannelId: plugin.id
	})) targetIds.add(entry.id);
	return new Set([...targetIds].toSorted((left, right) => left.localeCompare(right)));
}
function selectChannelTargetIds(channel) {
	const channelTargetIds = getChannelSecretTargetIds();
	if (!channel) return new Set(channelTargetIds);
	return new Set(channelTargetIds.filter((id) => id.startsWith(`channels.${channel}.`)));
}
function pathTargetsScopedChannelAccount(params) {
	const [root, channelId, accountRoot, accountId] = params.pathSegments;
	if (root !== "channels" || channelId !== params.channel) return false;
	if (accountRoot !== "accounts") return true;
	return normalizeOptionalAccountId(accountId) === params.accountId;
}
/** Return channel secret targets, optionally narrowed to one channel account subtree. */
function getScopedChannelsCommandSecretTargets(params) {
	const channel = normalizeOptionalString(params.channel);
	const channels = params.channels === void 0 ? void 0 : normalizeSortedUniqueTrimmedStringList(params.channels);
	const targetIds = channels === void 0 ? selectChannelTargetIds(channel) : new Set(channels.flatMap((candidate) => [...selectChannelTargetIds(candidate)]));
	const explicitAccountId = normalizeOptionalAccountId(params.accountId);
	const channelPlugin = channel && !explicitAccountId && params.defaultAccountWhenMissing ? listReadOnlyChannelPluginsForConfig(params.config, { includePersistedAuthState: false }).find((plugin) => plugin.id === channel) : void 0;
	const normalizedAccountId = explicitAccountId ?? (channelPlugin ? normalizeOptionalAccountId(resolveChannelDefaultAccountId({
		plugin: channelPlugin,
		cfg: params.config
	})) : void 0);
	const scopedChannels = channels ?? (channel ? [channel] : []);
	if (scopedChannels.length === 0 || !normalizedAccountId) return { targetIds };
	const allowedPaths = /* @__PURE__ */ new Set();
	for (const target of discoverConfigSecretTargetsByIds(params.config, targetIds)) if (scopedChannels.some((scopedChannel) => pathTargetsScopedChannelAccount({
		pathSegments: target.pathSegments,
		channel: scopedChannel,
		accountId: normalizedAccountId
	}))) allowedPaths.add(target.path);
	return {
		targetIds,
		allowedPaths
	};
}
/** Secret targets needed by QR remote pairing flows. */
function getQrRemoteCommandSecretTargetIds() {
	return new Set(STATIC_QR_REMOTE_TARGET_IDS);
}
/** All registered channel secret targets, regardless of current config. */
function getChannelsCommandSecretTargetIds() {
	return new Set(getChannelSecretTargetIds());
}
/** Model-provider credential targets used by commands that can touch provider config. */
function getModelsCommandSecretTargetIds() {
	return new Set(STATIC_MODEL_TARGET_IDS);
}
function getSelectedMemoryProviderSecretTargetIds(config) {
	return discoverConfigSecretTargetsByIds(config).filter(({ pathSegments }) => pathSegments[0] === "plugins" && pathSegments[2] === config.plugins?.slots?.memory).map(({ entry }) => entry.id);
}
/** Credential targets required by memory embeddings and the selected memory plugin. */
function getMemoryEmbeddingCommandSecretTargetIds(config) {
	return /* @__PURE__ */ new Set([...STATIC_MEMORY_EMBEDDING_TARGET_IDS, ...config?.plugins?.slots?.memory ? getSelectedMemoryProviderSecretTargetIds(config) : []]);
}
/** Credential targets required by text-to-speech flows. */
function getTtsCommandSecretTargetIds() {
	return new Set(STATIC_TTS_TARGET_IDS);
}
/** Agent startup targets not already owned by its prepared secrets snapshot. */
function getAgentRuntimeCommandSecretTargetIds(params) {
	const snapshot = getActiveSecretsRuntimeConfigSnapshot();
	if (snapshot?.configRefsPrepared && (params.config === snapshot.config || getConfigResolutionFacts(params.config) === getConfigResolutionFacts(snapshot.config) && isDeepStrictEqual(params.config, snapshot.config))) return params.includeChannelTargets ? getChannelsCommandSecretTargetIds() : /* @__PURE__ */ new Set();
	if (params.includeChannelTargets !== true) return new Set(getAgentRuntimeBaseTargetIds());
	return /* @__PURE__ */ new Set([...getAgentRuntimeBaseTargetIds(), ...getChannelSecretTargetIds()]);
}
/**
* Web credentials are needed only if the model invokes the corresponding tool.
* Keep them materializable for agent runs without making tool-owner outages block turn startup.
*/
function getAgentRuntimeOptionalCommandSecretPaths(config) {
	const targetIds = /* @__PURE__ */ new Set([...getCapabilityWebTargetIds("search"), ...getCapabilityWebTargetIds("fetch")]);
	const defaults = config.secrets?.defaults;
	return new Set(discoverConfigSecretTargetsByIds(config, targetIds).filter((target) => Boolean(resolveSecretInputRef({
		value: target.value,
		refValue: target.refValue,
		defaults
	}).ref)).map((target) => target.path));
}
function getCapabilityWebCommandSecretTargets(config, kind, providerId) {
	const web = asOptionalRecord(config.tools?.web?.[kind]);
	if (web?.enabled === false) return { targetIds: new Set(getCapabilityWebTargetIds(kind)) };
	const selectedProviderId = normalizeOptionalLowercaseString(providerId) ?? normalizeOptionalLowercaseString(web?.provider);
	if (!selectedProviderId) return getCapabilityWebAutoDetectTargets(config, kind);
	const selectedTargets = getCapabilityWebSelectedProviderTargetIds(config, kind, selectedProviderId);
	if (!selectedTargets.matchedProvider && !providerId) return getCapabilityWebAutoDetectTargets(config, kind);
	const targetIds = new Set([...selectedTargets.targetIds].toSorted());
	const allowedPaths = selectedTargets.allowedPaths.size > 0 ? new Set([...selectedTargets.targetPaths].toSorted()) : void 0;
	const forcedActivePaths = discoverConfiguredTargetPaths(config, providerId ? targetIds : new Set([...selectedTargets.fallbackTargetIds].toSorted()), allowedPaths);
	return {
		targetIds,
		...allowedPaths ? { allowedPaths } : {},
		...forcedActivePaths ? { forcedActivePaths } : {}
	};
}
/** Web-fetch target scope for selected/auto-detected providers and configured fallback paths. */
function getCapabilityWebFetchCommandSecretTargets(config, options) {
	return getCapabilityWebCommandSecretTargets(config, "fetch", options?.providerId);
}
/** Web-search target scope for selected/auto-detected providers and configured fallback paths. */
function getCapabilityWebSearchCommandSecretTargets(config, options) {
	return getCapabilityWebCommandSecretTargets(config, "search", options?.providerId);
}
/** Status command targets; channel targets can be limited to configured channel plugins. */
function getStatusCommandSecretTargetIds(config, env) {
	const channelTargetIds = config ? getConfiguredChannelsCommandSecretTargetIds(config, env) : getChannelSecretTargetIds();
	return /* @__PURE__ */ new Set([...STATIC_STATUS_TARGET_IDS, ...channelTargetIds]);
}
/** Secret targets that the security audit command is allowed to inspect. */
function getSecurityAuditCommandSecretTargetIds() {
	return /* @__PURE__ */ new Set([...STATIC_GATEWAY_AUTH_TARGET_IDS, ...getChannelSecretTargetIds()]);
}
//#endregion
export { getChannelsCommandSecretTargetIds as a, getModelsCommandSecretTargetIds as c, getSecurityAuditCommandSecretTargetIds as d, getStatusCommandSecretTargetIds as f, getCapabilityWebSearchCommandSecretTargets as i, getQrRemoteCommandSecretTargetIds as l, getAgentRuntimeOptionalCommandSecretPaths as n, getConfiguredChannelsCommandSecretTargetIds as o, getTtsCommandSecretTargetIds as p, getCapabilityWebFetchCommandSecretTargets as r, getMemoryEmbeddingCommandSecretTargetIds as s, getAgentRuntimeCommandSecretTargetIds as t, getScopedChannelsCommandSecretTargets as u };
