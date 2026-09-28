import { D as withPluginCache, d as getPluginMetadataSnapshotCache } from "./plugin-cache-A1nT2dqa.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as listMappedModelThinkingLevels } from "./model-catalog-types-DqmfsVmo.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { r as resolveProviderPolicySurface } from "./provider-public-artifacts-Dm_p9SMS.mjs";
import { r as indexFirstByKey, t as PREPARED_THINKING_POLICY } from "./provider-thinking-catalog-B0d_iUnw.mjs";
import { r as THINKING_LEVEL_RANKS, s as normalizeThinkLevel, t as BASE_THINKING_LEVELS } from "./thinking.shared-BKzBCWpI.mjs";
import { r as matchesProviderPluginRef } from "./provider-registry-shared-CGngP_UC.mjs";
import { n as resolveClaudeThinkingProfile } from "./provider-claude-thinking-E0IsJDi6.mjs";
//#region src/plugins/provider-thinking-active.ts
function resolveActiveThinkingProvider(providerId, registry) {
	const state = globalThis[PLUGIN_REGISTRY_STATE];
	return (registry ?? state?.activeRegistry)?.providers?.find((entry) => matchesProviderPluginRef(entry.provider, providerId))?.provider;
}
function resolveActiveProviderThinkingProfile(params, registry) {
	return resolveActiveThinkingProvider(params.provider, registry)?.resolveThinkingProfile?.(params.context);
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
				const runtimeProvider = params.providers?.find(({ provider: candidate }) => matchesProviderPluginRef(candidate, provider))?.provider;
				policies.set(provider, runtimeProvider?.resolveThinkingProfile ?? resolveProviderPolicySurface(provider, { manifestRegistry: params.metadataSnapshot.manifestRegistry })?.resolveThinkingProfile ?? null);
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
	if (preparedPolicy !== void 0) return preparedPolicy?.(params.context);
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
function resolveThinkingPolicyContext(params) {
	const providerRaw = normalizeOptionalString(params.provider);
	const modelId = normalizeOptionalString(params.model) ?? "";
	const modelKey = normalizeOptionalLowercaseString(params.model) ?? "";
	const candidate = resolveThinkingCatalogEntry(params);
	const thinkingPolicyProvider = normalizeOptionalString(candidate?.thinkingPolicyProvider);
	return {
		catalogEntry: candidate,
		normalizedProvider: providerRaw ? normalizeProviderId(thinkingPolicyProvider ?? providerRaw) : "",
		modelId,
		modelKey,
		api: candidate?.api,
		reasoning: params.configuredReasoning ?? candidate?.configuredReasoning ?? candidate?.reasoning,
		thinkingLevelMap: candidate?.thinkingLevelMap,
		...candidate?.params ? { params: candidate.params } : {},
		compat: candidate?.compat
	};
}
function normalizeProfileLevel(level) {
	const normalized = normalizeThinkLevel(level.id);
	if (!normalized) return;
	return {
		id: normalized,
		label: normalizeOptionalString(level.label) ?? normalized,
		rank: Number.isFinite(level.rank) ? level.rank : THINKING_LEVEL_RANKS[normalized]
	};
}
function normalizeThinkingProfile(profile, thinkingLevelMap, mappedLevels = []) {
	const byId = /* @__PURE__ */ new Map();
	for (const raw of profile.levels) {
		const level = normalizeProfileLevel(raw);
		if (level && (level.id === "adaptive" || level.id === "ultra" || thinkingLevelMap?.[level.id] !== null)) byId.set(level.id, level);
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
function buildBaseThinkingProfile(defaultLevel) {
	return {
		levels: BASE_THINKING_LEVELS.map((id) => ({
			id,
			label: id,
			rank: THINKING_LEVEL_RANKS[id]
		})),
		defaultLevel
	};
}
function buildOffOnlyThinkingProfile() {
	return {
		levels: [{
			id: "off",
			label: "off",
			rank: THINKING_LEVEL_RANKS.off
		}],
		defaultLevel: "off"
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
function appendCatalogAdvancedThinkingLevels(profile, compat, thinkingLevelMap, agentRuntime) {
	if (thinkingLevelMap) {
		for (const level of ["xhigh", "max"]) if (thinkingLevelMap[level] !== void 0 && thinkingLevelMap[level] !== null) appendProfileLevel(profile, level);
	}
	let supportsMax = profile.levels.some(({ id }) => id === "max");
	for (const level of compat?.supportedReasoningEfforts ?? []) if (level === "ultra" || (level === "adaptive" || level === "xhigh" || level === "max") && (level === "adaptive" || thinkingLevelMap?.[level] !== null)) {
		appendProfileLevel(profile, level);
		supportsMax ||= level === "max";
	}
	const runtime = normalizeOptionalLowercaseString(agentRuntime);
	if (supportsMax && (runtime === "openclaw" || runtime === "auto")) appendProfileLevel(profile, "ultra");
}
/** Resolve supported thinking levels and default for a provider/model pair. */
function resolveThinkingProfile(params) {
	const context = resolveThinkingPolicyContext(params);
	if (!context.normalizedProvider) return buildBaseThinkingProfile();
	const providerContext = {
		provider: context.normalizedProvider,
		modelId: context.modelId,
		agentRuntime: params.agentRuntime,
		api: context.api,
		reasoning: context.reasoning,
		thinkingLevelMap: context.thinkingLevelMap,
		...context.params ? { params: context.params } : {},
		compat: context.compat
	};
	const providerProfileParams = {
		provider: context.normalizedProvider,
		context: providerContext,
		...context.catalogEntry ? { catalogEntry: context.catalogEntry } : {}
	};
	const providerProfile = typeof params.providerPolicySource === "object" ? resolveEffectiveThinkingProfile(providerProfileParams, { registry: params.providerPolicySource }) : params.providerPolicySource === "active" ? resolveEffectiveThinkingProfile(providerProfileParams, { allowPublicArtifactFallback: false }) : resolveEffectiveThinkingProfile(providerProfileParams);
	const anthropicMessagesProfile = context.api === "anthropic-messages" ? resolveClaudeThinkingProfile(context.modelId, context.params, { includeNativeMax: true }) : void 0;
	const pluginProfile = providerProfile ?? anthropicMessagesProfile;
	const runtime = normalizeOptionalLowercaseString(params.agentRuntime);
	const mappedLevels = !runtime || runtime === "auto" || runtime === "openclaw" ? listMappedModelThinkingLevels(context).filter((level) => level === "xhigh" || level === "max") : [];
	if (pluginProfile && (context.reasoning !== false || pluginProfile.preserveWhenCatalogReasoningFalse === true)) return normalizeThinkingProfile(pluginProfile, context.thinkingLevelMap, mappedLevels);
	if (context.reasoning === false) return buildOffOnlyThinkingProfile();
	const profile = buildBaseThinkingProfile();
	appendCatalogAdvancedThinkingLevels(profile, context.compat, context.thinkingLevelMap, params.agentRuntime);
	return normalizeThinkingProfile(profile, context.thinkingLevelMap, mappedLevels);
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
	return listThinkingLevelOptions(provider, model, catalog, agentRuntime).map((level) => level.label);
}
/** Format supported thinking level labels for command/status output. */
function formatThinkingLevels(provider, model, separator = ", ", catalog, agentRuntime) {
	return resolveThinkingProfile({
		provider,
		model,
		catalog,
		agentRuntime
	}).levels.map(({ label }) => label).join(separator);
}
/** Resolve the default thinking level for a provider/model pair. */
function resolveThinkingDefaultForModel(params) {
	return resolveThinkingSelectionForModel({
		...params,
		agentRuntime: params.agentRuntime
	}).requestedLevel;
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
	return resolveThinkingSelectionForModel({
		...params,
		agentRuntime: params.agentRuntime
	}).supported;
}
function resolveSupportedThinkingLevelFromProfile(profile, level) {
	if (profile.levels.some((entry) => entry.id === level)) return level;
	if (level === "adaptive" && profile.defaultLevel && profile.defaultLevel !== "off") return profile.defaultLevel;
	const requestedRank = THINKING_LEVEL_RANKS[level];
	const ranked = profile.levels.toSorted((a, b) => b.rank - a.rank);
	return ranked.find((entry) => entry.id !== "off" && entry.rank <= requestedRank)?.id ?? ranked.findLast((entry) => entry.id !== "off")?.id ?? "off";
}
/** Clamp a requested thinking level to the closest supported provider/model level. */
function resolveSupportedThinkingLevel(params) {
	return resolveThinkingSelectionForModel({
		...params,
		agentRuntime: params.agentRuntime
	}).level;
}
//#endregion
export { listThinkingLevelOptions as a, resolveSupportedThinkingLevelFromProfile as c, resolveThinkingSelectionForModel as d, prepareModelCatalogThinkingPolicies as f, listThinkingLevelLabels as i, resolveThinkingDefaultForModel as l, formatThinkingLevels as n, listThinkingLevels as o, resolveActiveProviderThinkingProfile as p, isThinkingLevelSupported as r, resolveSupportedThinkingLevel as s, createThinkingCatalogResolver as t, resolveThinkingProfile as u };
