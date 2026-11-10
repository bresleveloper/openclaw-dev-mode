import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { k as withPluginCache, p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as listMappedModelThinkingLevels } from "./model-catalog-types-VH0V5RHR.mjs";
import { n as indexFirstByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { r as resolveProviderPolicySurface } from "./provider-public-artifacts-C49Gg9BA.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { t as PREPARED_THINKING_POLICY } from "./provider-thinking-catalog-Bv_TFmaq.mjs";
import { i as THINKING_LEVEL_RANKS, l as normalizeThinkLevel, n as BASE_THINKING_LEVELS } from "./thinking.shared-Be8dhC75.mjs";
import { n as resolveClaudeThinkingProfile } from "./provider-claude-thinking-dulvRIeQ.mjs";
import { r as matchesProviderPluginRef } from "./provider-registry-shared-Cov0065J.mjs";
//#region src/plugins/provider-thinking-active.ts
function resolveActiveProviderThinkingProfile(params, registry) {
	const state = globalThis[PLUGIN_REGISTRY_STATE];
	return (registry ?? state?.activeRegistry)?.providers?.find((entry) => matchesProviderPluginRef(entry.provider, params.provider))?.provider?.resolveThinkingProfile?.(params.context);
}
//#endregion
//#region src/plugins/provider-thinking.ts
/** Capture policy before publication; row projections cannot activate a lazy provider. */
function prepareModelCatalogThinkingPolicies(params) {
	const policies = /* @__PURE__ */ new Map();
	withPluginCache(getPluginMetadataSnapshotCache(params.metadataSnapshot), () => {
		const ownedEntries = /* @__PURE__ */ new Map();
		const capture = (entry) => {
			const existing = ownedEntries.get(entry);
			if (existing) return existing;
			const provider = normalizeProviderId(entry.thinkingPolicyProvider ?? entry.provider);
			if (!policies.has(provider)) {
				const resolve = (params.pluginRegistry?.providers.find(({ provider: candidate }) => matchesProviderPluginRef(candidate, provider))?.provider)?.resolveThinkingProfile ?? resolveProviderPolicySurface(provider, { manifestRegistry: params.metadataSnapshot.manifestRegistry })?.resolveThinkingProfile;
				policies.set(provider, resolve ? { resolve } : null);
			}
			const owned = {
				...entry,
				[PREPARED_THINKING_POLICY]: policies.get(provider) ?? null
			};
			ownedEntries.set(entry, owned);
			return owned;
		};
		params.catalog.entries = params.catalog.entries.map(capture);
		params.catalog.routeVariants = params.catalog.routeVariants.map(capture);
		if (params.catalog.staticEntries) params.catalog.staticEntries = params.catalog.staticEntries.map(capture);
	});
}
function resolveProviderPublicPolicySurface(providerId) {
	const metadataSnapshot = getCurrentPluginMetadataSnapshot({
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true
	});
	return resolveProviderPolicySurface(providerId, { manifestRegistry: metadataSnapshot?.manifestRegistry });
}
/** Resolves a provider thinking profile from active plugins or bundled policy surface. */
function resolveEffectiveThinkingProfile(params, options) {
	const preparedPolicy = params.catalogEntry?.[PREPARED_THINKING_POLICY];
	if (preparedPolicy !== void 0) return preparedPolicy?.resolve(params.context);
	const activeProfile = resolveActiveProviderThinkingProfile(params, options?.registry);
	if (activeProfile !== void 0) return activeProfile;
	if (options?.registry || options?.allowPublicArtifactFallback === false) return;
	return resolveProviderPublicPolicySurface(params.provider)?.resolveThinkingProfile?.(params.context);
}
//#endregion
//#region src/auto-reply/thinking.ts
function buildCatalogModelKey(provider, model, legacy = false) {
	const providerId = normalizeProviderId(provider);
	const modelId = model.trim();
	return JSON.stringify([providerId, legacy ? modelKey(providerId, modelId) : modelId]);
}
function resolveThinkingCatalogKeys(params) {
	const providerRaw = normalizeOptionalString(params.provider);
	const normalizedProvider = providerRaw ? normalizeProviderId(providerRaw) : "";
	const modelId = normalizeOptionalString(params.model) ?? "";
	return normalizedProvider && modelId ? {
		literal: buildCatalogModelKey(normalizedProvider, modelId),
		legacy: buildCatalogModelKey(normalizedProvider, modelId, true)
	} : void 0;
}
/** Indexes one prepared catalog while retaining its first matching row and policy owner. */
function createThinkingCatalogResolver(catalog) {
	const byKey = indexFirstByKey(catalog, (entry) => buildCatalogModelKey(entry.provider, entry.id));
	const byLegacyKey = indexFirstByKey(catalog, (entry) => buildCatalogModelKey(entry.provider, entry.id, true));
	return (params) => {
		const keys = resolveThinkingCatalogKeys(params);
		return keys === void 0 ? void 0 : byKey.get(keys.literal) ?? byLegacyKey.get(keys.legacy);
	};
}
function resolveThinkingCatalogEntry(params) {
	if (params.catalogResolver) return params.catalogResolver(params);
	const keys = resolveThinkingCatalogKeys(params);
	if (keys === void 0) return;
	return params.catalog?.find((entry) => buildCatalogModelKey(entry.provider, entry.id) === keys.literal) ?? params.catalog?.find((entry) => buildCatalogModelKey(entry.provider, entry.id, true) === keys.legacy);
}
function normalizeThinkingProfile(profile, thinkingLevelMap, mappedLevels = []) {
	const byId = /* @__PURE__ */ new Map();
	for (const raw of profile.levels) {
		const id = normalizeThinkLevel(raw.id);
		if (!id) continue;
		const level = {
			id,
			label: normalizeOptionalString(raw.label) ?? id,
			rank: Number.isFinite(raw.rank) ? raw.rank : THINKING_LEVEL_RANKS[id]
		};
		if (id === "adaptive" || id === "ultra" || thinkingLevelMap?.[id] !== null) byId.set(id, level);
	}
	const levels = [...byId.values()].toSorted((a, b) => a.rank - b.rank);
	const rawDefaultLevel = profile.defaultLevel ? normalizeThinkLevel(profile.defaultLevel) : void 0;
	const normalized = {
		levels,
		defaultLevel: rawDefaultLevel && byId.has(rawDefaultLevel) ? rawDefaultLevel : void 0
	};
	if (profile.levels.length > 0) {
		for (const level of mappedLevels) if (thinkingLevelMap?.[level] !== null) appendProfileLevel(normalized, level);
	}
	return normalized;
}
function buildBaseThinkingProfile() {
	return {
		levels: BASE_THINKING_LEVELS.map((id) => ({
			id,
			label: id,
			rank: THINKING_LEVEL_RANKS[id]
		})),
		defaultLevel: void 0
	};
}
function appendProfileLevel(profile, id) {
	if (profile.levels.some((level) => level.id === id)) return;
	profile.levels.push({
		id,
		label: id,
		rank: THINKING_LEVEL_RANKS[id]
	});
	profile.levels = profile.levels.toSorted((a, b) => a.rank - b.rank);
}
function appendCatalogAdvancedThinkingLevels(profile, compat, thinkingLevelMap) {
	if (thinkingLevelMap) {
		for (const level of ["xhigh", "max"]) if (thinkingLevelMap[level] !== void 0 && thinkingLevelMap[level] !== null) appendProfileLevel(profile, level);
	}
	for (const level of compat?.supportedReasoningEfforts ?? []) if (level === "ultra" || (level === "adaptive" || level === "xhigh" || level === "max") && (level === "adaptive" || thinkingLevelMap?.[level] !== null)) appendProfileLevel(profile, level);
}
/** Resolve only provider-owned effort choices, before adding harness modes. */
function resolveModelThinkingProfile(params) {
	const providerRaw = normalizeOptionalString(params.provider);
	const candidate = resolveThinkingCatalogEntry(params);
	const provider = providerRaw ? normalizeProviderId(normalizeOptionalString(candidate?.thinkingPolicyProvider) ?? providerRaw) : "";
	if (!provider) return buildBaseThinkingProfile();
	const context = {
		provider,
		modelId: normalizeOptionalString(params.model) ?? "",
		agentRuntime: params.agentRuntime,
		api: candidate?.api,
		baseUrl: candidate?.baseUrl,
		reasoning: params.configuredReasoning ?? candidate?.configuredReasoning ?? candidate?.reasoning,
		thinkingLevelMap: candidate?.thinkingLevelMap,
		...candidate?.params ? { params: candidate.params } : {},
		compat: candidate?.compat
	};
	const rowDefaultLevel = context.compat?.defaultThinkingLevel ? normalizeThinkLevel(context.compat.defaultThinkingLevel) : void 0;
	const providerProfileParams = {
		provider,
		context,
		...candidate ? { catalogEntry: candidate } : {}
	};
	const providerProfile = rowDefaultLevel ? void 0 : typeof params.providerPolicySource === "object" ? resolveEffectiveThinkingProfile(providerProfileParams, { registry: params.providerPolicySource }) : params.providerPolicySource === "active" ? resolveEffectiveThinkingProfile(providerProfileParams, { allowPublicArtifactFallback: false }) : resolveEffectiveThinkingProfile(providerProfileParams);
	const anthropicMessagesProfile = !rowDefaultLevel && context.api === "anthropic-messages" ? resolveClaudeThinkingProfile(context.modelId, context.params, { includeNativeMax: true }) : void 0;
	const pluginProfile = providerProfile ?? anthropicMessagesProfile;
	const runtime = normalizeOptionalLowercaseString(params.agentRuntime);
	const mappedLevels = !runtime || runtime === "auto" || runtime === "openclaw" ? listMappedModelThinkingLevels(context).filter((level) => level === "xhigh" || level === "max") : [];
	if (pluginProfile && (context.reasoning !== false || pluginProfile.preserveWhenCatalogReasoningFalse === true)) return normalizeThinkingProfile(pluginProfile, context.thinkingLevelMap, mappedLevels);
	if (context.reasoning === false) return {
		levels: [{
			id: "off",
			label: "off",
			rank: THINKING_LEVEL_RANKS.off
		}],
		defaultLevel: "off"
	};
	const profile = buildBaseThinkingProfile();
	appendCatalogAdvancedThinkingLevels(profile, context.compat, context.thinkingLevelMap);
	profile.defaultLevel = rowDefaultLevel;
	return normalizeThinkingProfile(profile, context.thinkingLevelMap, mappedLevels);
}
/** Ultra is a harness mode, independent of a model's native reasoning controls. */
function resolveThinkingProfile(params) {
	const profile = resolveModelThinkingProfile(params);
	const runtime = normalizeOptionalLowercaseString(params.agentRuntime);
	const hostUltra = runtime === "openclaw" || runtime === "auto" || runtime === "claude-cli";
	const nativeUltra = runtime === "codex" && profile.levels.some(({ id }) => id !== "off" && id !== "ultra");
	if (hostUltra || nativeUltra) appendProfileLevel(profile, "ultra");
	return profile;
}
/** Lower harness-only Ultra at a provider boundary without inventing native effort support. */
function resolveProviderThinkingLevel(params) {
	if (params.level !== "ultra") return params.level;
	const catalog = params.catalog?.map(({ compat, ...entry }) => ({
		...entry,
		compat: compat && ("thinkingFormat" in compat || "supportsReasoningEffort" in compat || "supportedReasoningEfforts" in compat || "reasoningEffortMap" in compat) ? compat : void 0
	}));
	return resolveModelThinkingProfile({
		...params,
		catalog
	}).levels.filter((entry) => entry.id !== "ultra").toSorted((a, b) => b.rank - a.rank)[0]?.id;
}
/** List thinking level ids supported by provider/model. */
function listThinkingLevels(provider, model, catalog, agentRuntime) {
	return resolveThinkingProfile({
		provider,
		model,
		catalog,
		agentRuntime
	}).levels.map((level) => level.id);
}
/** List labeled thinking level options supported by provider/model. */
function listThinkingLevelOptions(provider, model, catalog, agentRuntime) {
	return resolveThinkingProfile({
		provider,
		model,
		catalog,
		agentRuntime
	}).levels.map(({ id, label }) => ({
		id,
		label
	}));
}
/** List display labels for thinking levels supported by provider/model. */
function listThinkingLevelLabels(provider, model, catalog, agentRuntime) {
	return resolveThinkingProfile({
		provider,
		model,
		catalog,
		agentRuntime
	}).levels.map(({ label }) => label);
}
/** Format supported thinking level labels for command/status output. */
function formatThinkingLevels(provider, model, separator = ", ", catalog, agentRuntime) {
	return listThinkingLevelLabels(provider, model, catalog, agentRuntime).join(separator);
}
/** Resolve the default thinking level for a provider/model pair. */
function resolveThinkingDefaultForModel(params) {
	return resolveThinkingSelectionForModel(params).requestedLevel;
}
/** Resolve intent, support, and execution level from one selected model profile. */
function resolveThinkingSelectionForModel(params) {
	const candidate = resolveThinkingCatalogEntry(params);
	const profile = resolveThinkingProfile({
		...params,
		catalogResolver: () => candidate
	});
	const requestedLevel = params.level ?? profile.defaultLevel ?? (candidate?.reasoning ? resolveSupportedThinkingLevelFromProfile(profile, "medium") : "off");
	return {
		requestedLevel,
		level: resolveSupportedThinkingLevelFromProfile(profile, requestedLevel),
		supported: profile.levels.some((entry) => entry.id === requestedLevel)
	};
}
/** Return whether a specific thinking level is supported by provider/model. */
function isThinkingLevelSupported(params) {
	return resolveThinkingSelectionForModel(params).supported;
}
function resolveSupportedThinkingLevelFromProfile(profile, level) {
	if (profile.levels.some((entry) => entry.id === level)) return level;
	if (level === "adaptive" && profile.defaultLevel && profile.defaultLevel !== "off") return profile.defaultLevel;
	const requestedRank = THINKING_LEVEL_RANKS[level];
	const ranked = profile.levels.filter((entry) => entry.id !== "ultra").toSorted((a, b) => b.rank - a.rank);
	return ranked.find((entry) => entry.id !== "off" && entry.rank <= requestedRank)?.id ?? ranked.findLast((entry) => entry.id !== "off")?.id ?? "off";
}
/** Clamp a requested thinking level to the closest supported provider/model level. */
function resolveSupportedThinkingLevel(params) {
	return resolveThinkingSelectionForModel(params).level;
}
//#endregion
export { listThinkingLevelOptions as a, resolveSupportedThinkingLevel as c, resolveThinkingProfile as d, resolveThinkingSelectionForModel as f, listThinkingLevelLabels as i, resolveSupportedThinkingLevelFromProfile as l, resolveActiveProviderThinkingProfile as m, formatThinkingLevels as n, listThinkingLevels as o, prepareModelCatalogThinkingPolicies as p, isThinkingLevelSupported as r, resolveProviderThinkingLevel as s, createThinkingCatalogResolver as t, resolveThinkingDefaultForModel as u };
