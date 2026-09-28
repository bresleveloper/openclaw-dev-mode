import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { r as isModelThinkingFormat } from "./model-config-vocabulary-CIfiDXNP.mjs";
import "./types.models-ZwQV51CR.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { t as modelTransportRoutesMatch } from "./model-compat-catalog-DU9GPmr_.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-BbSyhfVf.mjs";
import { i as resolveProviderModelPolicySurface, n as createProviderModelRoutesResolver, r as resolveProviderModelCatalogId } from "./provider-model-routes-CNgNpH_2.mjs";
import { o as selectProviderModelRouteAuth } from "./provider-model-route-auth-DkAaX3ui.mjs";
import { n as resolveModelRouteIntent } from "./model-runtime-policy-IbIjya7U.mjs";
import { n as createProviderModelCatalogRoutePolicy, t as canonicalizeProviderModelId } from "./provider-model-route-D-_CCdkJ.mjs";
//#region src/agents/openai-model-routes.ts
const OPENAI_PROVIDER_ID = "openai";
function createOpenAIModelRoutesResolver(params) {
	const resolveRoutes = createProviderModelRoutesResolver({
		provider: OPENAI_PROVIDER_ID,
		config: params.config,
		env: params.env,
		requestTransportOverrides: params.requestTransportOverrides
	});
	return (observed) => {
		const routeIntent = observed.routeIntent ?? resolveModelRouteIntent({
			config: params.config,
			provider: OPENAI_PROVIDER_ID,
			modelId: observed.modelId,
			agentId: params.agentId,
			primaryModel: params.primaryModel,
			resolveProfileAuthMode: params.resolveProfileAuthMode
		});
		return resolveRoutes({
			modelId: observed.modelId ? splitTrailingAuthProfile(observed.modelId).model : void 0,
			routeIntent: routeIntent?.source === "inherited" && routeIntent.authRequirement && observed.pinnedAuthRequirement && routeIntent.authRequirement !== observed.pinnedAuthRequirement ? {
				...routeIntent,
				authRequirement: observed.pinnedAuthRequirement,
				source: "explicit"
			} : routeIntent,
			observedRoutes: observed.observedRoutes ?? (observed.api != null || observed.baseUrl !== void 0 && observed.baseUrl !== null ? [{
				api: observed.api,
				baseUrl: observed.baseUrl
			}] : void 0)
		});
	};
}
/** Returns the authored OpenAI provider auth mode, if one exists. */
function resolveConfiguredOpenAIAuthMode(config) {
	return resolveMergedModelProviderConfig(config, OPENAI_PROVIDER_ID)?.auth;
}
function selectOpenAIModelRouteAuth(params) {
	return selectProviderModelRouteAuth({
		provider: OPENAI_PROVIDER_ID,
		...params
	});
}
const openAIModelCatalogRoutePolicy = createProviderModelCatalogRoutePolicy(OPENAI_PROVIDER_ID);
/** Canonical catalog identity without ambiguity between provider and model segments. */
function resolveModelCatalogIdentityKey(entry) {
	return resolveModelCatalogIdentityKeyWithPolicies(entry);
}
/** Reuses each provider policy only for one synchronous catalog operation. */
function createModelCatalogIdentityKeyResolver() {
	const policies = /* @__PURE__ */ new Map();
	return (entry) => resolveModelCatalogIdentityKeyWithPolicies(entry, policies);
}
function resolveModelCatalogIdentityKeyWithPolicies(entry, policies) {
	const provider = normalizeProviderId(entry.provider);
	const modelId = splitTrailingAuthProfile(entry.id).model;
	let surface = policies?.get(provider);
	if (policies && surface === void 0) {
		surface = resolveProviderModelPolicySurface(provider);
		policies.set(provider, surface);
	}
	const id = resolveProviderModelCatalogId({
		provider,
		modelId,
		surface
	}) ?? entry.id;
	return JSON.stringify([provider, id]);
}
/** Resolves provider-owned OpenAI route state without loading the full provider runtime. */
function resolveOpenAIModelRoutes(params) {
	if (normalizeProviderId(params.provider ?? "") !== OPENAI_PROVIDER_ID) return null;
	return createOpenAIModelRoutesResolver({
		config: params.config,
		agentId: params.agentId,
		primaryModel: params.primaryModel,
		resolveProfileAuthMode: params.resolveProfileAuthMode,
		env: params.env,
		requestTransportOverrides: params.requestTransportOverrides
	})({
		modelId: params.modelId,
		api: params.api,
		baseUrl: params.baseUrl,
		routeIntent: params.routeIntent,
		pinnedAuthRequirement: params.pinnedAuthRequirement
	});
}
//#endregion
//#region src/agents/model-catalog-lookup.ts
/**
* Looks up model catalog entries and input capability support.
*/
/** Projects only thinking policy fields from broader model compatibility metadata. */
function projectModelThinkingCompat(compat) {
	const record = asOptionalRecord(compat);
	if (!record) return;
	const projected = {};
	if (typeof record.thinkingFormat === "string" && isModelThinkingFormat(record.thinkingFormat)) projected.thinkingFormat = record.thinkingFormat;
	if (record.supportedReasoningEfforts === null) projected.supportedReasoningEfforts = null;
	else if (Array.isArray(record.supportedReasoningEfforts) && record.supportedReasoningEfforts.every((effort) => typeof effort === "string")) projected.supportedReasoningEfforts = [...record.supportedReasoningEfforts];
	return Object.keys(projected).length > 0 ? projected : void 0;
}
/** Freezes thinking capability from the selected prepared catalog row. */
function prepareModelThinkingCapability(params) {
	const compat = projectModelThinkingCompat(params.entry?.compat);
	const provider = normalizeProviderId(params.entry?.provider ?? "");
	const modelId = normalizeOptionalString(params.entry?.id);
	const agentRuntime = normalizeLowercaseStringOrEmpty(params.agentRuntime);
	if (!compat || !provider || !modelId || !agentRuntime) return;
	const routeSource = params.route ?? (agentRuntime === "openclaw" ? params.entry : void 0);
	const api = normalizeOptionalString(routeSource?.api);
	const baseUrl = normalizeOptionalString(routeSource?.baseUrl);
	if (agentRuntime === "openclaw" && (!api || !baseUrl)) return;
	return {
		provider,
		modelId,
		agentRuntime,
		...api && baseUrl ? { route: {
			api,
			baseUrl
		} } : {},
		compat
	};
}
/** Resolves prepared thinking metadata only for the exact final model route and harness. */
function resolvePreparedModelThinkingCompat(params) {
	const capability = params.capability;
	if (!capability) return;
	const runtimeModelId = canonicalizeProviderModelId(capability.provider, params.model.id);
	const preparedModelId = canonicalizeProviderModelId(capability.provider, capability.modelId);
	if (normalizeProviderId(params.model.provider) !== capability.provider || runtimeModelId !== preparedModelId || normalizeLowercaseStringOrEmpty(params.agentRuntime) !== capability.agentRuntime || capability.route && !modelTransportRoutesMatch(params.model, capability.route)) return;
	const { supportedReasoningEfforts: efforts, ...compat } = capability.compat;
	if (efforts === void 0) return compat;
	const routeEfforts = projectModelThinkingCompat(params.model.compat)?.supportedReasoningEfforts;
	const enabledEfforts = efforts?.filter((effort) => effort !== "none");
	return {
		...compat,
		supportedReasoningEfforts: capability.route ? efforts?.slice() : routeEfforts?.includes("none") ? ["none", ...enabledEfforts ?? []] : enabledEfforts
	};
}
/** Projects the prepared capabilities needed by one selected run candidate. */
function prepareModelRunCapabilities([catalog, configuredCatalog], [provider, modelId, agentRuntime]) {
	const entry = findModelInCatalog(catalog ?? [], provider, modelId);
	const configuredEntry = findModelInCatalog(configuredCatalog, provider, modelId);
	return {
		modelHasVision: modelSupportsInput(entry, "image"),
		modelThinkingCapability: prepareModelThinkingCapability({
			entry: entry ?? configuredEntry,
			route: agentRuntime === "openclaw" ? configuredEntry ?? entry : void 0,
			agentRuntime
		})
	};
}
/** Returns whether a catalog entry declares support for an input modality. */
function modelSupportsInput(entry, input) {
	return entry?.input?.includes(input) ?? false;
}
/** Prefers canonical identity; the shipped SDK's case-insensitive fallback must be unique. */
function findModelInCatalog(catalog, provider, modelId) {
	const normalizedProvider = normalizeProviderId(provider);
	const trimmedModelId = modelId.trim();
	const providerCatalog = [];
	let literal;
	catalog.some((entry) => {
		if (normalizeProviderId(entry.provider) !== normalizedProvider) return false;
		if (entry.id === trimmedModelId) {
			literal = entry;
			return true;
		}
		providerCatalog.push(entry);
		return false;
	});
	if (literal) return literal;
	const surface = resolveProviderModelPolicySurface(normalizedProvider);
	const identityOf = (id) => resolveProviderModelCatalogId({
		provider: normalizedProvider,
		modelId: splitTrailingAuthProfile(id).model,
		surface
	}) ?? id;
	const identity = identityOf(trimmedModelId);
	const exact = providerCatalog.find((entry) => identityOf(entry.id) === identity);
	if (exact) return exact;
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	const matches = providerCatalog.filter((entry) => normalizeLowercaseStringOrEmpty(entry.id) === normalizedModelId);
	return matches.length === 1 ? matches[0] : void 0;
}
/** Finds a model entry, requiring uniqueness when provider is omitted. */
function findModelCatalogEntry(catalog, params) {
	const modelId = normalizeOptionalString(params.modelId) ?? "";
	if (!modelId) return;
	const provider = normalizeOptionalString(params.provider);
	if (provider) return findModelInCatalog(catalog, provider, modelId);
	const keyOf = createModelCatalogIdentityKeyResolver();
	const exact = catalog.filter((entry) => keyOf(entry) === keyOf({
		provider: entry.provider,
		id: modelId
	}));
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	const matches = exact.length ? exact : catalog.filter((entry) => normalizeLowercaseStringOrEmpty(entry.id) === normalizedModelId);
	return matches.length === 1 ? matches[0] : void 0;
}
//#endregion
export { projectModelThinkingCompat as a, createOpenAIModelRoutesResolver as c, resolveModelCatalogIdentityKey as d, resolveOpenAIModelRoutes as f, prepareModelRunCapabilities as i, openAIModelCatalogRoutePolicy as l, findModelInCatalog as n, resolvePreparedModelThinkingCompat as o, selectOpenAIModelRouteAuth as p, modelSupportsInput as r, createModelCatalogIdentityKeyResolver as s, findModelCatalogEntry as t, resolveConfiguredOpenAIAuthMode as u };
