import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { l as normalizeProviderModelIdWithRuntime, o as normalizeModelRef, p as getActivePluginRegistryWorkspaceDirFromStateCore } from "./model-ref-shared-BRJ3VRZV.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-BWMrcMOM.mjs";
import { r as resolveAgentConfig, s as resolveAgentModelConfigForRuntime } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-Cn4izUMk.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { t as hasUtilityModelSeparationMigrationMarker } from "./utility-model-separation-migration-CmYYNsY8.mjs";
import { i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { C as hasExactConfiguredProviderModel, S as allowsPluginModelNormalization, b as readUtilityModelSetting, h as resolveConfiguredModelRef, i as buildModelAliasIndex, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { o as isFailoverError } from "./error-Bcp4ZyOv.mjs";
import { n as resolveConfiguredModelFallbacks, r as resolveModelAliasFromPair } from "./model-selection-resolve-B4Z5ZIMD.mjs";
import { i as resolveContextTokensForModelFromCache } from "./context-resolution-CKREdq15.mjs";
import { t as isPluginProvidersLoadInFlight } from "./providers.runtime-CGIaZ9Jy.mjs";
import { t as extractObservedOverflowTokenCount } from "./context-overflow-observation-BkrW1kAi.mjs";
//#region src/agents/model-fallback-candidates.ts
/** Resolves ordered model and image fallback candidate chains. */
const MAX_FALLBACK_CANDIDATE_CACHE_ENTRIES = 256;
const fallbackCandidateCache = /* @__PURE__ */ new Map();
const fallbackContextIds = /* @__PURE__ */ new WeakMap();
let nextFallbackContextId = 0;
const log = createSubsystemLogger("model-selection");
/** Prefer known headroom without dropping operator-selected models with incomplete metadata. */
function preferContextFitFallbackCandidates(params) {
	if (!isFailoverError(params.error) || params.error.reason !== "context_overflow" || params.error.requestSizeCeiling) return params.candidates;
	const failedCandidate = params.candidates[params.failedIndex];
	if (!failedCandidate) return params.candidates;
	const contextTokens = (candidate) => resolveContextTokensForModelFromCache({
		cfg: params.cfg,
		...candidate,
		allowUnscopedModelLookup: false
	});
	const failedTokens = contextTokens(failedCandidate);
	const requiredTokens = extractObservedOverflowTokenCount(params.error.rawError ?? params.error.message) ?? (failedTokens === void 0 ? void 0 : failedTokens + 1);
	if (requiredTokens === void 0) return params.candidates;
	const remaining = params.candidates.slice(params.failedIndex + 1).map((candidate) => ({
		candidate,
		fits: (contextTokens(candidate) ?? 0) >= requiredTokens
	})).toSorted((left, right) => Number(right.fits) - Number(left.fits)).map(({ candidate }) => candidate);
	return [...params.candidates.slice(0, params.failedIndex + 1), ...remaining];
}
function createModelCandidateCollector() {
	const seen = /* @__PURE__ */ new Set();
	const candidates = [];
	const addCandidate = (candidate, routeOrigin, routeResolution) => {
		if (!candidate.provider || !candidate.model) return;
		const key = JSON.stringify([candidate.provider, candidate.model]);
		if (seen.has(key)) return;
		seen.add(key);
		candidates.push({
			...candidate,
			routeOrigin,
			routeResolution
		});
	};
	return {
		candidates,
		addCandidate
	};
}
function resolveImageFallbackCandidates(params) {
	const primary = resolveAgentModelPrimaryValue(params.cfg?.agents?.defaults?.imageModel);
	let defaultProvider = DEFAULT_PROVIDER;
	if (primary?.trim()) {
		const primaryAliasIndex = buildModelAliasIndex({
			cfg: params.cfg ?? {},
			defaultProvider: DEFAULT_PROVIDER,
			manifestPlugins: params.manifestPlugins
		});
		defaultProvider = resolveModelRefFromString({
			cfg: params.cfg,
			raw: primary,
			defaultProvider: "openai",
			aliasIndex: primaryAliasIndex,
			manifestPlugins: params.manifestPlugins
		})?.ref.provider || "openai";
	}
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg ?? {},
		defaultProvider,
		manifestPlugins: params.manifestPlugins
	});
	const { candidates, addCandidate } = createModelCandidateCollector();
	const addRaw = (raw, routeOrigin) => {
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			raw,
			defaultProvider,
			aliasIndex,
			manifestPlugins: params.manifestPlugins
		});
		if (!resolved) {
			log.warn(`Unresolved image model "${sanitizeForLog(raw)}"; skipped ${routeOrigin} candidate.`);
			return;
		}
		addCandidate(resolved.ref, routeOrigin, "resolved");
	};
	if (params.modelOverride?.trim()) addRaw(params.modelOverride, "requested");
	else if (primary?.trim()) addRaw(primary, "configured-primary");
	const imageFallbacks = resolveAgentModelFallbackValues(params.cfg?.agents?.defaults?.imageModel);
	for (const raw of imageFallbacks) addRaw(raw, "configured-fallback");
	return candidates;
}
function resolveModelCandidateChain(params) {
	const { cacheKey, manifestPlugins } = resolveFallbackCandidateContext(params);
	const cached = cacheKey ? fallbackCandidateCache.get(cacheKey) : void 0;
	if (cached) return cached.map((candidate) => Object.assign({}, candidate));
	const candidates = resolveFallbackCandidatesUncached({
		...params,
		manifestPlugins
	});
	if (cacheKey) {
		fallbackCandidateCache.set(cacheKey, candidates.map((candidate) => Object.assign({}, candidate)));
		pruneMapToMaxSize(fallbackCandidateCache, MAX_FALLBACK_CANDIDATE_CACHE_ENTRIES);
	}
	return candidates;
}
function getFallbackContextId(value) {
	const existing = fallbackContextIds.get(value);
	if (existing !== void 0) return existing;
	const id = nextFallbackContextId++;
	fallbackContextIds.set(value, id);
	return id;
}
function resolveFallbackCandidateContext(params) {
	if (params.manifestPlugins !== void 0) return {
		cacheKey: null,
		manifestPlugins: params.manifestPlugins
	};
	const workspaceDir = getActivePluginRegistryWorkspaceDirFromStateCore();
	const env = process.env;
	const pluginMetadata = getCurrentPluginMetadataSnapshot({
		env,
		workspaceDir,
		allowWorkspaceScopedSnapshot: true
	});
	const providerLoadMetadata = getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		env,
		workspaceDir,
		allowWorkspaceScopedSnapshot: true,
		requireDefaultDiscoveryContext: params.cfg === void 0
	});
	if (isPluginProvidersLoadInFlight({
		config: params.cfg,
		workspaceDir,
		env,
		...providerLoadMetadata ? { pluginMetadataSnapshot: providerLoadMetadata } : {},
		activate: false
	})) return {
		cacheKey: null,
		manifestPlugins: providerLoadMetadata
	};
	const registryState = getPluginRegistryState();
	const registry = getPluginRuntimeGenerationRegistry() ?? getPluginRegistryForContext();
	const agentConfig = params.cfg && params.agentId ? resolveAgentConfig(params.cfg, params.agentId) : void 0;
	return {
		cacheKey: JSON.stringify({
			agentId: params.agentId,
			agentModel: resolveAgentModelConfigForRuntime(agentConfig),
			agentModels: agentConfig?.models,
			provider: params.provider,
			model: params.model,
			requestedRouteResolution: params.requestedRouteResolution,
			allowPluginNormalization: params.allowPluginNormalization,
			fallbacksOverride: params.fallbacksOverride,
			agentsDefaultsModel: params.cfg?.agents?.defaults?.model,
			agentsDefaultsModels: params.cfg?.agents?.defaults?.models,
			utilityModel: params.cfg ? readUtilityModelSetting(params.cfg, params.agentId) : void 0,
			utilityModelSeparation: hasUtilityModelSeparationMigrationMarker(params.cfg),
			modelProviders: resolveFallbackCandidateModelProviderCacheParts(params.cfg),
			pluginControlPlane: resolvePluginControlPlaneFingerprint({
				config: params.cfg,
				env,
				workspaceDir
			}),
			pluginMetadataFingerprint: pluginMetadata?.configFingerprint ?? null,
			pluginMetadataIdentity: pluginMetadata ? getFallbackContextId(pluginMetadata) : null,
			normalizationMetadataIdentity: providerLoadMetadata ? getFallbackContextId(providerLoadMetadata) : null,
			pluginRegistryIdentity: registry ? getFallbackContextId(registry) : null,
			pluginRegistryKey: registryState?.key ?? null,
			pluginRegistryVersion: registryState?.activeVersion ?? null,
			pluginWorkspaceDir: workspaceDir ?? null
		}),
		manifestPlugins: providerLoadMetadata
	};
}
function resolveFallbackCandidateModelProviderCacheParts(cfg) {
	const providers = cfg?.models?.providers;
	if (!providers) return;
	return Object.entries(providers).map(([providerId, providerConfig]) => ({
		providerId,
		api: typeof providerConfig?.api === "string" ? providerConfig.api : void 0,
		models: Array.isArray(providerConfig?.models) ? providerConfig.models.map((entry) => typeof entry?.id === "string" ? entry.id : void 0).filter((id) => id !== void 0) : []
	}));
}
function resolveFallbackCandidatesUncached(params) {
	const primary = params.cfg ? resolveConfiguredModelRef({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: false,
		manifestPlugins: params.manifestPlugins
	}) : null;
	const defaultProvider = primary?.provider ?? "openai";
	const defaultModel = primary?.model ?? "gpt-6-astra";
	const providerRaw = normalizeOptionalString(params.provider) || defaultProvider;
	const modelRaw = normalizeOptionalString(params.model) || defaultModel;
	const allowPluginModelAliases = params.allowPluginNormalization !== false && params.cfg?.plugins?.enabled !== false;
	const requestedRouteResolution = params.requestedRouteResolution ?? "raw";
	const normalizedPrimary = requestedRouteResolution === "resolved" ? {
		provider: normalizeProviderId(providerRaw),
		model: modelRaw
	} : normalizeModelRef(providerRaw, modelRaw, {
		allowPluginNormalization: params.allowPluginNormalization !== false && allowsPluginModelNormalization({
			cfg: params.cfg,
			provider: providerRaw,
			model: modelRaw
		}),
		manifestPlugins: params.manifestPlugins
	});
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg ?? {},
		agentId: params.agentId,
		defaultProvider,
		allowPluginNormalization: allowPluginModelAliases,
		manifestPlugins: params.manifestPlugins
	});
	const { candidates, addCandidate } = createModelCandidateCollector();
	let requestedCandidate = normalizedPrimary;
	const exactRequestedRouteConfigured = hasExactConfiguredProviderModel({
		cfg: params.cfg,
		provider: normalizedPrimary.provider,
		model: normalizedPrimary.model
	}) || aliasIndex.byKey.has(modelKey(normalizedPrimary.provider, normalizedPrimary.model));
	if (requestedRouteResolution === "raw" && !exactRequestedRouteConfigured) requestedCandidate = resolveModelAliasFromPair({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: providerRaw,
		model: modelRaw,
		defaultProvider,
		aliasIndex,
		allowPluginNormalization: params.allowPluginNormalization !== false && allowsPluginModelNormalization({
			cfg: params.cfg,
			provider: providerRaw,
			model: modelRaw
		}),
		manifestPlugins: params.manifestPlugins
	}) ?? normalizedPrimary;
	addCandidate(requestedCandidate, "requested", params.manifestPlugins !== void 0 ? "resolved" : requestedRouteResolution);
	const modelFallbacks = params.fallbacksOverride !== void 0 ? params.fallbacksOverride : params.cfg ? resolveConfiguredModelFallbacks({
		cfg: params.cfg,
		agentId: params.agentId
	}) : [];
	for (const raw of modelFallbacks) {
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			agentId: params.agentId,
			raw,
			defaultProvider,
			aliasIndex,
			allowPluginNormalization: allowPluginModelAliases,
			manifestPlugins: params.manifestPlugins
		});
		if (!resolved) continue;
		addCandidate(resolved.ref, "configured-fallback", "resolved");
	}
	if (params.fallbacksOverride === void 0 && primary?.provider && primary.model) {
		let model = primary.model;
		if (allowPluginModelAliases && allowsPluginModelNormalization({
			cfg: params.cfg,
			...primary
		})) model = normalizeProviderModelIdWithRuntime({
			provider: primary.provider,
			context: {
				provider: primary.provider,
				modelId: model
			}
		}) ?? model;
		addCandidate({
			...primary,
			model
		}, "configured-primary", "resolved");
	}
	return candidates;
}
//#endregion
export { resolveImageFallbackCandidates as n, resolveModelCandidateChain as r, preferContextFitFallbackCandidates as t };
